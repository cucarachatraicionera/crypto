"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { sendSol } from "../../utils/solanaUtils";
import { useState, useRef } from "react";
import { HiArrowDown } from "react-icons/hi";
import { SiSolana } from "react-icons/si";
import { FaCoins } from "react-icons/fa";
import confetti from "canvas-confetti";

const PRICE_PER_PKP = 0.001;

type SwapButtonProps = {
  recipient: string;
};

const SwapButton = ({ recipient }: SwapButtonProps) => {
  const wallet = useWallet();
  const [solAmount, setSolAmount] = useState("");
  const [pkpAmount, setPkpAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const confettiCanvasRef = useRef<HTMLDivElement | null>(null);

  const handlePkpChange = (value: string) => {
    setPkpAmount(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setSolAmount((parsed * PRICE_PER_PKP).toFixed(3));
    } else {
      setSolAmount("");
    }
  };

  const handleSolChange = (value: string) => {
    setSolAmount(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setPkpAmount((parsed / PRICE_PER_PKP).toFixed(0));
    } else {
      setPkpAmount("");
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 1000,
    });
  };

  const handleSwap = async () => {
    setStatusMessage(null);
    setTxHash(null);

    const amount = parseFloat(solAmount);
    if (!amount || amount <= 0) {
      setStatusMessage("❌ Monto inválido.");
      return;
    }

    try {
      setIsLoading(true);
      if (!wallet.connected) await wallet.connect();
      if (!wallet.publicKey) {
        setStatusMessage("❌ Wallet no detectada.");
        return;
      }

      const signature = await sendSol(wallet, recipient);
      if (signature) {
        setTxHash(signature);
        setStatusMessage("✅ Transacción realizada con éxito.");
        triggerConfetti();
      } else {
        setStatusMessage("❌ Error en la transacción.");
      }
    } catch (err) {
      console.error("Swap error:", err);
      setStatusMessage("❌ Error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const amountIsValid = parseFloat(solAmount) > 0;

  return (
    <div
      className="w-full max-w-md sm:max-w-lg mx-auto bg-gradient-to-br from-[#1f3b70] to-[#122f52]
                 rounded-2xl p-6 sm:p-8 border border-blue-800
                 shadow-xl hover:shadow-blue-500/30 hover:scale-105
                 transition-all duration-300 ease-in-out px-4"
      ref={confettiCanvasRef}
    >
      <div className="mb-4">
        <label className="text-white text-sm font-light mb-2 block">You Pay (PKP)</label>
        <div className="relative bg-[#2c2c2c] rounded-xl p-3">
          <input
            type="number"
            value={pkpAmount}
            onChange={(e) => handlePkpChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-white text-2xl font-semibold outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <FaCoins className="text-pink-400 text-xl" />
            <span className="text-white font-medium">PKP</span>
          </div>
        </div>
      </div>

      {/* Swap arrow */}
      <div className="flex justify-center my-3">
        <div className="bg-[#2c2c2c] p-2 rounded-full border border-neutral-700">
          <HiArrowDown className="text-white text-xl" />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-white text-sm font-light mb-2 block">You Receive (SOL)</label>
        <div className="relative bg-[#2c2c2c] rounded-xl p-3">
          <input
            type="number"
            value={solAmount}
            onChange={(e) => handleSolChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-white text-2xl font-semibold outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <SiSolana className="text-cyan-400 text-xl" />
            <span className="text-white font-medium">SOL</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSwap}
        disabled={isLoading || !wallet || !amountIsValid}
        className={`w-full font-bold py-3 rounded-xl transition duration-300 ${
          !wallet.connected
            ? "bg-[#3a1c47] text-pink-400 cursor-pointer"
            : "bg-[#0f0f0f] text-white hover:brightness-110 hover:scale-105"
        }`}
      >
        {isLoading
          ? "Enviando..."
          : !wallet.connected
          ? "Conectar Wallet"
          : "Confirmar Swap"}
      </button>

      {statusMessage && (
        <p className="text-sm mt-4 text-center text-white">{statusMessage}</p>
      )}
      {txHash && (
        <p className="text-sm text-cyan-300 mt-2 text-center break-all">
          Tx: {txHash}
        </p>
      )}
    </div>
  );
};

export default SwapButton;

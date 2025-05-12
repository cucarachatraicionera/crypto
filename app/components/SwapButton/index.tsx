"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { sendSol } from "../../utils/solanaUtils";
import { useState } from "react";
import { HiArrowsRightLeft } from "react-icons/hi2";
import { FaCoins } from "react-icons/fa";
import { SiSolana } from "react-icons/si";

const PRICE_PER_PKP = 0.001; // 1 PKP = 0.001 SOL

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

  const handleSolChange = (value: string) => {
    setSolAmount(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setPkpAmount((parsed / PRICE_PER_PKP).toFixed(0));
    } else {
      setPkpAmount("");
    }
  };

  const handlePkpChange = (value: string) => {
    setPkpAmount(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setSolAmount((parsed * PRICE_PER_PKP).toFixed(3));
    } else {
      setSolAmount("");
    }
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

  return (
    <div className="w-full max-w-md bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-white/10 text-white">
      <h3 className="text-xl font-semibold mb-6 text-center">Swap SOL → PinkyPromise</h3>

      {/* SOL INPUT */}
      <div className="mb-4">
        <label className="text-sm mb-1 block">Tú envías</label>
        <div className="relative flex items-center">
          <input
            type="number"
            value={solAmount}
            onChange={(e) => handleSolChange(e.target.value)}
            className="w-full p-3 pr-16 rounded-lg bg-white text-black outline-none"
            placeholder="0.001"
          />
          <div className="absolute right-3 flex items-center gap-1 text-black font-bold">
            <SiSolana className="text-lg" />
            SOL
          </div>
        </div>
      </div>

      {/* ICONO SWAP */}
      <div className="flex justify-center my-2">
        <HiArrowsRightLeft className="text-2xl text-cyan-400" />
      </div>

      {/* PKP INPUT */}
      <div className="mb-4">
        <label className="text-sm mb-1 block">Recibes</label>
        <div className="relative flex items-center">
          <input
            type="number"
            value={pkpAmount}
            onChange={(e) => handlePkpChange(e.target.value)}
            className="w-full p-3 pr-16 rounded-lg bg-white text-black outline-none"
            placeholder="1000"
          />
          <div className="absolute right-3 flex items-center gap-1 text-black font-bold">
            <FaCoins className="text-lg" />
            PKP
          </div>
        </div>
      </div>

      {/* SWAP BUTTON */}
      <button
        onClick={handleSwap}
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 bg-[#64cdff] text-black font-bold py-3 rounded-full hover:bg-[#4dbde6] transition duration-300 shadow-md"
      >
        {isLoading ? "Enviando..." : "Swap"}
        <HiArrowsRightLeft className="text-xl" />
      </button>

      {/* STATUS */}
      {statusMessage && (
        <p className="text-sm mt-4 text-center">{statusMessage}</p>
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

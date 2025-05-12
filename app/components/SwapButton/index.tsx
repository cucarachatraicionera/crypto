"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { sendSol } from "../../utils/solanaUtils";
import { useState } from "react";
import { HiArrowsRightLeft } from "react-icons/hi2";

type SwapButtonProps = {
  recipient: string;
  amount: number;
};

const SwapButton = ({ recipient, amount }: SwapButtonProps) => {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSwap = async () => {
    setStatusMessage(null);
    setTxHash(null);

    try {
      setIsLoading(true);
      if (!wallet.connected) await wallet.connect();
      if (!wallet.publicKey) {
        setStatusMessage("❌ Wallet no detectada");
        return;
      }
      const signature = await sendSol(wallet, recipient);
      if (signature) {
        setTxHash(signature);
        setStatusMessage("✅ Pago realizado correctamente");
      } else {
        setStatusMessage("❌ Falló la transacción");
      }
    } catch (error) {
      console.error("Swap error:", error);
      setStatusMessage("❌ Error durante el swap");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button
        onClick={handleSwap}
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 bg-[#64cdff] text-black font-bold py-3 rounded-full hover:bg-[#4dbde6] transition duration-300 shadow-md"
      >
        {isLoading ? "Enviando..." : "Swap"}
        <HiArrowsRightLeft className="text-xl" />
      </button>
      {statusMessage && (
        <p className="text-sm mt-2 text-white text-center">{statusMessage}</p>
      )}
      {txHash && (
        <p className="text-sm text-cyan-300 mt-1 text-center break-words">
          Tx: {txHash}
        </p>
      )}
    </div>
  );
};

export default SwapButton;

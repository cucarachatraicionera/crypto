import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import * as splToken from "@solana/spl-token";
import bs58 from "bs58";

const SOLANA_RPC_URL = "https://api.devnet.solana.com";

// Función para obtener el balance de una cuenta
export const getBalance = async (recipientAddress: string): Promise<number> => {
    try {
        const connection = new Connection(SOLANA_RPC_URL, "confirmed");
        const publicKey = new PublicKey(recipientAddress);
        const balance = await connection.getBalance(publicKey);
        return balance / 1e9; // Convertir lamports a SOL
    } catch (error) {
        console.error("Error al obtener el saldo:", error);
        return 0;
    }
};

// Función para enviar SOL
export const sendSol = async (wallet: WalletContextState, recipientAddress: string): Promise<string | null> => {
    if (!wallet || !wallet.publicKey) {
        alert("Conecta tu billetera primero");
        return null;
    }

    try {
        const connection = new Connection(SOLANA_RPC_URL, "confirmed");
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey(recipientAddress),
                lamports: 0.001 * 1e9, // 0.1 SOL en lamports
            })
        );

        const signature = await wallet.sendTransaction(transaction, connection);
        console.log("Transacción enviada con éxito:", signature);

        alert(`Transacción enviada: ${signature}\n\nHaz clic para copiar el hash.`);
        navigator.clipboard.writeText(signature);

        return signature;
    } catch (err) {
        console.error("Error al enviar SOL:", err);
        alert("Error al enviar SOL");
        return null;
    }
};

// Función para enviar un SPL Token
export const sendSplToken = async (
    wallet: WalletContextState,
    recipientAddress: string,
    mintAddress: string,
    amount: number,
    secretKey: string
): Promise<string | null> => {
    if (!wallet || !wallet.publicKey) {
        alert("Conecta tu billetera primero");
        return null;
    }

    try {
        const connection = new Connection(SOLANA_RPC_URL, "confirmed");
        const payer = wallet.publicKey;
        const receiver = new PublicKey(recipientAddress);
        const mint = new PublicKey(mintAddress);
        const feePayer = Keypair.fromSecretKey(Uint8Array.from(bs58.decode(secretKey)));

        // Obtener la cantidad en lamports
        const tokenDecimals = await splToken.getMint(connection, mint);
        const amountInLamports = amount * 10 ** tokenDecimals.decimals;

        // Obtener o crear las cuentas de token asociadas
        const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
            connection,
            feePayer,
            mint,
            payer
        );

        const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
            connection,
            feePayer,
            mint,
            receiver
        );

        // Realizar la transferencia
        const transactionSignature = await splToken.transfer(
            connection,
            feePayer,
            fromTokenAccount.address,
            toTokenAccount.address,
            payer,
            amountInLamports,
            [feePayer]
        );

        console.log("Token enviado con éxito:", transactionSignature);
        alert(`Token enviado: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet\n\nHaz clic para copiar el hash.`);
        navigator.clipboard.writeText(transactionSignature);

        return transactionSignature;
    } catch (error) {
        console.error("Error al enviar SPL Token:", error);
        alert("Error al enviar SPL Token");
        return null;
    }
};
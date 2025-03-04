import dotenv from 'dotenv';
import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';

dotenv.config();
const JETTON_MINTER_ADDRESS = process.env.JETTON_MINTER_ADDRESS as string;

const TO_MINT: bigint = 1_000_000n;

export async function run(provider: NetworkProvider) {

    const jettonMinter = provider.open(JettonMinter.createFromAddress(Address.parse(JETTON_MINTER_ADDRESS)));

    await jettonMinter.sendMint(provider.sender(), {
        value: toNano('0.08'),
        queryId: BigInt(Math.floor(Date.now() / 1000)),
        toAddress: Address.parse("UQCVSjegGs-QZqfko9lKBHMNQt6dHPSI3m8xD6ipmtHRRv_G"),
        tonAmount: toNano('0.05'),
        jettonAmountToMint: TO_MINT * 10n**9n,
        fromAddress: Address.parse(JETTON_MINTER_ADDRESS)
    });
}

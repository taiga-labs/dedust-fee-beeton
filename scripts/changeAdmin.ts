import dotenv from 'dotenv';
import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';

dotenv.config();
const JETTON_MINTER_ADDRESS = process.env.JETTON_MINTER_ADDRESS as string;

export async function run(provider: NetworkProvider) {

    const jettonMinter = provider.open(JettonMinter.createFromAddress(Address.parse(JETTON_MINTER_ADDRESS)));
    await jettonMinter.sendChangeAdmin(provider.sender(), {
        value: toNano('0.02'),
        queryId: BigInt(Math.floor(Date.now() / 1000)),
        newAdmin: Address.parse("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c")
    });
}
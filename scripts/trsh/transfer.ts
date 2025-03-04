import { Address, beginCell, toNano } from '@ton/core';
import { JettonWallet } from '../../wrappers/JettonWallet';
import { NetworkProvider } from '@ton/blueprint';



const JETTON_WALLET_ADDRESS = ""


export async function run(provider: NetworkProvider) {
    const userJettonWallet = provider.open(JettonWallet.createFromAddress(Address.parse(JETTON_WALLET_ADDRESS)));

    await userJettonWallet.sendTransfer(provider.sender(), {
        value: toNano("0.05"),
        qi: BigInt(Math.floor(Date.now() / 1000)),
        jettonAmount: toNano("100"),
        recipientAddress: Address.parse(""),
        forwardTONAmount: toNano("0"),
        forwardPayload: beginCell().storeUint(3818968194,32).endCell()
    })
}

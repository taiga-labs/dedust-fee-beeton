import { Address, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildjettonMinterContentCell } from '../helpers/metadata';

export async function run(provider: NetworkProvider) {
    const jettonMinter = provider.open(JettonMinter.createFromConfig({
        total_supply: 0n, // 0 jetton on the moment of deploying
        admin_address: provider.sender().address as Address,
        content: buildjettonMinterContentCell({
            name: "TEST2 S.O.T.A",
            description: "State Of The Art (by Beeton) @sotatoken",
            symbol: "TEST2 SOTA",
            decimals: "9",
            image: "https://beetontoken.space/wp-content/uploads/2025/02/sota_word.png"
        }),
        jetton_wallet_code: await compile('JettonWallet'),
        manager_address: Address.parse("UQA9_x0LNXjwkpuEVnHkZwAonZXnxWOA8lMdu6nZ1e2e7WSJ")
    }, await compile('JettonMinter')));

    await jettonMinter.sendDeploy(provider.sender(), toNano('0.01'));
    await provider.waitForDeploy(jettonMinter.address);
}
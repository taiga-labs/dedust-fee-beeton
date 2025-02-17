import { Address, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettomMinter';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildjettonMinterContentCell } from '../helpers/metadata';

export async function run(provider: NetworkProvider) {
    const jettonMinter = provider.open(JettonMinter.createFromConfig({
        total_supply: 0n, // 0 jetton on the moment of deploying
        admin_address: provider.sender().address as Address,
        content: buildjettonMinterContentCell({
            name: "BEE TON JETTON",
            description: "BEE TON JETTON",
            symbol: "BTJ",
            decimals: "9",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/81/Bee_Collecting_Pollen_2004-08-14.jpg"
        }),
        jetton_wallet_code: await compile('JettonWallet'),
        manager_address: Address.parse("")
    }, await compile('JettonMinter')));

    await jettonMinter.sendDeploy(provider.sender(), toNano('0.02'));
    await provider.waitForDeploy(jettonMinter.address);
}
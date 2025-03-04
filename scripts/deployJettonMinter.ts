import { Address, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildjettonMinterContentCell } from '../helpers/metadata';

export async function run(provider: NetworkProvider) {
    const jettonMinter = provider.open(JettonMinter.createFromConfig({
        total_supply: 0n, // 0 jetton on the moment of deploying
        admin_address: provider.sender().address as Address,
        content: buildjettonMinterContentCell({
            name: "2 TEST HK",
            description: "State Of The Art (by Beeton) @sotatoken",
            symbol: "2 TEST HK",
            decimals: "9",
            image: "https://png.pngtree.com/thumb_back/fw800/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg"
        }),
        jetton_wallet_code: await compile('JettonWallet'),
        manager_address: Address.parse("UQBBRxdSebkJCoXaS12m7T2uksh19aX12hILRYqW_ttKOaEs")
    }, await compile('JettonMinter')));

    await jettonMinter.sendDeploy(provider.sender(), toNano('0.01'));
    await provider.waitForDeploy(jettonMinter.address);
}
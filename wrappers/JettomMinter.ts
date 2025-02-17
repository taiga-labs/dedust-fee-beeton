import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type JettonMinterConfig = {
    total_supply: bigint;
    admin_address: Address;
    content: Cell;
    jetton_wallet_code: Cell
    manager_address: Address;
};

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
    return (
        beginCell()
            .storeCoins(config.total_supply)
            .storeAddress(config.admin_address)
            .storeRef(config.content)
            .storeRef(config.jetton_wallet_code)
            .storeAddress(config.manager_address)
        .endCell()
    );
}

export class JettonMinter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonMinter(address);
    }

    static createFromConfig(config: JettonMinterConfig, code: Cell, workchain = 0) {
        const data = jettonMinterConfigToCell(config);
        const init = { code, data };
        return new JettonMinter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendMint(provider: ContractProvider, via: Sender, 
        oprions: {
            value: bigint
            queryId: bigint
            toAddress: Address
            tonAmount: bigint
            jettonAmountToMint: bigint
            fromAddress: Address
        }
    ) {
        await provider.internal(via, {
            value: oprions.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(21, 32)
                    .storeUint(oprions.queryId, 64)
                    .storeAddress(oprions.toAddress)
                    .storeCoins(oprions.tonAmount)
                    .storeRef(
                        beginCell()
                            .storeUint(0x178d4519, 32)
                            .storeUint(oprions.queryId, 64)
                            .storeCoins(oprions.jettonAmountToMint)
                            .storeAddress(oprions.fromAddress)
                            .storeUint(0, 2) // null response address
                            .storeCoins(0)   // null forward ton amount
                            .storeUint(0, 1) // null forward payload
                        .endCell()
                    )
                .endCell(),
        });
    }
}

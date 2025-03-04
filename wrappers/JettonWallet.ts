import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';



export class JettonWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonWallet(address);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendTransfer(provider: ContractProvider, via: Sender,
        opts: {
            value: bigint,
            qi: bigint,
            jettonAmount: bigint
            forwardTONAmount: bigint,
            recipientAddress: Address,
            forwardPayload: Cell,
        }
    ) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            value : opts.value + opts.forwardTONAmount,
            body: 
                beginCell()
                    .storeUint(0x0f8a7ea5, 32)
                    .storeUint(opts.qi, 64)
                    .storeCoins(opts.jettonAmount)
                    .storeAddress(opts.recipientAddress)
                    .storeAddress(via.address)
                    .storeUint(0, 1)
                    .storeCoins(opts.forwardTONAmount)
                    .storeBit(1)
                    .storeRef(opts.forwardPayload)
                .endCell()
        });
    }


}

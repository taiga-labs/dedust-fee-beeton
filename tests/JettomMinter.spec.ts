import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { JettomMinter } from '../wrappers/JettonMinter';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('JettomMinter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('JettomMinter');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let jettomMinter: SandboxContract<JettomMinter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        jettomMinter = blockchain.openContract(JettomMinter.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await jettomMinter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettomMinter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettomMinter are ready to use
    });
});

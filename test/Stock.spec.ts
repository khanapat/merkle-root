import { expect } from "chai";
import { formatEther, getAddress, parseEther } from "viem";
import { viem, deployments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

const item1 = "item1";
const item2 = "item2";

type SetStockEvent = {
    name: string;
    value: BigInt;
};

describe("Stock", function () {
    function eth(num: number): BigInt {
        return parseEther(num.toString());
    }

    async function deployContractsFixture() {
        const [owner, addr1] = await viem.getWalletClients();

        const stock = await viem.deployContract("Stock", [eth(1)], {
            confirmations: 1,
            walletClient: owner,
        });

        const publicClient = await viem.getPublicClient();

        return {
            publicClient,
            owner,
            addr1,
            stock,
        }
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { owner, stock } = await loadFixture(deployContractsFixture);

            expect(await stock.read.owner()).to.equal(getAddress(owner.account.address));
        });

        it("Should set the right limit stock", async function () {
            const { stock } = await loadFixture(deployContractsFixture);

            expect(await stock.read.limitStock()).to.equal(eth(1));
        });
    });

    describe("Main feature", function () {
        context("Set Stock", function () {
            it("Should be able to set stock", async function () {
                const { stock, publicClient } = await loadFixture(deployContractsFixture);

                const hash = await expect(stock.write.setStock([item1, eth(1)]))
                    .to.be.fulfilled;
                // console.log(hash); // 0x...
                const receipt = await publicClient.waitForTransactionReceipt({ hash });
                // console.log(receipt); // {transactionHash: "0x...", blockHash: "0x...", blockNumber: 1, ...}

                // SetStock(string name, uint256 value)
                const setStockEvents = await stock.getEvents.SetStock();
                expect(setStockEvents).to.have.lengthOf(1);
                const args = setStockEvents[0].args as SetStockEvent;
                expect(args.name).to.equal(item1);
                expect(args.value).to.equal(eth(1));
                // console.log(setStockEvents); // [{ args: { name: "item1", value: 1000000000000000000n }, ...}]

                expect(await stock.read.stocks([item1])).to.equal(eth(1));
                expect(await stock.read.stocks([item2])).to.equal(0n);
            });

            it("Should be unable to set stock because of not owner", async function () {
                const { addr1, stock } = await loadFixture(deployContractsFixture);

                const stockAsAccount1 = await viem.getContractAt("Stock", stock.address, { walletClient: addr1 });
                await expect(stockAsAccount1.write.setStock([item1, eth(1)]))
                    .to.be.rejectedWith("You aren't the owner");
            })

            it("Should be unable to set stock because of exceed limit", async function () {
                const { stock } = await loadFixture(deployContractsFixture);

                await expect(stock.write.setStock([item1, eth(2)]))
                    .to.be.rejectedWith(`ExcessLimitStock("${item1}", ${2_000_000_000_000_000_000n})`);
            });
        });
    });
});
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import { encodeAbiParameters, encodePacked, fromHex, getAddress, keccak256, parseAbiParameters, parseEther } from "viem";

type ReceiveRewardEvent = {
    account: `0x${string}`;
    amount: bigint;
}

describe("MerkleProofWithZeppelin", function () {
    let a: `0x${string}`;
    let b: `0x${string}`;
    let c: `0x${string}`;
    let d: `0x${string}`;

    let root: `0x${string}`;
    let hashes: `0x${string}`[];

    function eth(num: number): bigint {
        return parseEther(num.toString());
    }

    async function deployContractsFixture() {
        const [owner, addr1, addr2, addr3, addr4, addr5, addr6] = await viem.getWalletClients();

        a = keccak256(keccak256(encodeAbiParameters(
            parseAbiParameters("address to,uint256 amount"),
            [addr1.account.address, eth(1)],
        ))); // 0x48b89d46ac36bc91cff52fda8f367663966eeb47da22a76a3f52c1ed976504ee

        b = keccak256(keccak256(encodeAbiParameters(
            parseAbiParameters("address to,uint256 amount"),
            [addr2.account.address, eth(2)],
        )));

        c = keccak256(keccak256(encodeAbiParameters(
            parseAbiParameters("address to,uint256 amount"),
            [addr3.account.address, eth(3)],
        )));

        d = keccak256(keccak256(encodeAbiParameters(
            parseAbiParameters("address to,uint256 amount"),
            [addr4.account.address, eth(4)],
        )));
        // console.log("d4:", d4, fromHex(d4, "bigint"), fromHex(d4, "number"));

        // order hashes
        hashes = [a, b, c, d].sort((x, y) => {
            const bigintA = fromHex(x, "bigint");
            const bigintB = fromHex(y, "bigint");
            return bigintA < bigintB ? -1 : bigintA > bigintB ? 1 : 0;
        });
        // console.log(order);

        // generate merkle tree
        let offset = 0;
        let n = hashes.length;
        while (n > 0) {
            for (let i = 0; i < n - 1; i += 2) {
                hashes.push(
                    keccak256(encodeAbiParameters(
                        parseAbiParameters("bytes32 hashA,bytes32 hashB"),
                        [hashes[offset + i], hashes[offset + i + 1]],
                    ))
                );
            }
            offset += n;
            n = n / 2;
        }
        // console.log(order);

        root = hashes[hashes.length - 1];

        const merkleProofWithZeppelin = await viem.deployContract("MerkleProofWithZeppelin", [root], {
            confirmations: 1,
            walletClient: owner,
        });

        const publicClient = await viem.getPublicClient();

        return {
            publicClient,
            owner,
            addr1,
            addr2,
            addr3,
            addr4,
            addr5,
            addr6,
            merkleProofWithZeppelin,
        }
    }

    describe("Deployment", function () {
        it("Should set the right merkle root", async function () {
            const { merkleProofWithZeppelin } = await loadFixture(deployContractsFixture);

            expect(await merkleProofWithZeppelin.read.root()).to.equal(root);
        });
    });

    describe("Main feature", function () {
        context("Receive Reward", function () {
            it("Should be able to receive reward", async function () {
                const { addr1, merkleProofWithZeppelin, publicClient } = await loadFixture(deployContractsFixture);

                const merkleProofWithZeppelinAsAccount1 = await viem.getContractAt("MerkleProofWithZeppelin", merkleProofWithZeppelin.address, { walletClient: addr1 });
                const hash = await merkleProofWithZeppelinAsAccount1.write.receiveReward([
                    [hashes[0], hashes[5]],
                    eth(1),
                ]);
                // console.log(hash);

                const receiveRewardEvents = await merkleProofWithZeppelin.getEvents.ReceiveReward();
                expect(receiveRewardEvents).to.have.lengthOf(1);
                const args = receiveRewardEvents[0].args as ReceiveRewardEvent;
                expect(args.account).to.equal(getAddress(addr1.account.address));
                expect(args.amount).to.equal(eth(1));
            });

            it("Should be unable to receive reward because of invalid proof", async function () {
                const { addr2, merkleProofWithZeppelin } = await loadFixture(deployContractsFixture);

                const merkleProofWithZeppelinAsAccount2 = await viem.getContractAt("MerkleProofWithZeppelin", merkleProofWithZeppelin.address, { walletClient: addr2 });
                await expect(merkleProofWithZeppelinAsAccount2.write.receiveReward([
                    [hashes[0], hashes[5]],
                    eth(2),
                ])).to.be.rejectedWith(`InvalidProof("${getAddress(addr2.account.address)}", ${eth(2)})`);
            });
        });
    });
});
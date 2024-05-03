import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { viem } from "hardhat";
import { encodePacked, keccak256 } from "viem";

const a = keccak256(encodePacked(["string"], ["a"]));
const b = keccak256(encodePacked(["string"], ["b"]));
const c = keccak256(encodePacked(["string"], ["c"]));
const d = keccak256(encodePacked(["string"], ["d"]));
const ab = keccak256(encodePacked(["bytes32", "bytes32"], [a, b]));
const cd = keccak256(encodePacked(["bytes32", "bytes32"], [c, d]));
const abcd = keccak256(encodePacked(["bytes32", "bytes32"], [ab, cd]));

describe("MerkleProofWithExample", function () {
    async function deployContractsFixture() {
        const [owner, addr1] = await viem.getWalletClients();

        const merkleProofWithExample = await viem.deployContract("MerkleProofWithExample", [], {
            confirmations: 1,
            walletClient: owner,
        });

        // hashes = [a, b, c, d, ab, cd, abcd]
        await merkleProofWithExample.write.generateWithString([
            ["a", "b", "c", "d"],
        ]);

        const publicClient = await viem.getPublicClient();

        return {
            publicClient,
            owner,
            addr1,
            merkleProofWithExample,
        }
    }

    describe("Deployment", function () {
        it("Should set the right hashes", async function () {
            const { merkleProofWithExample } = await loadFixture(deployContractsFixture);

            expect(await merkleProofWithExample.read.hashes([0])).to.equal(a);
            expect(await merkleProofWithExample.read.hashes([1])).to.equal(b);
            expect(await merkleProofWithExample.read.hashes([2])).to.equal(c);
            expect(await merkleProofWithExample.read.hashes([3])).to.equal(d);
            expect(await merkleProofWithExample.read.hashes([4])).to.equal(ab);
            expect(await merkleProofWithExample.read.hashes([5])).to.equal(cd);
            expect(await merkleProofWithExample.read.hashes([6])).to.equal(abcd);
        });

        it("Should set the merkle root", async function () {
            const { merkleProofWithExample } = await loadFixture(deployContractsFixture);

            expect(await merkleProofWithExample.read.getRoot()).to.equal(abcd);
        });
    });

    describe("Main feature", function () {
        context("Verify", function () {
            it("Should be able to verify the proof (left side)", async function () {
                const { merkleProofWithExample } = await loadFixture(deployContractsFixture);

                const root = abcd;
                const leaf = a;
                const proof = [b, cd];
                const index = 0;

                expect(await merkleProofWithExample.read.verify([proof, root, leaf, index])).to.equal(true);
            });

            it("Should be able to verify the proof (right side)", async function () {
                const { merkleProofWithExample } = await loadFixture(deployContractsFixture);

                const root = abcd;
                const leaf = d;
                const proof = [c, ab];
                const index = 3;

                expect(await merkleProofWithExample.read.verify([proof, root, leaf, index])).to.equal(true);
            });

            it("Should be unable to verify the proof because of invalid proof", async function () {
                const { merkleProofWithExample } = await loadFixture(deployContractsFixture);

                const root = abcd;
                const leaf = a;
                const proof = [b, ab];
                const index = 0;

                expect(await merkleProofWithExample.read.verify([proof, root, leaf, index])).to.equal(false);
            });

            it("Should be unable to verify the proof because of invalid index", async function () {
                const { merkleProofWithExample } = await loadFixture(deployContractsFixture);

                const root = abcd;
                const leaf = a;
                const proof = [b, ab];
                const index = 3;

                expect(await merkleProofWithExample.read.verify([proof, root, leaf, index])).to.equal(false);
            });
        });
    });
});
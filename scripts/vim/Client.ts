import hre from "hardhat";
import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";

async function main() {
    const client = createPublicClient({
        chain: sepolia,
        transport: http(),
    })

    const blockNumber = await client.getBlockNumber();
    console.log(`Block number: ${blockNumber}`);

    const chainId = await client.getChainId();
    console.log(`Chain ID: ${chainId}`);

    const account = "0xc083EB69aa7215f4AFa7a22dcbfCC1a33999371C"
    const balance = await client.getBalance({
        address: account,
        blockTag: "latest"
    });
    console.log(`Account: ${account} Balance In Wei: ${balance} Balance In Eth: ${formatEther(balance)}`);

    const { maxFeePerGas, maxPriorityFeePerGas } = await client.estimateFeesPerGas();
    console.log(`Max Fee Per Gas: ${maxFeePerGas} Max Priority Fee Per Gas: ${maxPriorityFeePerGas}`);

    const gasPrice = await client.getGasPrice();
    console.log(`Gas Price: ${gasPrice}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
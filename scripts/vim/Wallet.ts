import { createPublicClient, createWalletClient, formatEther, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

async function main() {
    const client = createPublicClient({
        chain: sepolia,
        transport: http(),
    })

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`)
    console.log(`Public Key: ${account.publicKey}`);
    console.log(`Account: ${account.address}`);

    // nonce
    const transactionCount = await client.getTransactionCount({
        address: account.address,
        blockTag: "latest",
    });
    console.log(`Transaction Count: ${transactionCount}`);

    console.log(`ETH: ${formatEther(1_000_000_000_000_000_000n)} WEI: ${parseEther("1")}`);

    const wallet = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
    })

    // sign & verify message
    const message = "Hello World";
    const signature = await wallet.signMessage({
        message: message
    });
    console.log(`Message: ${message} Signature: ${signature}`);

    const valid = await client.verifyMessage({
        address: account.address,
        message: message,
        signature: signature,
    });
    console.log(`Valid: ${valid}`);

    // send eth
    // const hash = await wallet.sendTransaction({
    //     account,
    //     to: "0xa9B6D99bA92D7d691c6EF4f49A1DC909822Cee46",
    //     value: parseEther("0.01"),
    // });
    // console.log(`Transaction Hash: ${hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
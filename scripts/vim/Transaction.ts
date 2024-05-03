import { createPublicClient, createWalletClient, decodeFunctionData, encodeFunctionData, formatEther, formatGwei, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const stockABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_limitStock",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "ExcessLimitStock",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "setStock",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "SetStock",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "limitStock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "stocks",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function main() {
    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

    const wallet = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
    });

    const client = createPublicClient({
        chain: sepolia,
        transport: http(),
    });

    // prepare transaction
    const request = await wallet.prepareTransactionRequest({
        account,
        to: "0xa9B6D99bA92D7d691c6EF4f49A1DC909822Cee46",
        value: parseEther("0.01"),
    });
    console.log("Request:", request);

    const signature = await wallet.signTransaction(request);
    console.log(`Signature: ${signature}`);
    // const hash = await wallet.sendRawTransaction({
    //     serializedTransaction: signature,
    // });
    // console.log(`Transaction Hash: ${hash}`);

    // get transaction
    // transfer eth: 0xb6098794e36a686b4c0fe7dd36684df7065480d72d032c6005f6b8bc35816de4
    // set stock: 0x044aa41c09e27053d17ad17db8e9a6800d9a2fee30e633c54d89dab66dfd772a
    const hash = "0x044aa41c09e27053d17ad17db8e9a6800d9a2fee30e633c54d89dab66dfd772a";
    const transaction = await client.getTransaction({
        hash: hash,
    });
    console.log("Transaction:", transaction);

    // get transaction confirmation (Returns the number of blocks passed (confirmations) since the transaction was processed on a block.)
    const confirmations = await client.getTransactionConfirmations({
        hash: hash,
    });
    console.log(`Confirmations: ${confirmations}`);

    // get transaction receipt (Returns with status)
    const transactionReceipt = await client.getTransactionReceipt({
        hash: hash,
    });
    console.log("Transaction Receipt:", transactionReceipt);

    // block
    const block = await client.getBlock({
        blockNumber: transactionReceipt.blockNumber,
    });

    if (transaction) {
        const gasPrice = transaction.gasPrice as bigint;
        const baseFeePerGas = block.baseFeePerGas as bigint;
        const maxFeePerGas = transaction.maxFeePerGas as bigint;
        const maxPriorityFeePerGas = transaction.maxPriorityFeePerGas as bigint;

        console.log(`Gas Price: ${formatGwei(gasPrice)} Gwei (${formatEther(gasPrice)} ETH)`);
        console.log(`Gas Limit & Usage by Txn: ${transaction.gas} | ${transactionReceipt.gasUsed} (${((Number(transactionReceipt.gasUsed) / Number(transaction.gas)) * 100).toFixed(2)}%)`);
        console.log(`Gas Fees: Base: ${formatGwei(baseFeePerGas)} Gwei | Max: ${formatGwei(maxFeePerGas)} Gwei | Max Priority: ${formatGwei(maxPriorityFeePerGas)} Gwei`);

        const burnt = transactionReceipt.gasUsed * baseFeePerGas;
        const saving = (maxFeePerGas - gasPrice) * transactionReceipt.gasUsed;
        console.log(`Burnt & Txn Savings Fees: Burnt: ${formatEther(burnt)} ETH | Txn Savings: ${formatEther(saving)} ETH`);

        console.log(`Txn Type: ${transaction.type} | Nonce: ${transaction.nonce} | Position In Block: ${transaction.transactionIndex}`);

        // console.log(transaction.input);

        // decode function data
        const value = decodeFunctionData({
            abi: stockABI,
            data: transaction.input,
        });
        // console.log(value.functionName, value.args);
        const args = value.args as string[];
        console.log("# Name Type Data")
        stockABI.forEach((item) => {
            if (item.name === value.functionName) {
                item.inputs.forEach((input, index) => {
                    console.log(`${index} ${input.name} ${input.type} ${args[index]}`);
                });
            }
        });

        // encode function data
        // const data = encodeFunctionData({
        //     abi: stockABI,
        //     functionName: "setStock",
        //     args: ["book", 100],
        // });
        // console.log(`Data: ${ data }`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
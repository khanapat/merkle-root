import { encodeAbiParameters, encodePacked, keccak256, parseAbiParameters, parseEther } from "viem";

async function main() {
    // parse abi parameters
    const abiParameters = parseAbiParameters("address to, uint256 amount");
    console.log("ABI parameter with name:", abiParameters);

    const abiParameterss = parseAbiParameters("address,uint256");
    console.log("ABI parameter:", abiParameterss);

    // encode
    const encodedData = encodeAbiParameters(
        parseAbiParameters("string transaction"),
        ["a"],
    );
    console.log("Encoded data:", encodedData); // 0x...

    // encode + keccak256
    console.log("Encoded data + Keccak256:", keccak256(encodedData)); // 0x...

    // encode packed
    const encodedPackedData = encodePacked(
        ["string"],
        ["a"],
    );
    console.log("Encoded packed data:", encodedPackedData); // 0x...

    // encode packed + keccak256
    console.log("Encoded packed data + Keccak256:", keccak256(encodedPackedData)); // 0x...

    // test
    console.log("======= Test =======");

    const encode = encodeAbiParameters(
        parseAbiParameters("address to,uint256 amount"),
        ["0xc083EB69aa7215f4AFa7a22dcbfCC1a33999371C", 1_000n],
    );
    console.log(encode);
    console.log("encode:", keccak256(encode));

    const encodePack = encodePacked(
        ["address", "uint256"],
        ["0xc083EB69aa7215f4AFa7a22dcbfCC1a33999371C", 1_000n],
    );
    console.log(encodePack);
    console.log("encodePack:", keccak256(encodePack));

    // encoded
    const a1 = keccak256(encodeAbiParameters(
        parseAbiParameters("address to,uint256 amount"),
        ["0xc083EB69aa7215f4AFa7a22dcbfCC1a33999371C", parseEther("1")],
    ));

    console.log("a1:", a1);

    const b1 = keccak256(encodeAbiParameters(
        parseAbiParameters("address to,uint256 amount"),
        ["0xa9B6D99bA92D7d691c6EF4f49A1DC909822Cee46", parseEther("2")],
    ));

    console.log("b1:", b1);

    const ab1 = keccak256(encodeAbiParameters(
        parseAbiParameters("bytes32 hashA,bytes32 hashB"),
        [a1, b1],
    ));

    console.log("ab1:", ab1);

    const ba1 = keccak256(encodeAbiParameters(
        parseAbiParameters("bytes32 hashA,bytes32 hashB"),
        [b1, a1],
    ));

    console.log("ba1:", ba1);

    // encoded packed
    const a2 = keccak256(encodePacked(
        ["address", "uint256"],
        ["0xc083EB69aa7215f4AFa7a22dcbfCC1a33999371C", 1n],
    ));

    console.log("a2:", a2);

    const b2 = keccak256(encodePacked(
        ["address", "uint256"],
        ["0xa9B6D99bA92D7d691c6EF4f49A1DC909822Cee46", 2n],
    ));

    console.log("b2:", b2);

    const ab2 = encodePacked(
        ["bytes32", "bytes32"],
        [a2, b2],
    );
    console.log("ab2:", keccak256(ab2));

    const ba2 = encodePacked(
        ["bytes32", "bytes32"],
        [b2, a2],
    );
    console.log("ba2:", keccak256(ba2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
import { formatEther, parseEther } from "viem";
import hre from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = BigInt(currentTimestampInSeconds + 60);

  const lockedAmount = parseEther("0.0001");

  // https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-viem#send-deployment-transaction
  const lock = await hre.viem.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  console.log(
    `Lock with ${formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

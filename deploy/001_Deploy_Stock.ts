import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Address, formatEther } from "viem";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer } = await hre.getNamedAccounts();
    const { deploy, log } = hre.deployments;

    const client = await hre.viem.getPublicClient();

    log("Deploying the contracts with the account:", deployer);
    log("Account Balance: ", formatEther(await client.getBalance({ address: deployer as Address })));

    const stock = await deploy("Stock", {
        from: deployer,
        args: [
            100n,
        ],
        log: true,
    });

    log("Stock deployed to:", stock.address, "network:", hre.network.name);
    log("----------------------------------------------------");
}

// https://github.com/wighawag/hardhat-deploy?tab=readme-ov-file#deploy-scripts
export default func;
func.id = "deploy_stock";
func.tags = ["Stock"]; // 
// func.dependencies = ["Token"]; this ensure the Token script above is executed first, so `deployments.get('Token')` succeeds
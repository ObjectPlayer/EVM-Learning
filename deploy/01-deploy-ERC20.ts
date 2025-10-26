import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { isLocalNetwork } from "../network-config";
import "dotenv/config";


const deployERC20: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network, run } = hre;
    const {deploy} = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId || 1337;

    const myE20Token = await deploy("MyE20Token", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: 1,
    });

    console.log("Deployed MyE20Token at:", myE20Token.address);

    if (!isLocalNetwork(chainId) && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for blockchain indexers to catch up...");
        // Add a delay to allow the blockchain explorer to index the contract
        await new Promise(resolve => setTimeout(resolve, 60000)); // 60 seconds delay
        
        console.log("Verifying contract on Etherscan...");
        try {
          await run("verify:verify", {
            address: myE20Token.address,
            constructorArguments: [],
          });
          console.log("Contract verification successful!");
        } catch (error: any) {
          if (error.message.includes("Already Verified")) {
            console.log("Contract is already verified!");
          } else if (error.message.includes("does not have bytecode")) {
            console.log("Verification failed: Contract bytecode not found on the explorer yet.");
          } else {
            console.error("Verification failed:", error);
          }
        }
    }

    
};


export default deployERC20;
deployERC20.tags = ["ERC20"]
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";


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

};


export default deployERC20;
deployERC20.tags = ["ERC20"]
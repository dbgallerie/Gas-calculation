import { ethers, run, network } from "hardhat";
import { SupportedNetworks, getCCIPConfig } from "../../ccip.config";
import { createOrUpdateConfigFile } from "../helper";

async function deployAndVerifySender(network: SupportedNetworks) {
  const { router, linkToken } = getCCIPConfig(network);

  console.log(`Deploying Sender contract on ${network}...`);
  const Sender = await ethers.getContractFactory("Sender");
  const sender = await Sender.deploy(router, linkToken);

  await sender.waitForDeployment();
  const tx = sender.deploymentTransaction();

  if (tx) {
    console.log("Wait for 20 blocks");
    await tx.wait(20);

    const senderAddress = await sender.getAddress();
    console.log("Sender contract deployed at:", senderAddress);

    // Medir el gas utilizado por ccipReceive
    console.log("Estimating gas for ccipReceive...");
    const gasEstimate = await sender.estimateGas.ccipReceive(...params); // Reemplaza 'params' con los argumentos necesarios
    console.log("Gas estimated:", gasEstimate.toString());

    // Incrementar el gas en un 10%
    const gasLimit = Math.ceil(gasEstimate.toNumber() * 1.10);
    console.log(`Updated gasLimit: ${gasLimit}`);

    console.log(`Calling transferUsdc with gas limit of ${gasLimit}`);
    await sender.transferUsdc({
      to: senderAddress,
      amount: ethers.utils.parseUnits("1000", 18),
      gasLimit: gasLimit,
    });

    console.log(`Verifying Sender contract on ${network}...`);
    try {
      await run("verify:verify", {
        address: senderAddress,
        constructorArguments: [router, linkToken],
      });
      console.log(`Sender contract verified on ${network}!`);
    } catch (error) {
      console.error("Error verifying Sender contract:", error);
    }

    await createOrUpdateConfigFile(network, { senderAddress });
  }
}

deployAndVerifySender(network.name as SupportedNetworks).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

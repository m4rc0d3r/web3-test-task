import { configDotenv } from "dotenv";
import { getDefaultProvider, parseUnits, Wallet } from "ethers";
import { parseCliArgs } from "./cli-args.js";
import { createConfig } from "./config.js";
import { createContract } from "./contract.js";

configDotenv();
const { tokenAddress, waitForConfirmation } = createConfig(process.env);

const { privateKey, amount, publicKey } = parseCliArgs({
  privateKey: process.argv[2],
  amount: process.argv[3],
  publicKey: process.argv[4],
});

const provider = getDefaultProvider();
const wallet = new Wallet(privateKey, provider);
const contract = createContract(tokenAddress, wallet);

try {
  const value = parseUnits(amount, await contract.decimals());
  const txRes = await wallet.sendTransaction({
    to: publicKey,
    value,
  });
  console.log(`Transaction was sent with hash ${txRes.hash}.`);

  if (waitForConfirmation) {
    await txRes.wait();
    console.log(`Transaction was mined in block ${txRes.blockNumber}.`);
  }
} catch (error) {
  if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
    console.error("An error occurred while sending the transaction.");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
  } else {
    console.log(`An unexpected error occurred. ${error}`);
  }
}

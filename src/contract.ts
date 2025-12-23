import { Contract } from "ethers";
import { createEnum } from "./utils.js";

const ABI = ["function decimals() public view returns (uint8)"];

const ABI_METHOD_NAMES = createEnum(["decimals"]);

type Abi = {
  [ABI_METHOD_NAMES.decimals]: () => Promise<bigint>;
};
type CustomContract = Contract & Abi;

function withAbi(value: Contract): value is CustomContract {
  return Object.values(ABI_METHOD_NAMES).every((name) => name in value);
}

function createContract(
  target: ConstructorParameters<typeof Contract>[0],
  runner?: ConstructorParameters<typeof Contract>[2],
): CustomContract {
  const token = new Contract(target, ABI, runner);

  if (!withAbi(token)) {
    console.error(
      "An error occurred while creating the contract, resulting in missing required ABI methods.",
    );
    process.exit();
  }
  return token;
}

export { createContract };

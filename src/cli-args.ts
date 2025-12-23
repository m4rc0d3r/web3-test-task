import { isAddress, isHexString } from "ethers";
import { z } from "zod";

const PRIVATE_KEY_LENGTH = 32;
const zCLiArgs = z.object({
  privateKey: z
    .string()
    .nonempty()
    .refine((arg) => isHexString(arg, PRIVATE_KEY_LENGTH), {
      error:
        "is not a valid Ethereum private key, i.e. it is not a 32-byte hexadecimal string prefixed with 0x",
    }),
  amount: z.string().refine(
    (arg) => {
      const maybeNumber = Number(arg);

      return !isNaN(maybeNumber) && maybeNumber > 0;
    },
    {
      error: "is not a positive number",
    },
  ),
  publicKey: z.string().nonempty().refine(isAddress, {
    error:
      "is not a valid Ethereum address, i.e. it is not a 20-byte hexadecimal string prefixed with 0x",
  }),
});
type CLiArgs = z.infer<typeof zCLiArgs>;

const HUMAN_READABLE_ARGUMENT_NAMES = {
  privateKey: "private key",
  amount: "amount",
  publicKey: "public key",
} satisfies Record<keyof CLiArgs, string>;

function parseCliArgs(value: Record<string, unknown>) {
  try {
    const numberOfActualArgs = Object.entries(value).filter(
      ([, value]) => value !== undefined,
    ).length;
    const numberOfRequiredArgs = Object.keys(zCLiArgs.shape).length;
    if (numberOfActualArgs !== numberOfRequiredArgs)
      throw new Error(
        `The script requires ${numberOfRequiredArgs} arguments to work correctly (but you're only passing ${numberOfActualArgs}), so the call command should look like this: node dist/index.js ${Object.values(
          HUMAN_READABLE_ARGUMENT_NAMES,
        )
          .map((value) => `<${value}>`)
          .join(" ")}.`,
      );
    return zCLiArgs.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Some or all of the arguments are incorrect:");
      for (const [key, { errors }] of Object.entries(
        z.treeifyError(error as z.ZodError<CLiArgs>).properties ?? {},
      )) {
        console.error(
          `\t${(HUMAN_READABLE_ARGUMENT_NAMES as Record<string, string>)[key]} - ${errors.join(". ")}`,
        );
      }
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unexpected error occurred.");
    }
    process.exit();
  }
}

export { parseCliArgs };

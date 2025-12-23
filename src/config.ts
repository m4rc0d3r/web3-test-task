import { z } from "zod";

const DEFAULT_TOKEN_ADDRESS = "0x7083609fce4d1d8dc0c979aab8c869ea2c873402";

const zConfig = z
  .object({
    TOKEN_ADDRESS: z.string().nonempty().catch(DEFAULT_TOKEN_ADDRESS),
    WAIT_FOR_CONFIRMATION: z.stringbool().catch(false),
  })
  .transform(({ TOKEN_ADDRESS, WAIT_FOR_CONFIRMATION }) => ({
    tokenAddress: TOKEN_ADDRESS,
    waitForConfirmation: WAIT_FOR_CONFIRMATION,
  }));
type Config = z.infer<typeof zConfig>;

function createConfig(variables: Record<string, unknown>) {
  return zConfig.parse(variables);
}

export { createConfig, zConfig };
export type { Config };

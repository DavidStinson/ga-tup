import { z } from "zod";
const cliOptionsSchema = z.object({
    verbose: z.boolean(),
});
export { cliOptionsSchema };

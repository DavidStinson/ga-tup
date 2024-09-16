// npm
import { z } from "zod"

// types
const cliOptionsSchema = z.object({
  verbose: z.boolean(),
})

type CliOptions = z.infer<typeof cliOptionsSchema>

export { cliOptionsSchema, CliOptions }

import { z } from "zod"

const cliOptionsSchema = z.object({
  verbose: z.boolean(),
})

type CliOptions = z.infer<typeof cliOptionsSchema>

export { cliOptionsSchema, CliOptions }

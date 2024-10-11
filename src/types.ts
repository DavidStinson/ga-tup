// npm
import { z } from "zod"

// types
const updateCliOptionsSchema = z.object({
  verbose: z.boolean(),
})

const exportCliUrlArgument = z
  .string({
    required_error: "URL is required",
    invalid_type_error: "URL must be a string",
  })
  .trim()
  .toLowerCase()
  .url({ message: "You must provide a URL as an argument." })

type UpdateCliOptions = z.infer<typeof updateCliOptionsSchema>

type ExportCLIUrlArgument = z.infer<typeof exportCliUrlArgument>

export { updateCliOptionsSchema, exportCliUrlArgument }

export type { UpdateCliOptions, ExportCLIUrlArgument }

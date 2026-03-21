import type { GenerateImageToolOutput } from "@/features/chat/types/generate-image-tool.types"
import { gateway, IMAGE_MODEL } from "@/lib/ai"
import { generateImage, tool } from "ai"
import { z } from "zod"

const sizeSchema = z
  .enum(["1024x1024", "1792x1024", "1024x1792"])
  .optional()
  .describe(
    "Output dimensions. 1024x1024 square; 1792x1024 landscape; 1024x1792 portrait. Defaults to model default when omitted."
  )

export const generateImageTool = tool({
  description:
    "Generate an image from a text description. Use when the user asks to create, draw, illustrate, or visualize an image.",
  inputSchema: z.object({
    prompt: z
      .string()
      .min(1)
      .describe(
        "Detailed description of the image: subject, style, lighting, composition, and mood"
      ),
    size: sizeSchema,
  }),
  execute: async (
    { prompt, size },
    { abortSignal }
  ): Promise<GenerateImageToolOutput> => {
    const result = await generateImage({
      model: gateway.imageModel(IMAGE_MODEL),
      prompt,
      ...(size !== undefined ? { size } : {}),
      abortSignal,
    })

    const image = result.image
    return {
      url: `data:${image.mediaType};base64,${image.base64}`,
      mediaType: image.mediaType,
    }
  },
  toModelOutput: () => ({
    type: "text" as const,
    value:
      "The image was generated successfully and is already visible to the user in the chat. Reply briefly; do not attempt to reproduce or encode image data.",
  }),
})

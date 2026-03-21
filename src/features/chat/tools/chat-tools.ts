import { generateImageTool } from "@/features/chat/tools/generate-image.tool"

export const chatTools = {
  generateImage: generateImageTool,
} as const

function extractErrorMessage(data: unknown): string {
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    const o = data as Record<string, unknown>
    if (typeof o.message === "string") {
      return o.message
    }
    if (typeof o.error === "string") {
      return o.error
    }
  }
  return "Request failed"
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: unknown
  ) {
    super(extractErrorMessage(data))
    this.name = "ApiError"
  }
}

const parseResponse = async <T>(res: Response): Promise<T> => {
  if (res.status === 204 || res.status === 205) {
    return {} as T
  }

  const contentType = res.headers.get("content-type")?.toLowerCase() ?? ""
  const contentLength = res.headers.get("content-length")

  if (contentLength === "0") {
    return {} as T
  }

  if (
    contentType.includes("application/json") ||
    contentType.includes("+json")
  ) {
    try {
      return (await res.json()) as T
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  if (contentType.startsWith("text/")) {
    return (await res.text()) as T
  }

  if (
    contentType.startsWith("image/") ||
    contentType.startsWith("video/") ||
    contentType.startsWith("audio/") ||
    contentType.includes("application/pdf") ||
    contentType.includes("application/octet-stream")
  ) {
    return (await res.blob()) as T
  }

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    return (await res.formData()) as T
  }

  try {
    const text = await res.text()

    if (!text.trim()) {
      return {} as T
    }

    try {
      return JSON.parse(text) as T
    } catch {
      return text as T
    }
  } catch (error) {
    throw new Error(
      `Failed to parse response with content-type: ${contentType || "unknown"}. Error: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

function shouldSetJsonContentType(body: RequestInit["body"]): boolean {
  if (body === undefined || body === null) {
    return false
  }
  if (
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof ArrayBuffer
  ) {
    return false
  }
  if (body instanceof URLSearchParams) {
    return false
  }
  return typeof body === "object"
}

function serializeBody(body: RequestInit["body"]): BodyInit | null | undefined {
  if (body === undefined || body === null) {
    return body
  }
  if (
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer) &&
    !(body instanceof URLSearchParams)
  ) {
    return JSON.stringify(body)
  }
  return body
}

export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const method = (options.method ?? "GET").toUpperCase()
  const headers = new Headers(options.headers)
  const serializedBody = serializeBody(options.body)

  if (
    serializedBody !== undefined &&
    serializedBody !== null &&
    method !== "GET" &&
    method !== "HEAD" &&
    !headers.has("Content-Type") &&
    shouldSetJsonContentType(options.body)
  ) {
    headers.set("Content-Type", "application/json")
  }

  const res = await fetch(url, {
    ...options,
    method,
    headers,
    body: serializedBody,
  })

  if (!res.ok) {
    const errorData = await parseResponse<unknown>(res)
    throw new ApiError(res.status, errorData)
  }

  return parseResponse<T>(res)
}

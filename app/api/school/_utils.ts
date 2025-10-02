export async function parseJSON<T>(req: Request): Promise<T> {
  try {
    return await req.json()
  } catch {
    throw new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }
}

export function ok(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  })
}

export function created(data: unknown) {
  return new Response(JSON.stringify({ data }), {
    status: 201,
    headers: { "content-type": "application/json" },
  })
}

export function err(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  })
}

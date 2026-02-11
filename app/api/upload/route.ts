import { NextRequest, NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase/admin"

const BUCKET_NAME = "images"
const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_FILES = 10
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]

async function ensureBucket() {
  const supabase = getServiceSupabase()
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some((b: any) => b.name === BUCKET_NAME)
  if (!exists) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
      allowedMimeTypes: ALLOWED_TYPES,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const referer = request.headers.get("referer") || ""
    if (!referer.includes("/dashboard")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" }, { status: 400 })
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ success: false, error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 })
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ success: false, error: `File type ${file.type} not allowed. Only images are accepted.` }, { status: 400 })
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, error: `File ${file.name} exceeds maximum size of 5MB` }, { status: 400 })
      }
    }

    await ensureBucket()

    const supabase = getServiceSupabase()
    const uploadedUrls: string[] = []

    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const safeExt = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext) ? ext : "jpg"
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${safeExt}`
      const filePath = `uploads/${fileName}`

      const arrayBuffer = await file.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ success: false, error: `Failed to upload ${file.name}: ${error.message}` }, { status: 500 })
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)

      uploadedUrls.push(urlData.publicUrl)
    }

    return NextResponse.json({ success: true, urls: uploadedUrls })
  } catch (error: any) {
    console.error("Upload API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Upload failed" }, { status: 500 })
  }
}

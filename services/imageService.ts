import { getSupabase } from "@/lib/supabase"

const BUCKET = "listing-images"
const MAX_BYTES = 5 * 1024 * 1024
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }

export const MAX_IMAGES = 5

/** Uploads to Supabase Storage under <userId>/<random>.ext and returns the public URL. */
export async function uploadListingImage(file: File, userId: string): Promise<string> {
  const ext = TYPES[file.type]
  if (!ext) throw new Error(`${file.name}: only JPG, PNG or WebP images are allowed.`)
  if (file.size > MAX_BYTES) throw new Error(`${file.name}: image must be under 5 MB.`)

  const supabase = getSupabase()
  const path = `${userId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  })
  if (error) throw new Error(error.message)
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

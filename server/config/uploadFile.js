import supabase from "../config/supabase.js"

export const uploadFile = async (file, folder) => {

    if (!file) {
        throw new Error("No file uploaded")
    }

    // sanitize filename
    const cleanName = file.originalname
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");

    const fileName =
        `${folder}/${Date.now()}-${file.originalname}`

    const { error } = await supabase
        .storage
        .from("documents")
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        })

    if (error) throw error

    const { data } = supabase
        .storage
        .from("documents")
        .getPublicUrl(fileName)

    return data.publicUrl
}
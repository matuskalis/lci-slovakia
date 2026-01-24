"use server"

import { redirect } from "next/navigation"
import {
  validateObservationForm,
  uploadMultipleFiles,
  saveObservationToDatabase,
  getRedirectUrl,
} from "@/lib/upload-helpers"

export async function submitDevObservation(formData: FormData) {
  try {
    console.log("=== DEV UPLOAD START ===")

    // Validate form data
    const validation = validateObservationForm(formData)
    if (!validation.isValid) {
      console.log("Validation failed:", validation.errors)
      const errorMessage = validation.errors.join(", ")
      redirect(getRedirectUrl(false, errorMessage))
    }

    console.log("Validation passed")

    // Get files from form data
    const files = formData.getAll("files") as File[]
    const validFiles = files.filter((file) => file.size > 0)

    console.log(`Found ${validFiles.length} valid files`)

    if (validFiles.length === 0) {
      redirect(getRedirectUrl(false, "Aspoň jedna fotografia je povinná"))
    }

    // Upload files to Supabase Storage
    console.log("Starting file upload...")
    const uploadResult = await uploadMultipleFiles(validFiles, "observation-photos", "dev-user")

    if (!uploadResult.success) {
      console.log("Upload failed:", uploadResult.error)
      redirect(getRedirectUrl(false, uploadResult.error || "Chyba pri nahrávaní súborov"))
    }

    console.log("Files uploaded successfully:", uploadResult.data)

    // Save observation to database
    console.log("Saving to database...")
    const saveResult = await saveObservationToDatabase(formData, uploadResult.data, "dev-user")

    if (!saveResult.success) {
      console.log("Database save failed:", saveResult.error)
      redirect(getRedirectUrl(false, saveResult.error || "Chyba pri ukladaní pozorovania"))
    }

    console.log("=== DEV UPLOAD SUCCESS ===")
    console.log("Saved observation:", saveResult.data)

    // Success redirect
    redirect(getRedirectUrl(true))
  } catch (error) {
    console.error("Submit dev observation error:", error)
    redirect(getRedirectUrl(false, "Neočakávaná chyba pri spracovaní formulára"))
  }
}

export async function addObservation(formData: FormData) {
  return await submitDevObservation(formData)
}

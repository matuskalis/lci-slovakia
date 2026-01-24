"use server"

import { redirect } from "next/navigation"
import {
  validateObservationForm,
  uploadMultipleFiles,
  saveObservationToDatabase,
  getRedirectUrl,
} from "@/lib/upload-helpers"

export async function submitObservation(formData: FormData) {
  try {
    // Validate form data
    const validation = validateObservationForm(formData)
    if (!validation.isValid) {
      const errorMessage = validation.errors.join(", ")
      redirect(getRedirectUrl(false, errorMessage))
    }

    // Get files from form data
    const files = formData.getAll("files") as File[]
    const validFiles = files.filter((file) => file.size > 0)

    if (validFiles.length === 0) {
      redirect(getRedirectUrl(false, "Aspoň jedna fotografia je povinná"))
    }

    // Upload files to Supabase Storage
    const uploadResult = await uploadMultipleFiles(validFiles, "observation-photos")

    if (!uploadResult.success) {
      redirect(getRedirectUrl(false, uploadResult.error || "Chyba pri nahrávaní súborov"))
    }

    // Save observation to database
    const saveResult = await saveObservationToDatabase(formData, uploadResult.data)

    if (!saveResult.success) {
      redirect(getRedirectUrl(false, saveResult.error || "Chyba pri ukladaní pozorovania"))
    }

    // Success redirect
    redirect(getRedirectUrl(true))
  } catch (error) {
    console.error("Submit observation error:", error)
    redirect(getRedirectUrl(false, "Neočakávaná chyba pri spracovaní formulára"))
  }
}

export async function addObservation(formData: FormData) {
  return await submitObservation(formData)
}

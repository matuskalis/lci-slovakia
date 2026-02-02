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
    const uploadResult = await uploadMultipleFiles(validFiles, "observation-photos", "dev-user")

    if (!uploadResult.success) {
      redirect(getRedirectUrl(false, uploadResult.error || "Chyba pri nahrávaní súborov"))
    }

    // Save observation to database
    const saveResult = await saveObservationToDatabase(formData, uploadResult.data, "dev-user")

    if (!saveResult.success) {
      redirect(getRedirectUrl(false, saveResult.error || "Chyba pri ukladaní pozorovania"))
    }

    // Success redirect
    redirect(getRedirectUrl(true))
  } catch (error) {
    // Keep error logging for debugging production issues
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("Submit dev observation error:", error)
    }
    throw error
  }
}

export async function addObservation(
  _prevState: { success: boolean; message: string } | null,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    // Validate form data
    const validation = validateObservationForm(formData)
    if (!validation.isValid) {
      const errorMessage = validation.errors.join(", ")
      return { success: false, message: errorMessage }
    }

    // Get files from form data
    const files = formData.getAll("photos") as File[]
    const validFiles = files.filter((file) => file.size > 0)

    if (validFiles.length === 0) {
      return { success: false, message: "Aspoň jedna fotografia je povinná" }
    }

    // Upload files to Supabase Storage
    const uploadResult = await uploadMultipleFiles(validFiles, "observation-photos", "dev-user")

    if (!uploadResult.success) {
      return { success: false, message: uploadResult.error || "Chyba pri nahrávaní súborov" }
    }

    // Save observation to database
    const saveResult = await saveObservationToDatabase(formData, uploadResult.data, "dev-user")

    if (!saveResult.success) {
      return { success: false, message: saveResult.error || "Chyba pri ukladaní pozorovania" }
    }

    return { success: true, message: "Pozorovanie bolo úspešne uložené" }
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("Add observation error:", error)
    }
    return { success: false, message: "Neočakávaná chyba pri spracovaní formulára" }
  }
}

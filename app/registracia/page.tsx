"use client"

import { RegisterForm } from "@/components/RegisterForm"
import { motion } from "framer-motion"
import { getUserWithRole } from "@/lib/auth" // Importujeme serverovú funkciu na získanie roly
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const { user, role } = await getUserWithRole()

  // Ak používateľ nie je prihlásený alebo nie je admin, presmerujeme ho
  if (!user || role !== "admin") {
    redirect("/") // Alebo na inú stránku, napr. /pristup-zamietnuty
  }

  return (
    <div className="pt-20 min-h-screen bg-neutral flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md px-4"
      >
        <RegisterForm />
      </motion.div>
    </div>
  )
}

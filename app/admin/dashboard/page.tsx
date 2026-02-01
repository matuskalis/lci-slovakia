"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BlogManager from "./blog-manager"
import PhotoManager from "./photo-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, ImageIcon, LogOut } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/admin/verify")
        const data = await response.json()

        if (data.authorized) {
          setIsAuthenticated(true)
        } else {
          router.push("/admin/login")
        }
      } catch {
        router.push("/admin/login")
      }
    }

    verifySession()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
    } catch {
      // Continue with redirect even if logout fails
    }
    router.push("/admin/login")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Správa obsahu webu LCI</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Odhlásiť sa
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="blog" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Fotografie
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          <TabsContent value="photos">
            <PhotoManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

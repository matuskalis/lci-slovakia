"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { notFound } from "next/navigation"

interface BlogPost {
  id: string
  slug: string
  title: string
  content: string | null
  image_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getBlogPost() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", params.slug)
          .eq("published", true)
          .single()

        if (error) {
          console.error("Error fetching blog:", error)
          setPost(null)
          return
        }

        setPost(data)
      } catch (error) {
        console.error("Error fetching blog:", error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    getBlogPost()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f523b] mx-auto mb-4"></div>
          <p className="text-gray-600">Načítava sa...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-r from-[#5f523b] to-[#44623c] text-white pt-32 pb-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-6 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na blog
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-white/80">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.created_at).toLocaleDateString("sk-SK", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">{post.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#5f523b] prose-links:text-[#5f523b] prose-strong:text-[#5f523b]"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <div className="text-sm text-gray-500">
            Naposledy aktualizované: {new Date(post.updated_at).toLocaleDateString("sk-SK")}
          </div>
        </div>
      </div>
    </div>
  )
}

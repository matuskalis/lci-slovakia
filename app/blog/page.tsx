"use client"

import DOMPurify from "dompurify"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState } from "react"

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

function BlogPostCard({ post }: { post: BlogPost }) {
  const { t } = useLanguage()

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(post.created_at).toLocaleDateString("sk-SK")}
          </div>
        </div>
        <CardTitle className="line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-[#5f523b] transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {post.content && (
          <div
            className="text-gray-600 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content.substring(0, 150) + "...") }}
          />
        )}
        <Link href={`/blog/${post.slug}`}>
          <Button variant="outline" className="w-full group bg-transparent">
            Čítať viac
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function BlogFilters({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Hľadať v blogoch..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setSearchTerm("")}>
          Vymazať filter
        </Button>
      </div>
    </div>
  )
}

export default function BlogPage() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function getBlogPosts(): Promise<BlogPost[]> {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching blogs:", error)
          return []
        }

        return data || []
      } catch (error) {
        console.error("Error fetching blogs:", error)
        return []
      }
    }

    getBlogPosts().then((blogPosts) => {
      setPosts(blogPosts)
      setFilteredPosts(blogPosts)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) || (post.content && post.content.toLowerCase().includes(term)),
      )
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-r from-[#5f523b] to-[#44623c] text-white pt-32 pb-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">Články o ochrane veľkých šeliem</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {searchTerm ? "Žiadne výsledky" : "Žiadne príspevky"}
            </h2>
            <p className="text-gray-600">
              {searchTerm ? "Skúste zmeniť vyhľadávacie kritériá" : "Zatiaľ neboli pridané žiadne články"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

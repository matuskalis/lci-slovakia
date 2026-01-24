"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, toggleBlogPublished } from "./actions"

interface BlogPost {
  id: string
  slug: string
  title: string
  content: string | null
  image_url: string | null
  published: boolean
  category: string | null
  author: string | null
  excerpt: string | null
  created_at: string
  updated_at: string
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const data = await getBlogPosts()
      setPosts(data)
    } catch (error) {
      showMessage("Chyba pri načítavaní príspevkov", "error")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 5000)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    if (editingPost) {
      formData.append("id", editingPost.id)
    }

    try {
      const result = editingPost ? await updateBlogPost(formData) : await createBlogPost(formData)

      if (result.success) {
        showMessage(result.success, "success")
        setEditingPost(null)
        form.reset()
        await loadPosts()
      } else if (result.error) {
        showMessage(result.error, "error")
      }
    } catch (error) {
      showMessage("Nastala chyba pri odosielaní", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    document.getElementById("blog-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const togglePublish = async (post: BlogPost) => {
    setSubmitting(true)
    try {
      const result = await toggleBlogPublished(post.id, !post.published)
      if (result.success) {
        showMessage(result.success, "success")
        await loadPosts()
      } else if (result.error) {
        showMessage(result.error, "error")
      }
    } catch (error) {
      showMessage("Chyba pri zmene stavu", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm("Ste si istý, že chcete vymazať tento príspevok?")) return

    setSubmitting(true)
    const formData = new FormData()
    formData.append("id", postId)

    try {
      const result = await deleteBlogPost(formData)
      if (result.success) {
        showMessage(result.success, "success")
        await loadPosts()
      } else if (result.error) {
        showMessage(result.error, "error")
      }
    } catch (error) {
      showMessage("Chyba pri mazaní príspevku", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const cancelEdit = () => {
    setEditingPost(null)
    const form = document.getElementById("blog-form") as HTMLFormElement
    if (form) form.reset()
  }

  if (loading) {
    return <div className="text-center py-8">Načítava sa...</div>
  }

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-md ${
            messageType === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{editingPost ? "Upraviť príspevok" : "Nový príspevok"}</h2>

        <form id="blog-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Názov *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              key={`title-${editingPost?.id || "new"}`}
              defaultValue={editingPost?.title || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Obsah (voliteľné, môžete použiť HTML)
            </label>
            <textarea
              id="content"
              name="content"
              rows={12}
              key={`content-${editingPost?.id || "new"}`}
              defaultValue={editingPost?.content || ""}
              placeholder="<h2>Nadpis</h2><p>Text...</p>"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2 font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Autor
              </label>
              <input
                type="text"
                id="author"
                name="author"
                key={`author-${editingPost?.id || "new"}`}
                defaultValue={editingPost?.author || "Admin"}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategória
              </label>
              <select
                id="category"
                name="category"
                key={`category-${editingPost?.id || "new"}`}
                defaultValue={editingPost?.category || "Ochrana"}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
              >
                <option value="Ochrana">Ochrana</option>
                <option value="Výskum">Výskum</option>
                <option value="Vzdelávanie">Vzdelávanie</option>
                <option value="Správy">Správy</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
              URL obrázka (voliteľné)
            </label>
            <input
              type="text"
              id="image_url"
              name="image_url"
              key={`image-${editingPost?.id || "new"}`}
              defaultValue={editingPost?.image_url || ""}
              placeholder="/placeholder.svg?height=600&width=1200"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              name="published"
              key={`published-${editingPost?.id || "new"}`}
              defaultChecked={editingPost?.published || false}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
              Publikovať na web
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Ukladá sa..." : editingPost ? "Aktualizovať" : "Vytvoriť"}
            </button>

            {editingPost && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Zrušiť
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Všetky príspevky ({posts.length})</h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">Žiadne príspevky. Vytvorte prvý príspevok vyššie.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          post.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.published ? "Publikované" : "Koncept"}
                      </span>
                      {post.category && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{post.category}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Autor: {post.author || "Admin"} | {new Date(post.created_at).toLocaleDateString("sk-SK")}
                    </p>
                    {post.content && (
                      <p className="text-sm mt-2 text-gray-700 line-clamp-2">
                        {post.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => togglePublish(post)}
                      disabled={submitting}
                      className={`${
                        post.published ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                      } text-white px-3 py-1 rounded text-sm disabled:opacity-50`}
                    >
                      {post.published ? "Skryť" : "Publikovať"}
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      disabled={submitting}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                    >
                      Upraviť
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={submitting}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                    >
                      Vymazať
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

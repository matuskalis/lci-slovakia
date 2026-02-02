"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Eye, BarChart3, Award, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  category: string
  published: boolean
  created_at: string
}

interface BlogPostUpdated {
  id: string
  slug: string
  title_sk: string
  title_en: string
  excerpt_sk: string
  excerpt_en: string
  category: string
  published_date: string
}

export default function HomePage() {
  const { t, language } = useLanguage()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [blogLoading, setBlogLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector("#mission-section")
      if (!section) return

      const rect = section.getBoundingClientRect()
      const scrolled = Math.max(0, -rect.top)
      const rate = scrolled * -0.2
      const parallaxElement = document.getElementById("parallax-bg")
      if (parallaxElement) {
        parallaxElement.style.transform = `translateY(${rate}px) scale(1.2)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    async function getLatestBlogPosts() {
      try {
        const supabase = createClient()
        if (!supabase) {
          setBlogPosts([])
          setBlogLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("blogs")
          .select("id, slug, title, content, category, created_at, published")
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(3)

        if (error) {
          console.error("Error fetching blog posts:", error)
          setBlogPosts([])
          setBlogLoading(false)
          return
        }

        setBlogPosts(data || [])
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        setBlogPosts([])
      } finally {
        setBlogLoading(false)
      }
    }

    getLatestBlogPosts()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/5md.jpeg"
            alt="Brown bear in Slovak mountains"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
        </motion.div>

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 text-balance leading-tight"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href="/selmy"
              className="bg-white text-forest px-8 py-4 rounded-xl font-medium hover:bg-white/90 transition-colors duration-300 inline-flex items-center text-lg"
              onClick={scrollToTop}
            >
              {t("hero.cta1")}
              <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
            <Link
              href="/o-nas"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-medium hover:bg-white hover:text-forest transition-colors duration-300 text-lg"
              onClick={scrollToTop}
            >
              {t("hero.cta2")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "3", label: t("stats.species"), icon: BarChart3 },
              { number: "5+", label: t("stats.research"), icon: Award },
              { number: "1000+", label: t("stats.observations"), icon: Eye },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center h-full flex flex-col items-center justify-center p-8"
              >
                <div className="w-16 h-16 bg-forest/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-forest" />
                </div>
                <div className="text-4xl font-bold text-forest mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction Section with Parallax */}
      <section
        id="mission-section"
        className="relative min-h-screen md:h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            id="parallax-bg"
            src="/images/bear-cub-hero.jpg"
            alt="Brown bear cub in Slovak wilderness"
            fill
            className="object-cover object-center"
            priority
            style={{
              willChange: "transform",
              transformOrigin: "center center",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 py-8 md:py-0"
        >
          <h2 className="text-3xl md:text-6xl font-serif font-bold mb-8 md:mb-12 text-shadow">{t("mission.title")}</h2>
          <p className="text-lg md:text-xl leading-relaxed mb-12 md:mb-16 max-w-4xl mx-auto text-shadow">
            {t("mission.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center h-full flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 border border-white/30">
                <Eye className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 text-shadow">
                {t("mission.research")}
              </h3>
              <p className="text-white/90 leading-relaxed flex-grow text-shadow text-sm md:text-base">
                {t("mission.research.desc")}
              </p>
            </div>
            <div className="text-center h-full flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 border border-white/30">
                <Award className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 text-shadow">
                {t("mission.protection")}
              </h3>
              <p className="text-white/90 leading-relaxed flex-grow text-shadow text-sm md:text-base">
                {t("mission.protection.desc")}
              </p>
            </div>
            <div className="text-center h-full flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 border border-white/30">
                <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 text-shadow">
                {t("mission.education")}
              </h3>
              <p className="text-white/90 leading-relaxed flex-grow text-shadow text-sm md:text-base">
                {t("mission.education.desc")}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Species Teaser Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-forest mb-6">{t("species.title")}</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">{t("species.subtitle")}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                name: t("species.bear"),
                description: t("species.bear.description"),
                slug: "medved",
                population: t("species.bear.population"),
                status: t("species.bear.status"),
                image: "/images/4md.jpeg",
              },
              {
                name: t("species.wolf"),
                description: t("species.wolf.description"),
                slug: "vlk",
                population: t("species.wolf.population"),
                status: t("species.wolf.status"),
                image: "/images/vlk-dravy.jpeg",
              },
              {
                name: t("species.lynx"),
                description: t("species.lynx.description"),
                slug: "rys",
                population: t("species.lynx.population"),
                status: t("species.lynx.status"),
                image: "/images/rys-ostrovid-main.jpg",
              },
            ].map((species, index) => (
              <motion.div
                key={species.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Link href={`/selmy/${species.slug}`} className="block group h-full" onClick={scrollToTop}>
                  <div className="bg-white rounded-2xl p-6 shadow-md h-full overflow-hidden flex flex-col transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-64 mb-6 overflow-hidden rounded-xl flex-shrink-0">
                      <Image
                        src={species.image || "/placeholder.svg"}
                        alt={species.name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-sm font-medium">{species.population}</div>
                      </div>
                    </div>
                    <div className="flex-grow flex flex-col">
                      <h3 className="text-2xl font-serif font-bold text-forest mb-3 group-hover:text-forest-light transition-colors duration-300">
                        {species.name}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed flex-grow">{species.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                            species.status.includes("Kriticky") || species.status.includes("Critically")
                              ? "bg-red-100 text-red-700"
                              : species.status.includes("Chránený") || species.status.includes("Protected")
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {species.status}
                        </span>
                        <span className="inline-flex items-center text-forest font-medium group-hover:text-forest-light transition-colors duration-300">
                          {t("species.learn-more")}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="section-padding bg-gradient-to-br from-brown-50 to-brown-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-forest mb-6">{t("gallery.title")}</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">{t("gallery.subtitle")}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image: "/images/medved1.jpeg",
                title: t("gallery.bear.standing"),
                description: t("gallery.bear.standing.desc"),
              },
              {
                image: "/images/1md.jpeg",
                title: t("gallery.bear.forest"),
                description: t("gallery.bear.forest.desc"),
              },
              {
                image: "/images/2md.jpeg",
                title: t("gallery.bear.resting"),
                description: t("gallery.bear.resting.desc"),
              },
              {
                image: "/images/2.jpeg",
                title: t("gallery.bear.alert"),
                description: t("gallery.bear.alert.desc"),
              },
              {
                image: "/images/vlk-dravy1.jpeg",
                title: t("gallery.wolf.winter"),
                description: t("gallery.wolf.winter.desc"),
              },
              {
                image: "/images/rys-ostrivid2.jpeg",
                title: t("gallery.lynx.forest"),
                description: t("gallery.lynx.forest.desc"),
              },
            ].map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group cursor-pointer overflow-hidden h-full flex flex-col"
              >
                <div className="relative h-64 mb-6 overflow-hidden rounded-xl flex-shrink-0">
                  <Image
                    src={photo.image || "/placeholder.svg"}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                </div>
                <div className="flex-grow flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-forest mb-3 group-hover:text-forest-light transition-colors duration-300 leading-tight">
                    {photo.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">{photo.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/galeria" className="btn-primary text-lg px-8 py-4" onClick={scrollToTop}>
              {t("gallery.title")}
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Teaser Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-forest mb-6">{t("blog.title")}</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-16 max-w-4xl mx-auto">{t("blog.subtitle")}</p>
          </motion.div>

          {blogLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{t("blog.no.posts")}</h3>
              <p className="text-gray-600">{t("blog.no.posts.desc")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => {
                const title = post.title

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{post.category}</Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(post.created_at).toLocaleDateString(language === "sk" ? "sk-SK" : "en-US")}
                          </div>
                        </div>
                        <CardTitle className="line-clamp-2">
                          <Link href={`/blog/${post.slug}`} className="hover:text-[#5f523b] transition-colors">
                            {title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" className="w-full group bg-transparent">
                            {t("blog.read.more")}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/blog" onClick={scrollToTop}>
              <Button size="lg" className="bg-forest hover:bg-forest-dark text-white">
                {t("blog.view.all")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

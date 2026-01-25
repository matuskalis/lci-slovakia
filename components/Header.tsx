"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Globe, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/LanguageContext"
import { usePathname } from "next/navigation"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false)
  const [isMobileSpeciesOpen, setIsMobileSpeciesOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()

  // Home, about us, and species pages should have transparent header at top
  const transparentPages = ["/", "/o-nas", "/selmy"]
  const shouldBeTransparent = transparentPages.includes(pathname)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoadingAuth(true)
      const supabase = createClient()
      if (!supabase) {
        setIsAdmin(false)
        setLoadingAuth(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile for header:", error)
        }
        setIsAdmin(profile?.role === "admin")
      } else {
        setIsAdmin(false)
      }
      setLoadingAuth(false)
    }

    checkAdminStatus()

    const supabaseAuthListener = createClient()
    if (!supabaseAuthListener) {
      return
    }

    const { data: authListener } = supabaseAuthListener.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAdminStatus()
      } else {
        setIsAdmin(false)
        setLoadingAuth(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === "sk" ? "en" : "sk")
  }

  const getHeaderStyle = () => {
    if (shouldBeTransparent) {
      // Home, about us, and species pages - transparent at top, brown background when scrolled
      return isScrolled ? { backgroundColor: "rgba(95, 82, 59, 0.95)" } : { backgroundColor: "transparent" }
    } else {
      // All other pages - always brown background
      return { backgroundColor: "rgba(95, 82, 59, 0.95)" }
    }
  }

  const getMobileMenuStyle = () => {
    if (shouldBeTransparent) {
      return { backgroundColor: "rgba(95, 82, 59, 0.85)" }
    } else {
      return { backgroundColor: "rgba(95, 82, 59, 0.95)" }
    }
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !shouldBeTransparent ? "backdrop-blur-md shadow-lg" : ""
      }`}
      style={getHeaderStyle()}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Centered */}
          <Link href="/" className="flex items-center space-x-3 group mx-auto lg:mx-0" onClick={scrollToTop}>
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/images/lci-logo.jpg"
                alt="LCI-SK Logo"
                width={56}
                height={56}
                className="object-cover rounded-full"
              />
            </div>
            <span className="font-serif text-2xl font-bold text-white">LCI-SK.eu</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="nav-link text-white hover:text-white/80" onClick={scrollToTop}>
              {t("nav.home")}
            </Link>
            <Link href="/o-nas" className="nav-link text-white hover:text-white/80" onClick={scrollToTop}>
              {t("nav.about")}
            </Link>

            {/* Species Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsSpeciesOpen(true)}
                onMouseLeave={() => setIsSpeciesOpen(false)}
                className="nav-link flex items-center text-white hover:text-white/80"
              >
                {t("nav.species")}
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>

              <AnimatePresence>
                {isSpeciesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setIsSpeciesOpen(true)}
                    onMouseLeave={() => setIsSpeciesOpen(false)}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                  >
                    <Link
                      href="/selmy"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      style={{ color: "#5f523b" }}
                      onClick={scrollToTop}
                    >
                      {t("nav.all-species")}
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      href="/selmy/medved"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      style={{ color: "#5f523b" }}
                      onClick={scrollToTop}
                    >
                      {t("species.bear")}
                    </Link>
                    <Link
                      href="/selmy/vlk"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      style={{ color: "#5f523b" }}
                      onClick={scrollToTop}
                    >
                      {t("species.wolf")}
                    </Link>
                    <Link
                      href="/selmy/rys"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      style={{ color: "#5f523b" }}
                      onClick={scrollToTop}
                    >
                      {t("species.lynx")}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/mapa" className="nav-link text-white hover:text-white/80" onClick={scrollToTop}>
              {t("nav.map")}
            </Link>
            <Link href="/blog" className="nav-link text-white hover:text-white/80" onClick={scrollToTop}>
              {t("nav.blog")}
            </Link>
            <Link href="/galeria" className="nav-link text-white hover:text-white/80" onClick={scrollToTop}>
              {t("nav.gallery")}
            </Link>
            <Link href="/spoluprace" className="nav-link text-white hover:text-white/80" onClick={scrollToTop}>
              {t("nav.cooperation")}
            </Link>
            {!loadingAuth && isAdmin && (
              <>
                <Link
                  href="/prihlasenie"
                  className="px-4 py-2 rounded-xl font-medium transition-colors duration-300 border border-white text-white hover:bg-white hover:text-[#5f523b]"
                  onClick={scrollToTop}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/registracia"
                  className="px-4 py-2 rounded-xl font-medium transition-colors duration-300 bg-white text-[#5f523b] hover:bg-white/90"
                  onClick={scrollToTop}
                >
                  {t("nav.register")}
                </Link>
              </>
            )}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-300 bg-white/10 hover:bg-white/20 text-white"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors duration-300 hover:bg-white/10 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden backdrop-blur-md border-t border-white/20"
            style={getMobileMenuStyle()}
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/"
                className="block text-white hover:text-white/80 transition-colors duration-300 py-2"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  scrollToTop()
                }}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/o-nas"
                className="block text-white hover:text-white/80 transition-colors duration-300 py-2"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  scrollToTop()
                }}
              >
                {t("nav.about")}
              </Link>

              {/* Mobile Species Dropdown */}
              <div>
                <button
                  onClick={() => setIsMobileSpeciesOpen(!isMobileSpeciesOpen)}
                  className="flex items-center justify-between w-full text-white hover:text-white/80 transition-colors duration-300 py-2"
                >
                  {t("nav.species")}
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                      isMobileSpeciesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isMobileSpeciesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 space-y-2 overflow-hidden"
                    >
                      <Link
                        href="/selmy"
                        className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          scrollToTop()
                        }}
                      >
                        {t("nav.all-species")}
                      </Link>
                      <Link
                        href="/selmy/medved"
                        className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          scrollToTop()
                        }}
                      >
                        {t("species.bear")}
                      </Link>
                      <Link
                        href="/selmy/vlk"
                        className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          scrollToTop()
                        }}
                      >
                        {t("species.wolf")}
                      </Link>
                      <Link
                        href="/selmy/rys"
                        className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          scrollToTop()
                        }}
                      >
                        {t("species.lynx")}
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/mapa"
                className="block text-white hover:text-white/80 transition-colors duration-300 py-2"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  scrollToTop()
                }}
              >
                {t("nav.map")}
              </Link>
              <Link
                href="/blog"
                className="block text-white hover:text-white/80 transition-colors duration-300 py-2"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  scrollToTop()
                }}
              >
                {t("nav.blog")}
              </Link>
              <Link
                href="/galeria"
                className="block text-white hover:text-white/80 transition-colors duration-300 py-2"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  scrollToTop()
                }}
              >
                {t("nav.gallery")}
              </Link>
              <Link
                href="/spoluprace"
                className="block text-white hover:text-white/80 transition-colors duration-300 py-2"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  scrollToTop()
                }}
              >
                {t("nav.cooperation")}
              </Link>
              {!loadingAuth && isAdmin && (
                <>
                  <Link
                    href="/prihlasenie"
                    className="block text-white hover:text-white/80 transition-colors duration-300 py-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      scrollToTop()
                    }}
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/registracia"
                    className="block text-white hover:text-white/80 transition-colors duration-300 py-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      scrollToTop()
                    }}
                  >
                    {t("nav.register")}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

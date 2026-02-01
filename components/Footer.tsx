"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="text-white" style={{ backgroundColor: "#5f523b" }}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/lci-logo.jpg"
                  alt="LCI-SK Logo"
                  width={32}
                  height={32}
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-lg font-serif font-bold">LCI-SK.eu</h3>
            </div>
            <p className="text-white/80 mb-4 leading-relaxed text-sm">
              {language === "sk"
                ? "Združenie pre ochranu a výskum veľkých šeliem na Slovensku."
                : "Association for protection and research of large carnivores in Slovakia."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">{t("footer.quick-links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/o-nas" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/selmy" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
                  {t("nav.species")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
                  {t("nav.blog")}
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
                  {t("nav.gallery")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Species */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">{t("nav.species")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/selmy/medved"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
                >
                  {t("species.bear")}
                </Link>
              </li>
              <li>
                <Link
                  href="/selmy/vlk"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
                >
                  {t("species.wolf")}
                </Link>
              </li>
              <li>
                <Link
                  href="/selmy/rys"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
                >
                  {t("species.lynx")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">{t("footer.contact")}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-white/60" />
                <span className="text-white/80 text-sm">info@lci-sk.org</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-white/60 text-xs">© {new Date().getFullYear()} LCI-SK.eu. {t("footer.rights")}</p>
          <p className="text-white/60 text-xs mt-1 sm:mt-0">
            Made by{" "}
            <a href="https://nimvya.com" className="text-white hover:underline">
              Nimvya
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/design-mode/4MD.jpg.jpeg"
            alt="Brown bear in natural habitat"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white pt-20"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">{t("about.title")}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto px-4">{t("about.subtitle")}</p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold text-forest mb-8">{t("about.mission.title")}</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-12">{t("about.mission.description")}</p>
          </motion.div>
        </div>
      </section>

      {/* Goals Section - Using Secondary Color */}
      <section className="section-padding text-white" style={{ backgroundColor: "#44623c" }}>
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold mb-8">{t("about.goals")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold mb-4">{t("mission.research")}</h3>
                <p className="text-white/90">{t("mission.research.desc")}</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold mb-4">{t("mission.protection")}</h3>
                <p className="text-white/90">{t("mission.protection.desc")}</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold mb-4">{t("mission.education")}</h3>
                <p className="text-white/90">{t("mission.education.desc")}</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold mb-4">{t("mission.prevention")}</h3>
                <p className="text-white/90">{t("mission.prevention.desc")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

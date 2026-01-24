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

      {/* Team Section - Simplified */}
      <section className="section-padding bg-beige">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-serif font-bold text-forest mb-4">{t("about.team")}</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">{t("about.team.description")}</p>
          </motion.div>
        </div>
      </section>

      {/* History Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold text-forest mb-8 text-center">{t("about.history")}</h2>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-forest text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                  2020
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-forest mb-2">{t("about.history.2020.title")}</h3>
                  <p className="text-gray-700">{t("about.history.2020.desc")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-forest text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                  2021
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-forest mb-2">{t("about.history.2021.title")}</h3>
                  <p className="text-gray-700">{t("about.history.2021.desc")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-forest text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                  2023
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-forest mb-2">{t("about.history.2023.title")}</h3>
                  <p className="text-gray-700">{t("about.history.2023.desc")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-forest text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                  2025
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-forest mb-2">{t("about.history.2025.title")}</h3>
                  <p className="text-gray-700">{t("about.history.2025.desc")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Goals Section - Using Secondary Color */}
      <section className="section-padding text-white" style={{ backgroundColor: "#44623c" }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold mb-8">{t("about.goals")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold mb-4">{t("mission.research")}</h3>
                <p className="text-white/90">{t("about.goals.research.desc")}</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold mb-4">{t("mission.protection")}</h3>
                <p className="text-white/90">{t("about.goals.protection.desc")}</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold mb-4">{t("mission.education")}</h3>
                <p className="text-white/90">{t("about.goals.education.desc")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

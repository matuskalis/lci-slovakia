"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Award, Heart, Users, Globe, Mail } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function CooperationPage() {
  const { language, t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-[#5f523b] to-[#44623c] flex items-center justify-center">
        <div className="text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            {t("cooperation.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl leading-relaxed"
          >
            {t("cooperation.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Types of Cooperation Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6" style={{ color: "#5f523b" }}>
              {t("cooperation.types.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("cooperation.types.subtitle")}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Scientific Cooperation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gray-100">
                <Award className="w-8 h-8" style={{ color: "#5f523b" }} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#5f523b" }}>
                {t("cooperation.types.scientific")}
              </h3>
              <p className="text-gray-600 mb-6">{t("cooperation.types.scientific.desc")}</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {t("cooperation.benefits.knowledge")}</li>
                <li>• {t("cooperation.benefits.publications")}</li>
                <li>• {t("cooperation.benefits.experience")}</li>
              </ul>
            </motion.div>

            {/* Conservation Organizations */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gray-100">
                <Heart className="w-8 h-8" style={{ color: "#5f523b" }} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#5f523b" }}>
                {t("cooperation.types.conservation")}
              </h3>
              <p className="text-gray-600 mb-6">{t("cooperation.types.conservation.desc")}</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {t("cooperation.benefits.projects")}</li>
                <li>• {t("cooperation.benefits.resources")}</li>
                <li>• {t("cooperation.benefits.activities")}</li>
              </ul>
            </motion.div>

            {/* State Institutions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gray-100">
                <Users className="w-8 h-8" style={{ color: "#5f523b" }} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#5f523b" }}>
                {t("cooperation.types.institutions")}
              </h3>
              <p className="text-gray-600 mb-6">{t("cooperation.types.institutions.desc")}</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {t("cooperation.benefits.legislation")}</li>
                <li>• {t("cooperation.benefits.support")}</li>
                <li>• {t("cooperation.benefits.implementation")}</li>
              </ul>
            </motion.div>

            {/* International Projects */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gray-100">
                <Globe className="w-8 h-8" style={{ color: "#5f523b" }} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#5f523b" }}>
                {t("cooperation.types.international")}
              </h3>
              <p className="text-gray-600 mb-6">{t("cooperation.types.international.desc")}</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {t("cooperation.benefits.funding")}</li>
                <li>• {t("cooperation.benefits.networks")}</li>
                <li>• {t("cooperation.benefits.practices")}</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6" style={{ color: "#5f523b" }}>
              {t("cooperation.partners.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("cooperation.partners.subtitle")}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <Image
                    src="/images/logo-lesy-sr.jpg"
                    alt="Lesy SR Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: "#5f523b" }}>
                    {language === "sk" ? "Lesy Slovenskej republiky" : "Forests of the Slovak Republic"}
                  </h3>
                  <p className="text-gray-500 text-sm">{language === "sk" ? "Štátny podnik" : "State Enterprise"}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                {language === "sk"
                  ? "Spolupracujeme s Lesmi SR na ochrane lesných ekosystémov a monitoringu veľkých šeliem v ich prirodzenom prostredí."
                  : "We collaborate with Forests SR on protecting forest ecosystems and monitoring large carnivores in their natural environment."}
              </p>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: "#5f523b" }}>
                  {t("cooperation.projects.title")}
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {language === "sk" ? "Ochrana karpatských lesov" : "Carpathian forest protection"}</li>
                  <li>• {language === "sk" ? "Monitoring veľkých šeliem" : "Large carnivore monitoring"}</li>
                  <li>• {language === "sk" ? "Vzdelávacie programy" : "Educational programs"}</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <Image
                    src="/images/logo-vcelari.jpg"
                    alt="Slovenský zväz včelárov Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: "#5f523b" }}>
                    {language === "sk" ? "Slovenský zväz včelárov" : "Slovak Beekeepers Association"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {language === "sk" ? "Občianska organizácia" : "Civil Organization"}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                {language === "sk"
                  ? "Spolupráca pri ochrane opeľovačov a ich prostredia, ktoré sú kľúčové pre biodiverzitu našich ekosystémov."
                  : "Cooperation in protecting pollinators and their environment, which are crucial for the biodiversity of our ecosystems."}
              </p>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: "#5f523b" }}>
                  {t("cooperation.projects.title")}
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {language === "sk" ? "Ochrana opeľovačov" : "Pollinator protection"}</li>
                  <li>• {language === "sk" ? "Environmentálna výchova" : "Environmental education"}</li>
                  <li>• {language === "sk" ? "Ochrana biotopov" : "Habitat protection"}</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Cooperate Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6" style={{ color: "#5f523b" }}>
              {t("cooperation.how.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("cooperation.how.subtitle")}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold"
                style={{ backgroundColor: "#5f523b" }}
              >
                1
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#5f523b" }}>
                {t("cooperation.steps.contact")}
              </h3>
              <p className="text-gray-600">{t("cooperation.steps.contact.desc")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold"
                style={{ backgroundColor: "#5f523b" }}
              >
                2
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#5f523b" }}>
                {t("cooperation.steps.meeting")}
              </h3>
              <p className="text-gray-600">{t("cooperation.steps.meeting.desc")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold"
                style={{ backgroundColor: "#5f523b" }}
              >
                3
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#5f523b" }}>
                {t("cooperation.steps.partnership")}
              </h3>
              <p className="text-gray-600">{t("cooperation.steps.partnership.desc")}</p>
            </motion.div>
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto text-center"
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: "#5f523b" }}>
              {t("cooperation.contact.title")}
            </h3>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Mail className="w-6 h-6" style={{ color: "#5f523b" }} />
              </div>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "#5f523b" }}>
                  Email
                </p>
                <p className="text-gray-600">info@lci-sk.org</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

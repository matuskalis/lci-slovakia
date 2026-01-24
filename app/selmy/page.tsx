"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin, Users, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function SpeciesPage() {
  const { t } = useLanguage()

  const species = [
    {
      name: t("species.bear"),
      latin: t("bear.latin"),
      slug: "medved",
      description: t("bear.description"),
      population: t("species.bear.population"),
      prostredie: t("bear.environment"),
      status: t("species.bear.status"),
      image: "/images/medved-hnedy-main.jpg",
      facts: [t("bear.facts.1"), t("bear.facts.2"), t("bear.facts.3")],
    },
    {
      name: t("species.wolf"),
      latin: t("wolf.latin"),
      slug: "vlk",
      description: t("wolf.description"),
      population: t("species.wolf.population"),
      prostredie: t("wolf.environment"),
      status: t("species.wolf.status"),
      image: "/images/vlk-dravy-main.jpg",
      facts: [t("wolf.facts.1"), t("wolf.facts.2"), t("wolf.facts.3")],
    },
    {
      name: t("species.lynx"),
      latin: t("lynx.latin"),
      slug: "rys",
      description: t("lynx.description"),
      population: t("species.lynx.population"),
      prostredie: t("lynx.environment"),
      status: t("species.lynx.status"),
      image: "/images/rys-ostrovid-main.jpg",
      facts: [t("lynx.facts.1"), t("lynx.facts.2"), t("lynx.facts.3")],
    },
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section - Full Height */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/bear-cub-hero.jpg" alt={t("species.page.title")} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4 pt-20"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">{t("species.page.title")}</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t("species.page.subtitle")}
          </p>
        </motion.div>
      </section>

      {/* Species Grid */}
      <section className="section-padding bg-beige">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
            {species.map((animal, index) => (
              <motion.div
                key={animal.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Link href={`/selmy/${animal.slug}`} className="block group">
                  <div className="card h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-64 mb-6 overflow-hidden rounded-lg">
                      <Image
                        src={animal.image || "/placeholder.svg"}
                        alt={animal.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h2 className="text-2xl font-serif font-bold text-forest mb-2 group-hover:text-forest-light transition-colors duration-300">
                        {animal.name}
                      </h2>
                      <p className="text-sm text-gray-500 italic mb-4">{animal.latin}</p>
                      <p className="text-gray-700 mb-6">{animal.description}</p>

                      {/* Stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 text-forest mr-2" />
                          <span className="text-gray-600">{t("species.population")}: </span>
                          <span className="font-medium ml-1">{animal.population}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 text-forest mr-2" />
                          <span className="text-gray-600">{t("species.environment")}: </span>
                          <span className="font-medium ml-1">{animal.prostredie}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 text-forest mr-2" />
                          <span className="text-gray-600">{t("species.status")}: </span>
                          <span
                            className={`font-medium ml-1 ${
                              animal.status.includes("Kriticky") || animal.status.includes("Critically")
                                ? "text-red-600"
                                : animal.status.includes("Chránený") || animal.status.includes("Protected")
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {animal.status}
                          </span>
                        </div>
                      </div>

                      {/* Facts */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-forest mb-2">{t("species.facts")}:</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {animal.facts.map((fact, factIndex) => (
                            <li key={factIndex} className="flex items-start">
                              <span className="text-forest mr-2">•</span>
                              {fact}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center text-forest font-medium group-hover:text-forest-light transition-colors duration-300 mt-auto">
                        {t("species.learn.more")}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conservation Status Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold text-forest mb-8">{t("species.conservation.title")}</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">{t("species.conservation.desc")}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">{t("species.conservation.stable")}</h3>
                <p className="text-green-700">{t("species.bear")}</p>
                <p className="text-sm text-green-600 mt-2">{t("species.conservation.stable.desc")}</p>
              </div>
              <div className="p-6 bg-yellow-50 rounded-lg">
                <h3 className="font-bold text-yellow-800 mb-2">{t("species.conservation.protected")}</h3>
                <p className="text-yellow-700">{t("species.wolf")}</p>
                <p className="text-sm text-yellow-600 mt-2">{t("species.conservation.protected.desc")}</p>
              </div>
              <div className="p-6 bg-red-50 rounded-lg">
                <h3 className="font-bold text-red-800 mb-2">{t("species.conservation.endangered")}</h3>
                <p className="text-red-700">{t("species.lynx")}</p>
                <p className="text-sm text-red-600 mt-2">{t("species.conservation.endangered.desc")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

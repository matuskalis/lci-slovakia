"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Users, Target, Award, Heart } from "lucide-react"

const teamMembers = [
  {
    name: "Dr. Mária Novákova",
    role: "Vedúca výskumu",
    bio: "Špecializuje sa na správanie veľkých šeliem s 15-ročnými skúsenosťami v teréne.",
    image: "Professional wildlife researcher woman, outdoor gear, forest background",
  },
  {
    name: "Ing. Peter Horváth",
    role: "Koordinátor projektov",
    bio: "Zabezpečuje koordináciu výskumných projektov a spoluprácu s partnerskými organizáciami.",
    image: "Male project coordinator, professional attire, office environment",
  },
  {
    name: "Mgr. Jana Svobodová",
    role: "Špecialista na komunikáciu",
    bio: "Venuje sa vzdelávaniu verejnosti a komunikácii s médiami o ochrane šeliem.",
    image: "Female communications specialist, presenting, educational setting",
  },
  {
    name: "Dr. Tomáš Krejčí",
    role: "Veterinár",
    bio: "Poskytuje veterinárnu starostlivosť a zdravotný monitoring sledovaných jedincov.",
    image: "Wildlife veterinarian male, medical equipment, animal care setting",
  },
]

export default function AboutPage() {
  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/placeholder.svg?height=600&width=1920" alt="Náš tím v teréne" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">O družstve LCI-SK</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto px-4">
            Sme tím odborníkov a nadšencov venujúcich sa ochrane veľkých šeliem
          </p>
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
            <h2 className="text-4xl font-serif font-bold text-forest mb-8">Naša misia</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Družstvo LCI-SK.eu vzniklo z potreby systematickej ochrany a výskumu veľkých šeliem na Slovensku. Naším
              hlavným cieľom je zabezpečiť dlhodobé prežitie rysa ostrovida, vlka dravého a medveďa hnedého v ich
              prirodzenom prostredí prostredníctvom vedeckého výskumu, ochrany habitatu a vzdelávania verejnosti.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-forest" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-2">Tímová práca</h3>
                <p className="text-gray-600">Spolupracujeme s odborníkmi z celej Európy</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-forest" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-2">Presné ciele</h3>
                <p className="text-gray-600">Každý projekt má jasne definované výsledky</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-forest" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-2">Odbornosť</h3>
                <p className="text-gray-600">Využívame najnovšie vedecké metódy</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-forest" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-2">Vášeň</h3>
                <p className="text-gray-600">Milujeme to, čo robíme</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-beige">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-forest mb-4">Náš tím</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Sme skupina odborníkov z rôznych oblastí, ktorých spája láska k prírode a záujem o ochranu veľkých šeliem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image
                    src={`/placeholder.svg?height=200&width=200&query=${member.image}`}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold text-forest mb-1">{member.name}</h3>
                <p className="text-brown font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-4xl font-serif font-bold text-forest mb-8 text-center">História družstva</h2>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-forest text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                  2018
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-forest mb-2">Založenie družstva</h3>
                  <p className="text-gray-700">
                    Skupina výskumníkov a ochranárov sa rozhodla založiť družstvo zamerané na systematický výskum a
                    ochranu veľkých šeliem na Slovensku.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-forest text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                  2021
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-forest mb-2">Medzinárodná spolupráca</h3>
                  <p className="text-gray-700">
                    Nadviazali sme spoluprácu s výskumnými inštitúciami v susedných krajinách a začali koordinované
                    projekty ochrany.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-forest text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                  2024
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-forest mb-2">Súčasnosť</h3>
                  <p className="text-gray-700">
                    Dnes sme uznávanou organizáciou v oblasti ochrany veľkých šeliem s aktívnymi projektmi po celom
                    Slovensku.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="section-padding bg-forest text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold mb-8">Naše ciele</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-xl font-serif font-bold mb-4">Výskum</h3>
                <p className="text-white/90">
                  Pokračovať vo vedeckom výskume správania, ekológie a genetiky veľkých šeliem na Slovensku.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌲</div>
                <h3 className="text-xl font-serif font-bold mb-4">Ochrana</h3>
                <p className="text-white/90">
                  Chrániť a obnovovať prirodzené habitaty a migračné koridory potrebné pre prežitie šeliem.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-serif font-bold mb-4">Vzdelávanie</h3>
                <p className="text-white/90">
                  Vzdelávať verejnosť o význame veľkých šeliem pre ekosystém a potrebe ich ochrany.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

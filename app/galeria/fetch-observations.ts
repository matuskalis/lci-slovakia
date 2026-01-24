import { supabase } from "@/lib/supabase-client"

export interface Observation {
  id: string
  species: string
  location: string
  date: string
  description: string
  image_url: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  user_id: string
  region?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export function getSpeciesName(species: string): string {
  const speciesNames: { [key: string]: string } = {
    medved: "Medveď hnedý",
    vlk: "Vlk sivý",
    rys: "Rys ostrovid",
  }
  return speciesNames[species] || species
}

export async function fetchObservations(): Promise<Observation[]> {
  try {
    const { data, error } = await supabase
      .from("observations")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching observations:", error)
      return getMockObservations()
    }

    return data || getMockObservations()
  } catch (error) {
    console.error("Unexpected error fetching observations:", error)
    return getMockObservations()
  }
}

function getMockObservations(): Observation[] {
  return [
    {
      id: "1",
      species: "medved",
      location: "Vysoké Tatry",
      date: "2024-01-15",
      description: "Medveď hnedý pozorovaný pri potoku",
      image_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10.jpg-63ITDNG8EiUVXC6aXU5RBasdazagHd.jpeg",
      status: "approved",
      created_at: "2024-01-15T10:00:00Z",
      user_id: "mock-user-1",
      region: "Prešovský kraj",
      coordinates: { lat: 49.1647, lng: 20.1674 },
    },
    {
      id: "2",
      species: "vlk",
      location: "Nízke Tatry",
      date: "2024-01-10",
      description: "Stopa vlka v snehu",
      image_url: "/placeholder.svg?height=400&width=600",
      status: "approved",
      created_at: "2024-01-10T14:30:00Z",
      user_id: "mock-user-2",
      region: "Banskobystrický kraj",
      coordinates: { lat: 48.7164, lng: 19.5914 },
    },
    {
      id: "3",
      species: "rys",
      location: "Malá Fatra",
      date: "2024-01-05",
      description: "Rys ostrovid zachytený fotopascou",
      image_url: "/placeholder.svg?height=400&width=600",
      status: "approved",
      created_at: "2024-01-05T08:15:00Z",
      user_id: "mock-user-3",
      region: "Žilinský kraj",
      coordinates: { lat: 49.2394, lng: 18.9547 },
    },
    {
      id: "4",
      species: "medved",
      location: "Malá Fatra",
      date: "2024-01-20",
      description: "Medveď hnedý v lúke s kvetmi",
      image_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7MD.jpg-XHFCGIGIGHPVajloqldP1njCnDpDhP.jpeg",
      status: "approved",
      created_at: "2024-01-20T09:15:00Z",
      user_id: "mock-user-4",
      region: "Žilinský kraj",
      coordinates: { lat: 49.2394, lng: 18.9547 },
    },
    {
      id: "5",
      species: "medved",
      location: "Slovenský raj",
      date: "2024-01-18",
      description: "Medveď odpočívajúci na skalách",
      image_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3MD.jpg-p16yHYbeSpvRiuT0GzM88SH7MyCFV0.jpeg",
      status: "approved",
      created_at: "2024-01-18T11:30:00Z",
      user_id: "mock-user-5",
      region: "Košický kraj",
      coordinates: { lat: 48.9394, lng: 20.4547 },
    },
    {
      id: "6",
      species: "medved",
      location: "Orava",
      date: "2024-01-16",
      description: "Medveď prechádzajúci lúkou",
      image_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6MD.jpg-nltQ17cXmvuNUXAXCE2RlqzluHbSBr.jpeg",
      status: "approved",
      created_at: "2024-01-16T14:45:00Z",
      user_id: "mock-user-6",
      region: "Žilinský kraj",
      coordinates: { lat: 49.3394, lng: 19.5547 },
    },
    {
      id: "7",
      species: "medved",
      location: "Veľká Fatra",
      date: "2024-01-14",
      description: "Medveď odpočívajúci na padnutom strome",
      image_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9.jpg-ds6LVroqIiTgusvp6ZOD483Barc930.jpeg",
      status: "approved",
      created_at: "2024-01-14T16:20:00Z",
      user_id: "mock-user-7",
      region: "Žilinský kraj",
      coordinates: { lat: 48.9394, lng: 19.1547 },
    },
  ]
}

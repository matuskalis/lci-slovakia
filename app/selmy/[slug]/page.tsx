import SpeciesPageClient from "./SpeciesPageClient"

interface PageProps {
  params: { slug: string }
}

export default function SpeciesPage({ params }: PageProps) {
  return <SpeciesPageClient params={params} />
}

export async function generateStaticParams() {
  return [{ slug: "medved" }, { slug: "vlk" }, { slug: "rys" }]
}

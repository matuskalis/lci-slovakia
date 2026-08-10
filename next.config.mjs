import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ['localhost', '*.supabase.co'], // Pridáme doménu Supabase pre načítanie obrázkov
    formats: ['image/webp', 'image/avif'],
    unoptimized: true,
  },
  experimental: {
    mdxRs: true,
    // The bear dataset lives outside public/ so it cannot be fetched directly;
    // the routes that read it need it traced into the serverless bundle.
    outputFileTracingIncludes: {
      "/api/medvede": ["./data/medvede-export.csv"],
      "/api/data-request/download": ["./data/medvede-export.csv"],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)

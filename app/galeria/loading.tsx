export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f523b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítavam galériu...</p>
        </div>
      </div>
    </div>
  )
}

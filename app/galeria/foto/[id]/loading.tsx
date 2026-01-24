export default function PhotoDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse mb-4" />
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

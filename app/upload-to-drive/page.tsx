"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UploadToDrivePage() {
  const handleOpenGoogleDrive = () => {
    const folderId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID || "YOUR_FOLDER_ID"
    const driveUrl = `https://drive.google.com/drive/folders/${folderId}`
    window.open(driveUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">📸 Upload Photos to Website</CardTitle>
            <p className="text-gray-600">
              Upload your wildlife photos to Google Drive and they'll automatically appear on your website every Sunday!
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={handleOpenGoogleDrive} className="w-full mb-4" size="lg">
              🚀 Open Google Drive Folder
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Click the button above to open your Google Drive folder where you can upload photos
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📋 Step-by-Step Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Click "Open Google Drive Folder"</h3>
                  <p className="text-gray-600 text-sm">This opens your special wildlife photos folder</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Upload Your Photos</h3>
                  <p className="text-gray-600 text-sm">Drag and drop photos or click "New" → "File upload"</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Name Your Photos</h3>
                  <p className="text-gray-600 text-sm">
                    Include "medved", "vlk", or "rys" in filename for automatic sorting
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold">Wait for Sunday</h3>
                  <p className="text-gray-600 text-sm">
                    Every Sunday at midnight, new photos automatically appear on your website!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-green-600">📝 Filename Examples</h3>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• "medved-v-lese.jpg" → Goes to Bears section</li>
                  <li>• "vlk-dravy-zima.jpg" → Goes to Wolves section</li>
                  <li>• "rys-na-strome.jpg" → Goes to Lynx section</li>
                  <li>• "other-animal.jpg" → Goes to Other section</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-600">📱 Upload from Phone</h3>
                <p className="text-sm text-gray-600">
                  Install Google Drive app on your phone to upload photos directly from the field!
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-purple-600">🔄 Automatic Process</h3>
                <p className="text-sm text-gray-600">
                  No need to do anything else - the system handles downloading, resizing, and publishing automatically!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">📅 Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Weekly Automatic Updates</h3>
              <p className="text-blue-700 mt-1">
                Every <strong>Sunday at 00:00 (midnight)</strong>, the system:
              </p>
              <ul className="text-blue-700 mt-2 space-y-1 text-sm">
                <li>• Checks your Google Drive folder for new photos</li>
                <li>• Downloads and processes any new images</li>
                <li>• Adds them to your website gallery</li>
                <li>• Automatically deploys the updated website</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

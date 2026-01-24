"use client"

import { useState } from "react"
import { logoutAdmin } from "../login/action"
import BlogManager from "./blog-manager"
import PhotoManager from "./photo-manager"
import TestUpload from "./test-upload"
import DatabaseCheck from "./database-check"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("photos")

  const handleLogout = async () => {
    await logoutAdmin()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Odhlásiť sa
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { id: "photos", name: "Fotografie" },
                { id: "blog", name: "Blog" },
                { id: "upload", name: "Test Upload" },
                { id: "database", name: "Databáza" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "photos" && <PhotoManager />}
            {activeTab === "blog" && <BlogManager />}
            {activeTab === "upload" && <TestUpload />}
            {activeTab === "database" && <DatabaseCheck />}
          </div>
        </div>
      </div>
    </div>
  )
}

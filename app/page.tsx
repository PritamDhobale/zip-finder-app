"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface ZipResult {
  zip_code: string
  state: string
  msa: string
}

export default function Home() {
  const [zipCode, setZipCode] = useState("")
  const [result, setResult] = useState<ZipResult | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!zipCode.trim()) {
      setError("Please enter a ZIP code")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch(`/api/search?zip=${zipCode}`)
      const data = await response.json()

      if (response.ok) {
  // Handle both new (Supabase) and old (mock) response formats
  setResult(data.result || data)
} else {
  setError("ZIP not found in database.")
}

    } catch (err) {
      setError("ZIP not found in database.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">ZIP Finder</h1>
          <p className="text-center text-gray-600 mb-8">Lookup Tool</p>

          {/* Search Card */}
          <Card className="p-8 shadow-lg border-0 bg-white">
            <div className="space-y-4">
              {/* Input Group */}
              <div className="space-y-2">
                <label htmlFor="zip-input" className="block text-sm font-medium text-gray-700">
                  Enter ZIP Code
                </label>
                <Input
                  id="zip-input"
                  type="text"
                  placeholder="e.g., 10001"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={5}
                />
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Results Card */}
            {result && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">ZIP Code</p>
                  <p className="text-lg font-semibold text-gray-900">{result.zip_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">State</p>
                  <p className="text-lg font-semibold text-gray-900">{result.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">MSA Name</p>
                  <p className="text-lg font-semibold text-gray-900">{result.msa}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">Powered by Supabase</footer>
    </div>
  )
}

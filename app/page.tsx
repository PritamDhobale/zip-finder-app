"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import "./login.css" // reuse Sage CSS theme

interface ZipResult {
  zip_code: string
  state: string
  msa: string
}

export default function ZipFinder() {
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
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div className="login-page">
      {/* Sage Logo */}
      <div className="logo-wrapper">
        <img src="/images/sage_healthy_rcm_logo.png" alt="mySAGE Logo" className="mysage-logo" />
      </div>

      {/* ZIP Finder Box */}
      <div className="login-box" style={{ backgroundColor: "#8bc53d" }}>
        {/* <h2 style={{ color: "white", fontWeight: "700", marginBottom: "1rem" }}>ZIP Finder Tool</h2> */}
        <img src="/images/dbhub5.png" alt="DBHub" className="login-logo-img" />
        <div className="space-y-4" style={{ width: "100%" }}>
          <label htmlFor="zip-input" style={{ color: "white", fontWeight: 500 }}>Enter ZIP Code</label>
          <Input
            id="zip-input"
            type="text"
            placeholder="e.g., 10001"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            maxLength={5}
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "white",
              color: "#8bc53d",
              fontWeight: "600",
              borderRadius: "5px",
              marginTop: "0.5rem",
            }}
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

        {/* Results */}
        {result && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-green-200 space-y-3 text-left">
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
      </div>

      {/* Footer */}
      <div className="powered-by-text">POWERED BY HUBONE SYSTEMS</div>
      <p className="footer-text">© 2014–2026 HubOne Systems Inc. – All Rights Reserved</p>
    </div>
  )
}

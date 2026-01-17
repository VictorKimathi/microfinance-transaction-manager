"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ApiTestPage() {
  const [status, setStatus] = useState<string>("Not tested");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const testConnection = async () => {
    setLoading(true);
    setStatus("Testing...");
    setResponse(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
      
      // Try to hit a public endpoint (login will return 401 but proves connection)
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@test.com",
          password: "test"
        })
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401 || res.status === 400) {
        // Expected - API is reachable
        setStatus("✅ Connected! Backend is reachable at " + apiUrl);
        setResponse({
          status: res.status,
          message: "API is working (received expected error response)",
          data
        });
      } else if (res.ok) {
        setStatus("✅ Connected! Backend is reachable at " + apiUrl);
        setResponse({
          status: res.status,
          message: "API is working",
          data
        });
      } else {
        setStatus("⚠️ Backend responded but with unexpected status: " + res.status);
        setResponse({
          status: res.status,
          data
        });
      }
    } catch (error: any) {
      setStatus("❌ Failed to connect to backend");
      setResponse({
        error: error.message,
        message: "Make sure backend is running on http://localhost:8080"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Backend URL:</p>
            <code className="bg-gray-100 px-3 py-2 rounded block">
              {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"}
            </code>
          </div>

          <Button 
            onClick={testConnection} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Testing Connection..." : "Test Backend Connection"}
          </Button>

          <div className="mt-6">
            <p className="font-semibold mb-2">Status:</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-lg">{status}</p>
            </div>
          </div>

          {response && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Response:</p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <p className="text-sm font-semibold mb-2">Instructions:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Make sure your backend is running on port 8080</li>
              <li>Backend should be accessible at http://localhost:8080/api</li>
              <li>Click the button above to test the connection</li>
              <li>A 401 or 400 error means the connection is working (expected for invalid credentials)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

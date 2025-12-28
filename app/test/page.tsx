"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";
import { Database, Cloud, Check, X, Loader2 } from "lucide-react";

export default function TestPage() {
    const [dbStatus, setDbStatus] = useState<any>(null);
    const [dbLoading, setDbLoading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const testDatabase = async () => {
        setDbLoading(true);
        try {
            const response = await fetch("/api/test-db");
            const data = await response.json();
            setDbStatus(data);
        } catch (error) {
            setDbStatus({ connected: false, error: "Failed to connect" });
        } finally {
            setDbLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Backend Integration Test
                    </h1>
                    <p className="text-gray-400">
                        Test Cloudinary image upload and MongoDB connection
                    </p>
                </div>

                <div className="grid gap-8">
                    {/* MongoDB Test */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                                    <Database className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        MongoDB Connection
                                    </h2>
                                    <p className="text-gray-400 text-sm">
                                        Test database connectivity
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={testDatabase}
                                disabled={dbLoading}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                            >
                                {dbLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Testing...
                                    </>
                                ) : (
                                    <>
                                        <Database className="w-4 h-4" />
                                        Test Connection
                                    </>
                                )}
                            </Button>
                        </div>

                        {dbStatus && (
                            <div
                                className={`p-4 rounded-lg border ${dbStatus.connected
                                        ? "bg-green-500/10 border-green-500/20"
                                        : "bg-red-500/10 border-red-500/20"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {dbStatus.connected ? (
                                        <Check className="w-5 h-5 text-green-400 mt-0.5" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-400 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p
                                            className={`font-semibold mb-2 ${dbStatus.connected ? "text-green-400" : "text-red-400"
                                                }`}
                                        >
                                            {dbStatus.message}
                                        </p>
                                        {dbStatus.connected && (
                                            <div className="text-sm text-gray-300 space-y-1">
                                                <p>User Count: {dbStatus.userCount}</p>
                                                <p className="text-gray-500">
                                                    Timestamp: {dbStatus.timestamp}
                                                </p>
                                            </div>
                                        )}
                                        {dbStatus.error && (
                                            <p className="text-sm text-red-300">{dbStatus.error}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cloudinary Upload Test */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center">
                                <Cloud className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Cloudinary Upload
                                </h2>
                                <p className="text-gray-400 text-sm">Test image upload</p>
                            </div>
                        </div>

                        <ImageUpload
                            onUploadComplete={(url) => {
                                setUploadedUrl(url);
                                console.log("Uploaded:", url);
                            }}
                        />

                        {uploadedUrl && (
                            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-green-400 mb-2">
                                            Upload Successful!
                                        </p>
                                        <p className="text-sm text-gray-300 break-all">
                                            {uploadedUrl}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Environment Check */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4">
                            Environment Configuration
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Cloudinary Cloud Name:</span>
                                <span className="text-white font-mono">
                                    {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
                                        "Not configured"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">App URL:</span>
                                <span className="text-white font-mono">
                                    {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
                                </span>
                            </div>
                            <p className="text-gray-500 text-xs mt-4">
                                Note: Configure your environment variables in .env.local
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <a href="/" className="text-orange-400 hover:text-orange-300">
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}

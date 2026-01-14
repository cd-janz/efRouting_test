import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    crossOrigin: "use-credentials",
    async rewrites(){
        console.log("exist: ", process.env)
        console.log("exist: ", process)
        console.log("🔍 DEBUG - INICIO DEL REWRITE");
        console.log("👉 INTERNAL_API_URL:", process.env.INTERNAL_API_URL ? "DEFINIDA" : "MISSING");
        console.log("👉 VALOR ACTUAL:", process.env.INTERNAL_API_URL);
        const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        return [
            {
                source: "/api/v1/:path*",
                destination: `${apiUrl}/api/v1/:path*`,
            }
        ]
    }
};

export default nextConfig;

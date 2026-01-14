import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    crossOrigin: "use-credentials",
    async rewrites(){
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

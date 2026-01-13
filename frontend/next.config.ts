import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    async rewrites() {
        const apiUrl = process.env.INTERNAL_API_URL || 'http://backend-placeholder:8080';
        return [
            {
                source: '/api/v1/:path*',
                destination: `${apiUrl}/api/v1/:path*`,
            },
        ]
    },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    crossOrigin: "use-credentials",
    async rewrites(){
        return[
            {
                source: "/api/v1:path*",
                destination: `${process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
            }
        ]
    }
};

export default nextConfig;

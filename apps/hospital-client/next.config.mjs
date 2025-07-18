/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_URL: process.env.URL,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "github.com",
                port: "",
                pathname: "/",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', '.prisma'],
        // Add this to ensure Prisma engine files are included
        outputFileTracingIncludes: {
            '**': ['node_modules/.prisma/**/*'],
        },
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push('_http_common');
        }
        return config;
    },
};

export default nextConfig;
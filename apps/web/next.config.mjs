// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile our shared package from the monorepo
  transpilePackages: ["@nexus/shared"],

  // Security headers (additional to Helmet on the API)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
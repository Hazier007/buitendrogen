import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.buitendrogen.be" }],
        destination: "https://buitendrogen.be/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

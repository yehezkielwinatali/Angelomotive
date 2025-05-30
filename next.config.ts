import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qwwcwifopohhpgznpxez.supabase.co",
      },
    ],
  },
  /* config options here */
  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-src 'self' https://angelomotive-waitlist.created.app https://angelomotive-waitlist.vercel.app https://angelomotive-waitlist.pages.dev https://angelomotive-waitlist.pages.dev/ https://angelomotive-waitlist.pages.dev/embed",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

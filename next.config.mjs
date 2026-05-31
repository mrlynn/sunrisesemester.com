import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    const partyEvent = "/events/anniversary-2026";
    return [
      { source: "/party", destination: partyEvent, permanent: true },
      { source: "/picnic", destination: partyEvent, permanent: true },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https:/2qf0wdpdx3.ufs.sh/**"),
      new URL("https://utfs.io/**"),
    ],
  },
};

export default nextConfig;

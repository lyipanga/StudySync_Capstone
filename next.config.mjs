// next.config.mjs
import path from "path";

export default {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*", // Proxy to API to serve the uploaded files
      },
    ];
  },
};

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Deshabilitar ESLint durante el build
  },
  serverExternalPackages: ['@prisma/client', 'prisma'], // Moved from experimental
  // Añadir assetPrefix para usar el favicon
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Link',
            value: 'https://statics.exitosanoticias.pe/exitosa/img/global/favicon.png',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
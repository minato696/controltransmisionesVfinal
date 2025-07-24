/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',  // Generar salida estática
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

module.exports = nextConfig;

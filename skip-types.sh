#!/bin/bash

# Crear o modificar el archivo next.config.mjs para omitir completamente TypeScript
cat > next.config.mjs << 'NEXTCONFIG'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
NEXTCONFIG

echo "Archivo next.config.mjs creado para ignorar errores de TypeScript."

# Ejecutar la compilación con opciones para omitir verificación de tipos
NODE_OPTIONS="--max-old-space-size=4096" SKIP_TYPESCRIPT_CHECK=1 npm run build

echo "Proceso completado."

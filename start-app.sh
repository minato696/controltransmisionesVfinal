#!/bin/bash
# Script para iniciar la aplicación en modo producción

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando Control de Transmisiones Exitosa${NC}"

# Verificar si existe el directorio .next
if [ ! -d ".next" ]; then
  echo -e "${YELLOW}No se encontró la carpeta .next. Ejecutando build...${NC}"
  npm run build
  if [ 0 -ne 0 ]; then
    echo -e "${RED}Error durante el build. Por favor, revise los errores y corrija los problemas.${NC}"
    exit 1
  fi
  echo -e "${GREEN}Build completado con éxito.${NC}"
fi

# Iniciar la aplicación
echo -e "${YELLOW}Iniciando la aplicación...${NC}"
npm run start

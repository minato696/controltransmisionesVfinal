#!/bin/bash
# Script para iniciar la aplicación en modo producción

# Colores para mensajes
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
ROJO='\033[0;31m'
NC='\033[0m' # Sin Color

echo -e "${AMARILLO}Iniciando Control de Transmisiones Exitosa${NC}"

# Verificar si existe el directorio .next
if [ ! -d ".next" ]; then
  echo -e "${AMARILLO}No se encontró la carpeta .next. Ejecutando build...${NC}"
  npm run build
  if [ 0 -ne 0 ]; then
    echo -e "${ROJO}Error durante el build. Por favor, revise los errores y corrija los problemas.${NC}"
    exit 1
  fi
  echo -e "${VERDE}Build completado con éxito.${NC}"
fi

# Iniciar la aplicación
echo -e "${AMARILLO}Iniciando la aplicación...${NC}"
npm run start

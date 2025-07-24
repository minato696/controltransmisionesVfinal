#!/bin/bash
# Ejecutar migración de la base de datos

# Crear la migración (si no existe)
npx prisma migrate dev --name init

# Aplicar la migración
npx prisma migrate deploy

# Ejecutar el script de configuración
node setup-database.js

echo "Migración de base de datos completada."

#!/bin/bash

# Colores para mensajes
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
ROJO='\033[0;31m'
NC='\033[0m' # Sin Color

echo -e "${AMARILLO}=== Script de configuración completa para Control de Transmisiones Exitosa ===${NC}"

# 1. Arreglar los permisos
echo -e "${AMARILLO}Corrigiendo permisos de los directorios...${NC}"
sudo chown -R $(whoami):$(whoami) .
sudo chmod -R 755 .

# 2. Limpiar y reinstalar node_modules si hay problemas
if [ -d "node_modules" ]; then
  echo -e "${AMARILLO}Eliminando node_modules para reinstalar con permisos correctos...${NC}"
  sudo rm -rf node_modules
  echo -e "${VERDE}node_modules eliminado correctamente.${NC}"
fi

echo -e "${AMARILLO}Instalando dependencias...${NC}"
npm install
echo -e "${VERDE}Dependencias instaladas correctamente.${NC}"

# 3. Corregir next.config.ts
echo -e "${AMARILLO}Corrigiendo next.config.ts...${NC}"
cat > next.config.ts << EOF
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* opciones de configuración aquí */
  // La configuración del servidor debe estar en los comandos de script
  
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
EOF
echo -e "${VERDE}next.config.ts corregido.${NC}"

# 4. Corregir la ruta API
echo -e "${AMARILLO}Corrigiendo la ruta API...${NC}"
mkdir -p src/app/api/filiales/\[id\]/programas
cat > src/app/api/filiales/\[id\]/programas/route.ts << EOF
import { NextRequest, NextResponse } from 'next/server';
import { Programa } from '@/app/types/programa';

// Datos de ejemplo
const programas: Programa[] = [
  {
    id: '1',
    nombre: 'Programa de Capacitación',
    descripcion: 'Capacitación para nuevos empleados',
    filialId: '1',
    fechaInicio: '2023-02-10T00:00:00Z',
    fechaFin: '2023-05-10T00:00:00Z',
    estado: 'finalizado',
  },
  {
    id: '2',
    nombre: 'Programa de Desarrollo',
    descripcion: 'Desarrollo de nuevas habilidades',
    filialId: '1',
    fechaInicio: '2023-06-01T00:00:00Z',
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'Programa de Integración',
    descripcion: 'Integración de equipos',
    filialId: '2',
    fechaInicio: '2023-04-15T00:00:00Z',
    estado: 'activo',
  },
  {
    id: '4',
    nombre: 'Programa de Ventas',
    descripcion: 'Capacitación en ventas',
    filialId: '2',
    fechaInicio: '2023-03-01T00:00:00Z',
    fechaFin: '2023-04-30T00:00:00Z',
    estado: 'finalizado',
  },
  {
    id: '5',
    nombre: 'Programa de Innovación',
    descripcion: 'Desarrollo de ideas innovadoras',
    filialId: '3',
    fechaInicio: '2023-07-01T00:00:00Z',
    estado: 'inactivo',
  },
];

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  const filialId = params.id;
  const programasFiltrados = programas.filter(p => p.filialId === filialId);
  
  return NextResponse.json(programasFiltrados);
}
EOF
echo -e "${VERDE}Ruta API corregida.${NC}"

# 5. Corregir setup-database.js
echo -e "${AMARILLO}Corrigiendo setup-database.js...${NC}"
cat > setup-database.js << EOF
// setup-database.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando configuración de la base de datos...');

  // Crear días de la semana
  const diasSemana = [
    { nombre: 'LUNES' },
    { nombre: 'MARTES' },
    { nombre: 'MIERCOLES' },
    { nombre: 'JUEVES' },
    { nombre: 'VIERNES' },
    { nombre: 'SABADO' },
    { nombre: 'DOMINGO' }
  ];

  console.log('Creando días de la semana...');
  for (const dia of diasSemana) {
    await prisma.diaSemana.upsert({
      where: { nombre: dia.nombre },
      update: {},
      create: dia,
    });
  }

  // Crear estados de transmisión
  const estados = [
    { nombre: 'Pendiente' },
    { nombre: 'Si' },
    { nombre: 'No' },
    { nombre: 'Tarde' }
  ];

  console.log('Creando estados de transmisión...');
  for (const estado of estados) {
    await prisma.estadoTransmision.upsert({
      where: { nombre: estado.nombre },
      update: {},
      create: estado,
    });
  }

  // Crear targets/motivos
  const targets = [
    { codigo: 'Fta', nombre: 'Falta', tipo: 'no_transmitio' },
    { codigo: 'Enf', nombre: 'Enfermedad', tipo: 'no_transmitio' },
    { codigo: 'P.Tec', nombre: 'Problema técnico', tipo: 'ambos' },
    { codigo: 'F.Serv', nombre: 'Falla de servicios', tipo: 'ambos' },
    { codigo: 'Tde', nombre: 'Tarde', tipo: 'transmitio_tarde' },
    { codigo: 'Otros', nombre: 'Otro', tipo: 'ambos' }
  ];

  console.log('Creando targets/motivos...');
  for (const target of targets) {
    await prisma.target.upsert({
      where: { codigo: target.codigo },
      update: {},
      create: target,
    });
  }

  // Crear algunas filiales de ejemplo
  const filiales = [
    { nombre: 'AREQUIPA', activa: true },
    { nombre: 'CHICLAYO', activa: true },
    { nombre: 'CUSCO', activa: true },
    { nombre: 'HUANCAYO', activa: true },
    { nombre: 'LIMA', activa: true },
    { nombre: 'PIURA', activa: true },
    { nombre: 'TRUJILLO', activa: true }
  ];

  console.log('Creando filiales de ejemplo...');
  for (const filial of filiales) {
    try {
      const existingFilial = await prisma.filial.findFirst({ 
        where: { nombre: filial.nombre } 
      });
      
      if (existingFilial) {
        await prisma.filial.update({
          where: { id: existingFilial.id },
          data: { activa: filial.activa }
        });
        console.log(\`Filial \${filial.nombre} actualizada\`);
      } else {
        await prisma.filial.create({
          data: filial
        });
        console.log(\`Filial \${filial.nombre} creada\`);
      }
    } catch (error) {
      console.error(\`Error al procesar filial \${filial.nombre}:\`, error);
    }
  }

  console.log('Base de datos configurada correctamente.');
}

main()
  .catch(e => {
    console.error('Error durante la configuración de la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.\$disconnect();
  });
EOF
echo -e "${VERDE}setup-database.js corregido.${NC}"

# 6. Generar el cliente Prisma
echo -e "${AMARILLO}Generando cliente Prisma...${NC}"
npx prisma generate
echo -e "${VERDE}Cliente Prisma generado.${NC}"

# 7. Migrar la base de datos
echo -e "${AMARILLO}Migrando la base de datos...${NC}"
npx prisma migrate dev --name initial
echo -e "${VERDE}Migración completada.${NC}"

# 8. Ejecutar el script de configuración de datos
echo -e "${AMARILLO}Ejecutando script de configuración de datos...${NC}"
node setup-database.js
echo -e "${VERDE}Datos iniciales configurados.${NC}"

# 9. Construir la aplicación
echo -e "${AMARILLO}Construyendo la aplicación...${NC}"
npm run build
echo -e "${VERDE}Aplicación construida correctamente.${NC}"

echo ""
echo -e "${VERDE}=========================================================${NC}"
echo -e "${VERDE}¡Configuración completada exitosamente!${NC}"
echo -e "${VERDE}=========================================================${NC}"
echo ""
echo -e "${AMARILLO}Para iniciar la aplicación, ejecute:${NC}"
echo -e "${VERDE}npm run start${NC}"
echo ""
echo -e "${AMARILLO}Para acceder a la aplicación, vaya a:${NC}"
echo -e "${VERDE}http://192.168.10.188:5885${NC}"
echo ""
echo -e "${AMARILLO}Credenciales de acceso:${NC}"
echo -e "${VERDE}Usuario: exitosa${NC}"
echo -e "${VERDE}Contraseña: 147ABC55${NC}"
echo ""

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
        console.log(`Filial ${filial.nombre} actualizada`);
      } else {
        await prisma.filial.create({
          data: filial
        });
        console.log(`Filial ${filial.nombre} creada`);
      }
    } catch (error) {
      console.error(`Error al procesar filial ${filial.nombre}:`, error);
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
    await prisma.$disconnect();
  });

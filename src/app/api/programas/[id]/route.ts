import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID de programa inválido' }, { status: 400 });
    }

    const programa = await prisma.programa.findUnique({
      where: { id: numericId },
      include: {
        filiales: {
          include: {
            filial: true
          }
        },
        diasSemana: {
          include: {
            diaSemana: true
          }
        }
      }
    });
    
    if (!programa) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }
    
    // Transformar datos para el formato esperado por el frontend
    const transformedPrograma = {
      id: programa.id,
      nombre: programa.nombre,
      descripcion: programa.descripcion || '',
      filialId: programa.filiales[0]?.filialId || null,
      fechaInicio: programa.fechaInicio.toISOString().split('T')[0],
      fechaFin: programa.fechaFin ? programa.fechaFin.toISOString().split('T')[0] : null,
      estado: programa.estado,
      horario: programa.horaInicio,
      horaInicio: programa.horaInicio,
      isActivo: programa.estado === 'activo',
      diasSemana: programa.diasSemana.map((d: { diaSemana: { nombre: string } }) => d.diaSemana.nombre),
      filialesIds: programa.filiales.map((f: { filialId: number }) => f.filialId),
      createdAt: programa.createdAt.toISOString(),
      updatedAt: programa.updatedAt.toISOString()
    };
    
    return NextResponse.json(transformedPrograma);
  } catch (error) {
    console.error(`Error al obtener programa:`, error);
    return NextResponse.json({ error: 'Error al obtener programa' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    const body = await request.json();
    
    // Validar ID
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID de programa inválido' }, { status: 400 });
    }
    
    // Verificar si el programa existe
    const existePrograma = await prisma.programa.findUnique({
      where: { id: numericId }
    });
    
    if (!existePrograma) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }
    
    // Actualizar programa básico
    await prisma.programa.update({
      where: { id: numericId },
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        horaInicio: body.horaInicio || body.horario,
        estado: body.estado,
        fechaInicio: body.fechaInicio ? new Date(body.fechaInicio) : undefined,
        fechaFin: body.fechaFin ? new Date(body.fechaFin) : null
      }
    });
    
    // Si hay días de la semana nuevos, actualizar
    if (body.diasSemana && body.diasSemana.length > 0) {
      // Obtener IDs de días de la semana
      const diasSemana = await prisma.diaSemana.findMany({
        where: {
          nombre: {
            in: body.diasSemana
          }
        }
      });
      
      if (diasSemana.length > 0) {
        // Eliminar relaciones existentes
        await prisma.programaDia.deleteMany({
          where: { programaId: numericId }
        });
        
        // Crear nuevas relaciones
        await Promise.all(
          diasSemana.map((dia: { id: number }) => 
            prisma.programaDia.create({
              data: {
                programaId: numericId,
                diaSemanaId: dia.id
              }
            })
          )
        );
      }
    }
    
    // Si hay filiales nuevas, actualizar
    if (body.filialIds && body.filialIds.length > 0) {
      // Eliminar relaciones existentes
      await prisma.filialPrograma.deleteMany({
        where: { programaId: numericId }
      });
      
      // Crear nuevas relaciones
      await Promise.all(
        body.filialIds.map((filialId: number) => 
          prisma.filialPrograma.create({
            data: {
              programaId: numericId,
              filialId
            }
          })
        )
      );
    }
    
    // Obtener programa actualizado con relaciones
    const programaCompleto = await prisma.programa.findUnique({
      where: { id: numericId },
      include: {
        filiales: {
          include: {
            filial: true
          }
        },
        diasSemana: {
          include: {
            diaSemana: true
          }
        }
      }
    });
    
    if (!programaCompleto) {
      return NextResponse.json({ error: 'Error al obtener programa actualizado' }, { status: 500 });
    }
    
    // Transformar para respuesta
    const transformedPrograma = {
      id: programaCompleto.id,
      nombre: programaCompleto.nombre,
      descripcion: programaCompleto.descripcion || '',
      filialId: programaCompleto.filiales[0]?.filialId || null,
      fechaInicio: programaCompleto.fechaInicio.toISOString().split('T')[0],
      fechaFin: programaCompleto.fechaFin ? programaCompleto.fechaFin.toISOString().split('T')[0] : null,
      estado: programaCompleto.estado,
      horario: programaCompleto.horaInicio,
      horaInicio: programaCompleto.horaInicio,
      isActivo: programaCompleto.estado === 'activo',
      diasSemana: programaCompleto.diasSemana.map((d: { diaSemana: { nombre: string } }) => d.diaSemana.nombre),
      filialesIds: programaCompleto.filiales.map((f: { filialId: number }) => f.filialId),
      createdAt: programaCompleto.createdAt.toISOString(),
      updatedAt: programaCompleto.updatedAt.toISOString()
    };
    
    return NextResponse.json(transformedPrograma);
  } catch (error) {
    console.error(`Error al actualizar programa:`, error);
    return NextResponse.json({ error: 'Error al actualizar programa' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    
    // Validar ID
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID de programa inválido' }, { status: 400 });
    }
    
    // Verificar si el programa existe
    const existePrograma = await prisma.programa.findUnique({
      where: { id: numericId }
    });
    
    if (!existePrograma) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }
    
    // Eliminar programa
    // Las relaciones se eliminarán automáticamente gracias a onDelete: Cascade
    await prisma.programa.delete({
      where: { id: numericId }
    });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error al eliminar programa:`, error);
    return NextResponse.json({ error: 'Error al eliminar programa' }, { status: 500 });
  }
}
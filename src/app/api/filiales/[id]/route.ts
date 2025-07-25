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
    
    const filial = await prisma.filial.findUnique({
      where: { id: numericId },
      include: {
        programas: {
          include: {
            programa: true
          }
        }
      }
    });
    
    if (!filial) {
      return NextResponse.json({ error: 'Filial no encontrada' }, { status: 404 });
    }
    
    // Transformar datos para el formato esperado por el frontend
    const transformedFilial = {
      id: filial.id,
      nombre: filial.nombre,
      activa: filial.activa,
      fechaCreacion: filial.createdAt.toISOString(),
      isActivo: filial.activa,
      programaIds: filial.programas.map((p: { programaId: number }) => p.programaId),
      programas: filial.programas.map((p: { programa: unknown }) => p.programa),
      createdAt: filial.createdAt.toISOString(),
      updatedAt: filial.updatedAt.toISOString()
    };
    
    return NextResponse.json(transformedFilial);
  } catch (error) {
    console.error(`Error al obtener filial:`, error);
    return NextResponse.json({ error: 'Error al obtener filial' }, { status: 500 });
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
    
    const updatedFilial = await prisma.filial.update({
      where: { id: numericId },
      data: {
        nombre: body.nombre,
        activa: body.activa
      }
    });
    
    return NextResponse.json(updatedFilial);
  } catch (error) {
    console.error(`Error al actualizar filial:`, error);
    return NextResponse.json({ error: 'Error al actualizar filial' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    
    await prisma.filial.delete({
      where: { id: numericId }
    });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error al eliminar filial:`, error);
    return NextResponse.json({ error: 'Error al eliminar filial' }, { status: 500 });
  }
}
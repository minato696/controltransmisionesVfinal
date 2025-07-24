import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id);
    
    const filial = await prisma.filial.findUnique({
      where: { id },
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
      programaIds: filial.programas.map((p: any) => p.programaId),
      programas: filial.programas.map((p: any) => p.programa),
      createdAt: filial.createdAt.toISOString(),
      updatedAt: filial.updatedAt.toISOString()
    };
    
    return NextResponse.json(transformedFilial);
  } catch (error) {
    console.error(`Error al obtener filial con ID ${context.params.id}:`, error);
    return NextResponse.json({ error: 'Error al obtener filial' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id);
    const body = await request.json();
    
    const updatedFilial = await prisma.filial.update({
      where: { id },
      data: {
        nombre: body.nombre,
        activa: body.activa
      }
    });
    
    return NextResponse.json(updatedFilial);
  } catch (error) {
    console.error(`Error al actualizar filial con ID ${context.params.id}:`, error);
    return NextResponse.json({ error: 'Error al actualizar filial' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id);
    
    await prisma.filial.delete({
      where: { id }
    });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error al eliminar filial con ID ${context.params.id}:`, error);
    return NextResponse.json({ error: 'Error al eliminar filial' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH para Aceptar/Gestionar estado
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { estado } = await req.json();
    const actualizado = await prisma.forum.update({
      where: { id: params.id },
      data: { estado }
    });
    return NextResponse.json(actualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

// DELETE para eliminar el mensaje
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Nota: MongoDB con Prisma borrará este registro. 
    // Si tiene hijos, asegúrate de haber definido onDelete: Cascade en tu schema.
    await prisma.forum.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Eliminado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
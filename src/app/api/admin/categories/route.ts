import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Blog from '@/models/Blog'; // Si sigue fallando, prueba: import Blog from '../../../models/Blog';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Obtenemos todas las categorías
    const categories = await Category.find({}).lean();

    // 2. Calculamos el conteo de blogs para cada una
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat: any) => {
        // Buscamos blogs que coincidan con el ID de esta categoría
        const count = await Blog.countDocuments({ categoryId: cat._id });
        
        return {
          _id: cat._id.toString(),
          name: cat.name,
          count: count
        };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error: any) {
    console.error("Error en GET /api/admin/categories:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// MÉTODO POST: Aquí es donde se crean las nuevas doctrinas
export async function POST(request: Request) {
  try {
    await connectDB();
    
    // 1. Obtener los datos del cuerpo de la petición
    const { name } = await request.json();

    // 2. Validación básica
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    // 3. Verificar si ya existe (opcional pero recomendado)
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return NextResponse.json({ error: "Esta categoría ya existe" }, { status: 400 });
    }

    // 4. Crear en la base de datos de Docker
    const newCategory = await Category.create({ 
      name: name.trim() 
    });

    console.log("✅ Categoría creada:", newCategory.name);
    
    return NextResponse.json(newCategory, { status: 201 });

  } catch (error: any) {
    console.error("❌ Error en POST Admin Categories:", error);
    return NextResponse.json(
      { error: "Error interno al crear categoría", details: error.message }, 
      { status: 500 }
    );
  }
}

// --- PUT: Editar categoría ---
export async function PUT(request: Request) {
  try {
    await connectDB();
    const { id, newName } = await request.json();

    if (!id || !newName) {
      return NextResponse.json({ error: "ID y nuevo nombre son requeridos" }, { status: 400 });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: newName.trim() },
      { new: true } // Esto devuelve el objeto ya modificado
    );

    if (!updatedCategory) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    }

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// --- DELETE: Eliminar categoría ---
export async function DELETE(request: Request) {
  try {
    await connectDB();
    // En DELETE solemos pasar el ID por la URL o el body
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Categoría eliminada correctamente" });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
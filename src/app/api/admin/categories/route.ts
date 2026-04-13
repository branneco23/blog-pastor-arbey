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
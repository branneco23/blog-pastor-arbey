import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find({}).lean();

    // Mapeamos las categorías para incluir el conteo de blogs y normalizar el ID
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat: any) => {
        const count = await Blog.countDocuments({ categoryId: cat._id });
        return {
          _id: cat._id.toString(),
          id: cat._id.toString(), // Doble compatibilidad
          name: cat.name,
          count: count
        };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error: any) {
    console.error("Error en GET /api/categories:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
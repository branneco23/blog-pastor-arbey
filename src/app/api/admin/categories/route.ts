import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Blog from '@/models/Blog';

export async function GET() {
  await connectDB();
  
  // Obtenemos todas las categorías
  const categories = await Category.find().sort({ name: 1 }).lean();

  // Para cada categoría, contamos cuántos blogs la usan
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Blog.countDocuments({ category: cat.name });
      return { ...cat, count };
    })
  );

  return NextResponse.json(categoriesWithCount);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { name } = await req.json();
  const slug = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const newCategory = await Category.create({ name, slug });
  return NextResponse.json(newCategory);
}
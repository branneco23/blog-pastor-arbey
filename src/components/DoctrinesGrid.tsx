import CategoryFilter from './CategoryFilter';
import DoctrineCard from './BlogCard';

const doctrines = [
  {
    category: "Fundamentos de Fe",
    title: "La Unidad de Dios: Monoteísmo Estricto",
    description: "Exploramos la doctrina fundamental de la unicidad de Dios según las Escrituras y la revelación del nombre de Jesús.",
    date: "14 mar 2024",
    readTime: "8 min",
    image: "/images/doctrine1.jpg", // Asegúrate de tener estas imágenes
    slug: "unidad-de-dios"
  },
  {
    category: "Fundamentos de Fe",
    title: "La Unidad de Dios: Monoteísmo Estricto",
    description: "Exploramos la doctrina fundamental de la unicidad de Dios según las Escrituras y la revelación del nombre de Jesús.",
    date: "14 mar 2024",
    readTime: "8 min",
    image: "/images/doctrine1.jpg", // Asegúrate de tener estas imágenes
    slug: "unidad-de-dios"
  },
  {
    category: "Fundamentos de Fe",
    title: "La Unidad de Dios: Monoteísmo Estricto",
    description: "Exploramos la doctrina fundamental de la unicidad de Dios según las Escrituras y la revelación del nombre de Jesús.",
    date: "14 mar 2024",
    readTime: "8 min",
    image: "/images/doctrine1.jpg", // Asegúrate de tener estas imágenes
    slug: "unidad-de-dios"
  },
  {
    category: "Fundamentos de Fe",
    title: "La Unidad de Dios: Monoteísmo Estricto",
    description: "Exploramos la doctrina fundamental de la unicidad de Dios según las Escrituras y la revelación del nombre de Jesús.",
    date: "14 mar 2024",
    readTime: "8 min",
    image: "/images/doctrine1.jpg", // Asegúrate de tener estas imágenes
    slug: "unidad-de-dios"
  },
  // ... Duplica para los otros 5 elementos de tu Figma
];

export default function DoctrineGrid() {
  return (
    <section className="bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <CategoryFilter />

        <div className="mt-8 mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Todas las Doctrinas</h2>
          <p className="text-slate-500 font-bold mt-1">{doctrines.length} doctrinas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctrines.map((item, index) => (
            <DoctrineCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
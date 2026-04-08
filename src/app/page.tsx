import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DoctrinesGrid from '@/components/DoctrinesGrid'; // Importa el nuevo componente
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Hero />
      <DoctrinesGrid /> 
      <Footer/>
    </main>
  );
}
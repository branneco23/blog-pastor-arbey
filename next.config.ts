/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Requerido para exportación estática si usas <Image /> de Next
  },
};

export default nextConfig;
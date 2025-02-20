"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Preloader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // Simula tiempo de carga
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <p className="text-white text-2xl">Cargando...</p>
    </div>
  );
}

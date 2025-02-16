'use client'
import Canvas from '@/components/home/shirt/canvas';
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { useEffect, useState } from "react";

export default function Shirt() {
  const [mostrarTarjeta, setMostrarTarjeta] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(false);

  const mostrarTarjetaHandler = () => {
    setMostrarTarjeta(true);
  };

  const ocultarTarjetaHandler = () => {
    setMostrarTarjeta(false);
  };

  const checkWebGLAvailability = () => {
    try {
      var canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    setWebGLAvailable(checkWebGLAvailability());
  }, []);

  return (
    <>
      <div className="relative duration-700 z-0 w-full md:w-5/12 lg:w-3/12 h-full" onMouseEnter={mostrarTarjetaHandler} onMouseLeave={ocultarTarjetaHandler}>
        <div className={`absolute hidden 2xl:flex hover-camiseta text-end backdrop-blur z-10 transition-opacity duration-1000 ease-in ${mostrarTarjeta ? 'opacity-100' : 'opacity-0'}`}>
          <Card isBlurred className="border-none p-2" shadow="sm">
            <CardBody>
              <p className="text-2xl inter font-semibold">2025 PRO JERSEY</p>
              <div className="grid grid-cols-3 gap-4 pt-2 align-middle">
                <div className="pt-1"><p className="text-base major price w-min">69,99€</p></div>
                <div className="col-span-2"><Button color="primary" variant="shadow">Comprar</Button></div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="w-full camiseta top-1/2 my-96">
          <Canvas />
        </div>
      </div>
    </>
  );
}
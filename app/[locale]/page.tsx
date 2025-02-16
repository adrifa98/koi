import KoiFish from '@/components/home/koifish';
import Shirt from '@/components/home/shirt/shirt';
import Image from 'next/image';
import { Suspense } from 'react';

export const runtime = 'edge';

export const metadata = {
  description: 'Movistar KOI',
  openGraph: {
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <div className="background-header">
        <header className="w-full h-screen">
          <div className="relative justify-center items-center w-full h-full">
            {/* ✅ Reemplazo de <img> por <Image> */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="bg-cover bg-center absolute w-full h-full object-cover animate-fade-down z-0"
            >
              <source src="/home/background.mp4" type="video/mp4" />
              <Image
                src="/home/background.jpg"
                alt="Background"
                fill
                className="object-cover"
              />
            </video>

            <div className="absolute z-2 w-full h-full top-0 left-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020113] to-transparent"></div>
            </div>

            <div className="top-0 left-0 absolute h-full w-full object-cover z-0 pt-32 xl:mt-16 xl:pt-0 animate-fade-up">
              <Image
                draggable={false}
                src="/home/back.png"
                alt="Dragón frontal"
                fill
                className="object-cover"
              />
            </div>

            <Suspense>
              <div className="flex justify-center items-center w-full h-full z-10">
                <Shirt />
              </div>
            </Suspense>

            <div className="top-0 left-0 hidden lg:flex absolute h-full w-full object-cover z-0 dragon-frontal pt-32 xl:mt-16 xl:pt-0 animate-fade-up">
              <Image
                draggable={false}
                src="/home/front.png"
                alt="Dragón frontal"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </header>

        <article className="pt-8 overflow-x-hidden">
          <div className="relative justify-center items-center object-center">
            <div className="bg-gradient-to-r p-4 text-center">
              {/* ✅ Escapado de comillas */}
              <h1 className="text-white text-sm md:text-md lg:text-2xl uppercase mb-14 pt-4 inter py-5 px-4 md:px-10 max-w-4xl mx-auto">
                &quot;Narrando el periplo de la karpa, que contra toda adversidad
                montañosa, se eleva en forma de dragón como una metáfora de triunfo y
                resiliencia.&quot;
              </h1>

              <div className="mx-0 md:mx-1 lg:mx-8">
                <div>
                  <KoiFish />
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center w-full">
              <div className="container md:pt-24 -translate-y-64">
                {/* Sección 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="flex text-left w-full p-4 col-span-2">
                    <div className="p-4 text-white md:text-base">
                      <h2 className="text-4xl pb-4">
                        Comprometidos con la responsabilidad social
                      </h2>
                      <p className="text-xl">
                        En Movistar KOI, nos comprometemos profundamente con la inclusión,
                        el respeto y la sostenibilidad ambiental. Nuestro enfoque va más
                        allá de lo competitivo, enfocándonos en prácticas responsables y
                        ecológicas, junto con la promoción de un ambiente diverso y
                        respetuoso, demostrando nuestro compromiso con valores
                        fundamentales en el mundo de los esports.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sección 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-64">
                  <div></div>
                  <div className="flex text-right w-full p-4 col-span-2">
                    <div className="p-4 text-white md:text-base">
                      <h2 className="text-4xl pb-4">
                        Uniendo Pasiones, Construyendo Comunidad
                      </h2>
                      <p className="text-xl">
                        Nos distinguimos en el mundo de los esports y el entretenimiento
                        digital por nuestro enfoque innovador y nuestra estrecha relación
                        con la comunidad. Con un fuerte énfasis en la narrativa, nos
                        dedicamos a influir positivamente en las jóvenes generaciones y en
                        la sociedad en general, siempre impulsados por una pasión intensa y
                        un deseo de trascender lo convencional.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

'use client'
import CanvasVideo from '@/components/home/canvasvideo';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

const KoiFish = () => {
    gsap.registerPlugin(ScrollTrigger);

    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;

        // Define el punto de inicio y finalización para los ejes X y Y
        const startX = window.innerWidth;
        const endX = -startX; // Asegura que se mueva completamente fuera de la pantalla
        const startY = -250; // Comienza en la parte superior del viewport
        const endY = window.innerHeight + 700; // Termina en la parte inferior del viewport

        gsap.fromTo(section, {
            x: startX,
            y: startY,
            scale: 1,
        }, {
            x: endX,
            y: endY,
            scale: 1.3,
            scrollTrigger: {
                trigger: section,
                start: "top bottom", // Empieza la animación cuando el elemento entra en el viewport
                end: "bottom+=3000 top", // Ajusta esta línea para controlar la duración de la animación
                scrub: true,
            },
            ease: "none",
        });
    }, []);

    return (
        <div ref={sectionRef} className='w-100 overflow-x-hidden'>
            <CanvasVideo />
        </div>
    );
};

export default KoiFish;

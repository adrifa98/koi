'use client'
import { useEffect, useRef } from 'react';

const CanvasVideo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const drawVideoFrame = () => {
      if (!video.paused && !video.ended) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawVideoFrame);
      }
    };

    video.addEventListener('play', drawVideoFrame);

    const handleScroll = () => {
      if (video.playbackRate !== 1.8) {
        video.playbackRate = 1.8;
      }
    };

    const handleScrollEnd = () => {
      if (video.playbackRate !== 1) {
        video.playbackRate = 1;
      }
    };

    let isScrolling: number | undefined;
    const scrollListener = () => {
      window.clearTimeout(isScrolling);
      handleScroll();
      isScrolling = window.setTimeout(handleScrollEnd, 150);
    };

    window.addEventListener('scroll', scrollListener, false);

    video.play().catch(error => console.error('Error al reproducir el video:', error));

    return () => {
      window.removeEventListener('scroll', scrollListener);
      if (isScrolling !== undefined) {
        window.clearTimeout(isScrolling);
      }
      video.removeEventListener('play', drawVideoFrame);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width="550" height="309" />
      <video
        ref={videoRef}
        src="/home/carpa.webm"
        style={{ display: 'none' }}
        muted
        playsInline
        loop
      />
    </>
  );
};

export default CanvasVideo;
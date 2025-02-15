"use client"
import { Player } from "@lottiefiles/react-lottie-player"

interface ValueCardProps {
  number: string
  title: string
  description: string
  animation: string
}

export function ValueCard({ number, title, description, animation }: ValueCardProps) {
  return (
    <div className="flex-none w-[90vw] md:w-[85vw] p-6 md:p-12 lg:p-16">
      <div className="relative min-h-[70vh] md:min-h-[80vh] flex flex-col justify-between border-b">
        {/* Header section with number and icon */}
        <div className="relative pt-8 md:pt-12 lg:pt-16 flex justify-between items-start">
          <span className="text-7xl md:text-9xl lg:text-[12rem] font-extralight opacity-80 leading-none">{number}</span>
          <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] lg:w-[200px] lg:h-[200px]">
            <Player
              autoplay
              loop
              src={animation}
              style={{ width: "100%", height: "100%" }}
              className="text-black dark:text-white [&_*]:!stroke-current [&_*]:!fill-current"
            />
          </div>
        </div>

        {/* Content section */}
        <div className="pb-8 md:pb-12 lg:pb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 md:mb-6 lg:mb-8">{title}</h2>
          <p className="text-lg md:text-xl opacity-60 max-w-2xl">{description}</p>
        </div>
      </div>
    </div>
  )
}


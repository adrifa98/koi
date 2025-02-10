const gameIcons: Record<string, JSX.Element> = {
    "league-of-legends": (
      <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" stroke="gold" strokeWidth="4" fill="black"/>
        <text x="18" y="44" fontSize="36" fontWeight="bold" fill="gold" fontFamily="Arial">L</text>
      </svg>
    ),
    valorant: (
      <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="black"/>
        <polygon points="16,48 32,16 48,48" fill="red"/>
      </svg>
    ),
    pokemon: (
      <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="yellow" stroke="black" strokeWidth="4"/>
        <circle cx="32" cy="32" r="10" fill="white" stroke="black" strokeWidth="4"/>
      </svg>
    ),
    "call-of-duty": (
      <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="8" fill="black"/>
        <rect x="12" y="20" width="10" height="24" fill="white"/>
        <rect x="28" y="12" width="8" height="40" fill="white"/>
        <rect x="42" y="20" width="10" height="24" fill="white"/>
      </svg>
    ),
    eafc: (
      <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="8" fill="blue"/>
        <text x="14" y="40" fontSize="24" fontWeight="bold" fill="white" fontFamily="Arial">EA</text>
        <text x="32" y="40" fontSize="24" fontWeight="bold" fill="white" fontFamily="Arial">FC</text>
      </svg>
    ),
    fortnite: (
      <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="8" fill="purple"/>
        <text x="10" y="40" fontSize="28" fontWeight="bold" fill="white" fontFamily="Arial">F</text>
      </svg>
    ),
  };
  
  interface GameIconProps {
    game: string; // Ahora acepta cualquier string
  }
  
  export default function GameIcon({ game }: GameIconProps) {
    return gameIcons[game] || <span className="text-white">?</span>;
  }
  
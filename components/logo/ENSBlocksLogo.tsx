'use client'

interface ENSBlocksLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero'
  className?: string
}

const sizes = { sm: 24, md: 40, lg: 80, hero: 120 }

export default function ENSBlocksLogo({ size = 'md', className = '' }: ENSBlocksLogoProps) {
  const px = sizes[size]
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ensblocks-logo ${className}`}
    >
      <defs>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Top face */}
      <polygon points="60,10 100,32 60,54 20,32" fill="#6C63FF" filter="url(#glow)" />
      {/* Left face */}
      <polygon points="20,32 60,54 60,98 20,76" fill="#4A44CC" />
      {/* Right face */}
      <polygon points="60,54 100,32 100,76 60,98" fill="#00B8D9" />
      <style>{`
        .ensblocks-logo {
          transition: filter 0.3s ease;
        }
        .ensblocks-logo:hover {
          filter: drop-shadow(0 0 8px #6C63FF) drop-shadow(0 0 16px #00D4FF);
          animation: spin-y 2s ease forwards;
        }
        @keyframes spin-y {
          0%   { transform: perspective(300px) rotateY(0deg); }
          100% { transform: perspective(300px) rotateY(360deg); }
        }
      `}</style>
    </svg>
  )
}

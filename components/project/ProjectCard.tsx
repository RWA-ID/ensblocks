import Link from 'next/link'
import { Project } from '@/types'
import DonateButton from '@/components/donate/DonateButton'

interface ProjectCardProps {
  project: Project
}

const CATEGORY_COLORS: Record<string, string> = {
  AI: 'bg-purple-900/40 text-purple-300',
  DeFi: 'bg-blue-900/40 text-blue-300',
  Identity: 'bg-cyan-900/40 text-cyan-300',
  Gaming: 'bg-green-900/40 text-green-300',
  Infrastructure: 'bg-orange-900/40 text-orange-300',
  DAO: 'bg-yellow-900/40 text-yellow-300',
  NFT: 'bg-pink-900/40 text-pink-300',
  Social: 'bg-red-900/40 text-red-300',
  Other: 'bg-gray-800/40 text-gray-300',
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const coverImage = project.ipfs_images?.[0]
  const categoryColor = CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS.Other

  return (
    <div className="group bg-[#1A1A26] border border-[#2A2A3E] rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-[#6C63FF]/60 hover:shadow-[0_0_20px_rgba(108,99,255,0.15)] transition-all duration-200">
      <Link href={`/project?id=${project.id}`}>
        {coverImage ? (
          <img
            src={`https://gateway.pinata.cloud/ipfs/${coverImage}`}
            alt={project.name}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/10 flex items-center justify-center">
            <span className="text-4xl font-bold text-[#6C63FF]/40 font-mono">
              {project.ens_domain.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[#F0F0FF] font-sora font-semibold text-sm leading-tight">
              {project.name}
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${categoryColor}`}>
              {project.category}
            </span>
          </div>
          <p className="text-[10px] text-[#6C63FF] font-mono mb-2">{project.ens_domain}</p>
          <p className="text-xs text-[#8888AA] line-clamp-2 mb-3">{project.tagline}</p>
          <div className="flex items-center justify-between text-xs text-[#8888AA]">
            <span>{project.founder_name}</span>
            <span className="text-[#00D4FF] font-mono">Ξ {Number(project.donation_total).toFixed(3)}</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 space-y-2">
        <DonateButton
          recipientAddress={project.wallet_address}
          projectId={project.id}
          compact
        />
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${project.name} (${project.ens_domain}) on ensblocks.eth!\n\n"${project.tagline}"\n\nhttps://ensblocks.eth.limo/project?id=${project.id}`)}`}
          target="_blank"
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 w-full text-xs py-1.5 rounded-full border border-[#2A2A3E] text-[#8888AA] hover:border-[#F0F0FF] hover:text-[#F0F0FF] transition-colors"
        >
          𝕏 Share on X
        </a>
      </div>
    </div>
  )
}

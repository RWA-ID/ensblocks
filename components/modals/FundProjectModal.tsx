'use client'

import { Project } from '@/types'

interface FundProjectModalProps {
  project: Project
  onClose: () => void
}

export default function FundProjectModal({ project, onClose }: FundProjectModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#F0F0FF] font-sora font-bold text-lg">Fund {project.name}</h2>
          <button onClick={onClose} className="text-[#8888AA] hover:text-[#F0F0FF] text-xl">✕</button>
        </div>
        <p className="text-[#8888AA] text-sm mb-4">
          Interested in funding this project? Reach out directly to the founders:
        </p>
        <div className="space-y-2 text-sm">
          {project.contact_email && (
            <a href={`mailto:${project.contact_email}`} className="flex items-center gap-2 text-[#6C63FF] hover:underline">
              📧 {project.contact_email}
            </a>
          )}
          {project.contact_telegram && (
            <a href={`https://t.me/${project.contact_telegram}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#6C63FF] hover:underline">
              ✈️ @{project.contact_telegram}
            </a>
          )}
          {project.contact_twitter && (
            <a href={`https://twitter.com/${project.contact_twitter}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#6C63FF] hover:underline">
              𝕏 @{project.contact_twitter}
            </a>
          )}
          {project.contact_discord && (
            <p className="flex items-center gap-2 text-[#8888AA]">
              💬 {project.contact_discord}
            </p>
          )}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-yellow-900/20 border border-yellow-700/30">
          <p className="text-xs text-yellow-400/80">
            ⚠ ensblocks.eth does not custody funds. All arrangements are directly between you and the project founders.
          </p>
        </div>
      </div>
    </div>
  )
}

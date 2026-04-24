'use client'

import { BuilderProfile } from '@/types/builder'

interface Props {
  profile: BuilderProfile
  founderName?: string
  onEdit?: () => void
}

const IPFS = 'https://gateway.pinata.cloud/ipfs'

export default function BuilderProfileCard({ profile, founderName, onEdit }: Props) {
  const name = profile.display_name || founderName || 'Builder'
  const avatar = profile.avatar_ipfs ? `${IPFS}/${profile.avatar_ipfs}` : null

  const socials = [
    profile.twitter   && { href: `https://twitter.com/${profile.twitter}`,   label: `𝕏 @${profile.twitter}` },
    profile.github    && { href: `https://github.com/${profile.github}`,      label: `GitHub` },
    profile.telegram  && { href: `https://t.me/${profile.telegram}`,          label: `Telegram` },
    profile.website   && { href: profile.website,                             label: 'Website ↗' },
    profile.discord   && { href: null,                                        label: `Discord: ${profile.discord}` },
  ].filter(Boolean) as { href: string | null; label: string }[]

  return (
    <div className="border-t border-[#2A2A3E] pt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-[#8888AA] uppercase tracking-wider">Builder</p>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-[#6C63FF] hover:underline"
          >
            Edit profile
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-[#2A2A3E] flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#2A2A3E] flex items-center justify-center flex-shrink-0 text-[#6C63FF] font-bold text-sm">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#F0F0FF] truncate">{name}</p>
          {profile.bio && (
            <p className="text-xs text-[#8888AA] line-clamp-2 mt-0.5">{profile.bio}</p>
          )}
        </div>
      </div>

      {socials.length > 0 && (
        <div className="space-y-1.5">
          {socials.map(({ href, label }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center text-xs text-[#8888AA] hover:text-[#F0F0FF] transition-colors"
              >
                {label}
              </a>
            ) : (
              <p key={label} className="text-xs text-[#8888AA]">{label}</p>
            )
          )}
        </div>
      )}
    </div>
  )
}

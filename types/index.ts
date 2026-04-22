export interface Project {
  id: string
  ens_domain: string
  name: string
  tagline: string
  category: string
  short_desc: string
  long_desc: string
  founder_name: string
  wallet_address: string
  contact_email?: string
  contact_telegram?: string
  contact_twitter?: string
  contact_discord?: string
  website_url?: string
  github_url?: string
  demo_url?: string
  ipfs_pitch_deck?: string
  ipfs_images?: string[]
  seeking_funding: boolean
  donation_total: number
  submitter_address: string
  verified_ens_owner: boolean
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  project_id: string
  tx_hash: string
  from_address: string
  to_address: string
  amount_eth: number
  block_number: number
  created_at: string
}

export interface SponsorInquiry {
  name: string
  company: string
  email: string
  tier: string
  message?: string
}

export const CATEGORIES = [
  'AI', 'DeFi', 'Identity', 'Gaming', 'Infrastructure', 'DAO', 'NFT', 'Social', 'Other'
] as const

export type Category = typeof CATEGORIES[number]

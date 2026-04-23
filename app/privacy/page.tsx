export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-sora text-3xl font-extrabold text-[#F0F0FF] mb-2">Privacy Policy</h1>
      <p className="text-[#8888AA] text-sm mb-10">Last updated: April 2026</p>

      <div className="space-y-8 text-[#8888AA] text-sm leading-relaxed">
        <section>
          <h2 className="text-[#F0F0FF] font-semibold mb-2">1. What We Collect</h2>
          <p>When you submit a project, we collect the information you provide: project name, ENS domain, tagline, category, founder name, wallet address, X handle, website URL, and any uploaded images. When you connect your wallet, we read your public wallet address. We do not collect passwords, email addresses (except via sponsor inquiries), or private keys.</p>
        </section>

        <section>
          <h2 className="text-[#F0F0FF] font-semibold mb-2">2. How We Use It</h2>
          <p>Project data is stored in our database and displayed publicly on ensblocks.eth. Wallet addresses are used solely to attribute projects to their founders and to receive direct on-chain donations. Sponsor inquiry emails are used only to respond to your inquiry.</p>
        </section>

        <section>
          <h2 className="text-[#F0F0FF] font-semibold mb-2">3. On-Chain Data</h2>
          <p>Donations are direct on-chain transfers. Transaction hashes and wallet addresses are publicly visible on the Ethereum blockchain. We have no control over that data.</p>
        </section>

        <section>
          <h2 className="text-[#F0F0FF] font-semibold mb-2">4. IPFS & Storage</h2>
          <p>Project images are uploaded to IPFS via Pinata and are publicly accessible by their content hash. The static frontend is hosted on IPFS and mirrored via the ENS content hash. We use Supabase for database storage.</p>
        </section>

        <section>
          <h2 className="text-[#F0F0FF] font-semibold mb-2">5. Third Parties</h2>
          <p>We use Supabase (database), Pinata (IPFS pinning), and Vercel (API hosting). These services have their own privacy policies. We do not sell your data to any third party.</p>
        </section>

        <section>
          <h2 className="text-[#F0F0FF] font-semibold mb-2">6. Contact</h2>
          <p>For privacy-related questions, reach us via the Sponsor inquiry form or on X at @ensblocks.</p>
        </section>
      </div>
    </div>
  )
}

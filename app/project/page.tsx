import dynamic from 'next/dynamic'

const ProjectClient = dynamic(() => import('./ProjectClient'), {
  ssr: false,
  loading: () => (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="h-10 w-64 bg-[#1A1A26] rounded-xl animate-pulse mb-4" />
      <div className="h-4 w-96 bg-[#1A1A26] rounded animate-pulse" />
    </div>
  ),
})

export default function ProjectPage() {
  return <ProjectClient />
}

import { Project } from '@/types'
import ProjectCard from './ProjectCard'

interface ProjectGridProps {
  projects: Project[]
  emptyMessage?: string
}

export default function ProjectGrid({ projects, emptyMessage = 'No projects found. Be the first to submit!' }: ProjectGridProps) {
  if (!projects.length) {
    return (
      <div className="text-center py-20 text-[#8888AA]">
        <p className="text-lg mb-4">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map(p => <ProjectCard key={p.id} project={p} />)}
    </div>
  )
}

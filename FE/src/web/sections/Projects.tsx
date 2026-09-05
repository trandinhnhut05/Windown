import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, MapPin, Calendar, ArrowRight, Eye, Sparkles } from 'lucide-react'
import { PROJECTS_LIST } from '../data/mockData'
import type { Project } from '../types'
import useIntersection from '../hooks/useIntersection'

interface ProjectsProps {
  onSelectProject?: (project: Project) => void
}

export default function Projects({ onSelectProject }: ProjectsProps) {
  const [selectedModalProject, setSelectedModalProject] = useState<Project | null>(null)
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1, once: true })

  const handleProjectClick = (proj: Project) => {
    if (onSelectProject) {
      onSelectProject(proj)
    } else {
      setSelectedModalProject(proj)
    }
  }

  return (
    <section
      ref={ref}
      id="du-an-tieu-bieu"
      aria-labelledby="projects-heading"
      className="py-20 lg:py-28 bg-[#1E2124] border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`fade-up-element ${isVisible ? 'is-visible' : ''}`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171A1D] border border-[#F28C28]/40 text-[#F28C28] text-xs font-mono font-bold uppercase tracking-wider mb-4">
                <Building2 className="w-3.5 h-3.5" />
                <span>HỒ SƠ CÔNG TRÌNH THỰC TẾ</span>
              </div>
              <h2
                id="projects-heading"
                className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-wide uppercase leading-tight"
              >
                DỰ ÁN TIÊU BIỂU ĐÃ HOÀN THIỆN <br />
                <span className="text-[#F28C28]">BÌNH DƯƠNG & TP. HỒ CHÍ MINH</span>
              </h2>
            </div>

            <Link
              to="/du-an"
              className="btn-outline self-start md:self-auto text-xs sm:text-sm"
            >
              <span>XEM TẤT CẢ DỰ ÁN</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS_LIST.map((project) => (
              <article
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="industrial-card group overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container with Hover Overlay */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-black">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E2124] via-black/20 to-transparent" />

                  {/* Location & Year Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="font-mono text-xs bg-[#171A1D]/90 text-white border border-white/10 px-2.5 py-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F28C28]" />
                      <span>{project.location}</span>
                    </span>
                    <span className="font-mono text-xs bg-[#F28C28] text-coal font-bold px-2.5 py-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{project.year}</span>
                    </span>
                  </div>

                  {/* Quick Inspect Hover Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <span className="px-4 py-2 bg-[#F28C28] text-coal font-display font-bold text-sm uppercase flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-4 h-4" />
                      <span>Xem Hình Ảnh Công Trình</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[#F28C28] uppercase font-bold tracking-wider">
                      {project.categoryName}
                    </span>
                    <span className="font-mono text-xs text-gray-400">
                      {project.scale}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl text-white group-hover:text-[#F28C28] transition-colors">
                    {project.title}
                  </h3>

                  <p className="font-body text-sm text-gray-300 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Materials list */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {project.materials.map((mat, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono bg-[#171A1D] text-gray-300 px-2.5 py-1 border border-white/5"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Detail Project */}
      {selectedModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#1E2124] border border-[#F28C28]/40 max-w-3xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedModalProject(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center bg-[#171A1D]"
            >
              ✕
            </button>

            <div className="space-y-4">
              <span className="font-mono text-xs text-[#F28C28] font-bold uppercase">
                {selectedModalProject.categoryName} · {selectedModalProject.year}
              </span>
              <h3 className="font-display font-extrabold text-3xl text-white">
                {selectedModalProject.title}
              </h3>
              <p className="font-mono text-xs text-gray-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>{selectedModalProject.location}</span>
                <span className="mx-2">•</span>
                <span>{selectedModalProject.scale}</span>
                <span className="mx-2">•</span>
                <span className="text-[#F28C28]">{selectedModalProject.duration}</span>
              </p>
            </div>

            {/* Gallery Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedModalProject.gallery.map((imgUrl, idx) => (
                <div key={idx} className="h-48 sm:h-56 bg-black overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={`${selectedModalProject.title} ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>

            <p className="font-body text-sm text-gray-300 leading-relaxed">
              {selectedModalProject.description}
            </p>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="font-mono text-xs text-gray-400">
                Cam kết chất lượng bởi Xưởng Mạnh Nghĩa Window 2
              </span>
              <a
                href="#bao-gia"
                onClick={() => setSelectedModalProject(null)}
                className="btn-accent text-xs py-2 px-4"
              >
                BÁO GIÁ CÔNG TRÌNH TƯƠNG TỰ
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

import { MapPin, ArrowUpRight, Building2, Calendar, Clock } from 'lucide-react'
import { PROJECTS_DATA } from '../data/portalData'
import type { ProjectItem } from '../data/portalData'

interface Props {
  onSelectProject: (project: ProjectItem) => void
  onOpenQuote: () => void
}

export default function ProjectsSection({ onSelectProject, onOpenQuote }: Props) {
  return (
    <section id="du-an" className="portal-section" style={{ background: '#171A1D' }}>
      <div className="portal-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 50,
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <div className="portal-badge">
              <Building2 size={14} />
              <span>Hồ Sơ Năng Lực & Dự Án Thực Tế</span>
            </div>
            <h2 className="portal-section-title">
              CÔNG TRÌNH TIÊU BIỂU ĐÃ HOÀN THIỆN
            </h2>
            <p className="portal-section-desc">
              Hình ảnh thực tế các dự án biệt thự, tòa nhà văn phòng và nhà xưởng do đội ngũ trực tiếp sản xuất & thi công trọn gói.
            </p>
          </div>

          <button onClick={onOpenQuote} className="btn-portal-primary">
            <span>Tư Vấn Thiết Kế Công Trình</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Portfolio Grid */}
        <div className="portal-grid-3">
          {PROJECTS_DATA.map((proj) => (
            <div
              key={proj.id}
              className="portal-card"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={() => onSelectProject(proj)}
            >
              {/* Image with Tag */}
              <div style={{ position: 'relative', height: 270, overflow: 'hidden' }}>
                <img
                  src={proj.image}
                  alt={proj.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  className="portal-card-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(23, 26, 29, 0.95) 0%, rgba(23, 26, 29, 0.2) 60%, transparent 100%)',
                  }}
                />

                {/* Top Category Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    background: 'rgba(23, 26, 29, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(242, 140, 40, 0.4)',
                    color: 'var(--portal-orange)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 6,
                    textTransform: 'uppercase',
                  }}
                >
                  {proj.category}
                </div>

                {/* Bottom specs overlay on image */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    left: 14,
                    right: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} color="var(--portal-orange)" />
                    <span>{proj.location.split(',')[0]}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--portal-orange)' }}>
                    <Clock size={13} />
                    <span>{proj.duration}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginBottom: 10, lineHeight: 1.3 }}>
                  {proj.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--portal-text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                  {proj.description}
                </p>

                {/* Materials Tags */}
                <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {proj.materials.map((mat, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--portal-text-secondary)',
                      }}
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

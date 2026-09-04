import { X, MapPin, Calendar, Layers, Clock, ArrowRight } from 'lucide-react'
import type { ProjectItem } from '../data/portalData'

interface Props {
  project: ProjectItem | null
  onClose: () => void
  onOpenQuote: () => void
}

export default function ProjectDetailModal({ project, onClose, onOpenQuote }: Props) {
  if (!project) return null

  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 1100,
        background: 'rgba(15, 18, 22, 0.85)',
        backdropFilter: 'blur(12px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal modal-lg"
        style={{
          maxWidth: 900,
          background: '#1A1E23',
          border: '1px solid rgba(242, 140, 40, 0.3)',
          borderRadius: 20,
          color: '#F5F5F5',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div style={{ position: 'relative' }}>
          <button
            onClick={onClose}
            className="btn-close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ height: 320, overflow: 'hidden' }}>
            <img
              src={project.image}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--portal-orange)',
                background: 'rgba(242, 140, 40, 0.12)',
                padding: '3px 10px',
                borderRadius: 100,
                border: '1px solid var(--portal-border-hover)',
              }}
            >
              {project.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--portal-text-muted)' }}>
              <MapPin size={14} color="var(--portal-orange)" />
              <span>{project.location}</span>
            </div>
          </div>

          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', marginBottom: 16 }}>
            {project.title}
          </h3>

          <p style={{ fontSize: 14.5, color: 'var(--portal-text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
            {project.description}
          </p>

          {/* Project specs grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--portal-border)',
              borderRadius: 12,
              padding: '16px',
              marginBottom: 24,
            }}
            className="portal-project-spec-grid"
          >
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--portal-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Layers size={13} />
                <span>QUY MÔ</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>
                {project.scale}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11.5, color: 'var(--portal-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={13} />
                <span>TIẾN ĐỘ</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--portal-orange)', marginTop: 4 }}>
                {project.duration}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11.5, color: 'var(--portal-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={13} />
                <span>NĂM THI CÔNG</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>
                {project.year}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11.5, color: 'var(--portal-text-muted)' }}>
                VẬT LIỆU CHỦ ĐẠO
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginTop: 4 }}>
                {project.materials.join(', ')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button onClick={onClose} className="btn-portal-secondary">
              Đóng
            </button>
            <button
              onClick={() => {
                onClose()
                onOpenQuote()
              }}
              className="btn-portal-primary"
            >
              <span>Yêu Cầu Thi Công Tương Tự</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .portal-project-spec-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

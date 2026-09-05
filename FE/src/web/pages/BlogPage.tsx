import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileStickyBar from '../components/MobileStickyBar'
import { BLOG_POSTS } from '../data/mockData'
import type { BlogPost } from '../types'
import { applySeo, getBreadcrumbSchema } from '../utils/seo'
import { Calendar, Clock, User, ArrowRight, BookOpen, HelpCircle } from 'lucide-react'

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    applySeo({
      title: 'Cẩm Nang Kỹ Thuật Cơ Khí & Báo Giá Nhôm Kính 2026 — Mạnh Nghĩa Window 2',
      description: 'Tổng hợp kinh nghiệm chọn cổng sắt CNC, phân biệt inox 304, báo giá cửa nhôm Xingfa chính hãng và tiêu chuẩn an toàn cho công trình xây dựng.',
      canonical: window.location.origin + '/tin-tuc',
      schemaJson: getBreadcrumbSchema([
        { name: 'Trang chủ', url: window.location.origin + '/' },
        { name: 'Tin tức & Cẩm nang', url: window.location.origin + '/tin-tuc' },
      ]),
    })
  }, [])

  const faqs = [
    {
      q: 'Xưởng Mạnh Nghĩa Window 2 có nhận khảo sát và đo đạc tận nơi không?',
      a: 'Có, kỹ sư của chúng tôi sẽ mang thước laser đến tận công trình tại Bình Dương, TP.HCM, Đồng Nai để khảo sát và tư vấn hoàn toàn miễn phí 24/7.',
    },
    {
      q: 'Thời gian gia công một bộ cổng sắt CNC hoặc hệ cửa nhôm mất bao lâu?',
      a: 'Tùy quy mô và khối lượng, thông thường một bộ cổng sắt CNC mất từ 5 - 7 ngày hoàn thiện; hệ cửa nhôm Xingfa nhà phố từ 7 - 12 ngày. Chúng tôi luôn cam kết đúng tiến độ trong hợp đồng.',
    },
    {
      q: 'Chính sách bảo hành tại xưởng như thế nào?',
      a: 'Chúng tôi bảo hành kết cấu thép và mối hàn trọn đời, sơn tĩnh điện từ 3 - 5 năm, thanh nhôm Xingfa 10 năm và phụ kiện kim khí chính hãng từ 2 - 5 năm.',
    },
  ]

  return (
    <div className="portal-root">
      <Header />
      <main className="pt-24 pb-16">
        {/* Banner */}
        <section className="bg-[#171A1D] border-b border-white/10 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#F28C28] uppercase font-bold tracking-wider">
              KIẾN THỨC & KINH NGHIỆM XÂY DỰNG
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-2 uppercase">
              CẨM NANG CƠ KHÍ & BÁO GIÁ
            </h1>
            <p className="font-body text-gray-300 text-base max-w-3xl mt-3">
              Những bài viết chuyên sâu từ kỹ sư Mạnh Nghĩa Window 2 giúp chủ nhà và nhà thầu nắm rõ tiêu chuẩn kỹ thuật, phân biệt vật tư thật giả và tối ưu chi phí thi công.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="industrial-card group overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-black">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 left-3 font-mono text-[10px] text-[#171A1D] bg-[#F28C28] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#F28C28]" />
                        <span>{post.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-xl text-white group-hover:text-[#F28C28] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h2>

                    <p className="font-body text-sm text-gray-300 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-display font-bold uppercase text-[#F28C28]">
                    <span>Đọc chi tiết bài viết</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-[#1E2124] border-t border-b border-white/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="font-mono text-xs text-[#F28C28] font-bold uppercase tracking-wider">
                HỎI ĐÁP PHỔ BIẾN (FAQ)
              </span>
              <h2 className="font-display font-extrabold text-3xl text-white uppercase">
                CÂU HỎI THƯỜNG GẶP VỀ GIA CÔNG CƠ KHÍ
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-6 bg-[#171A1D] border border-white/10 space-y-2">
                  <h3 className="font-display font-bold text-lg text-white flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="font-body text-sm text-gray-300 pl-7 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-[#1E2124] border border-[#F28C28]/40 max-w-3xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center bg-[#171A1D]"
              >
                ✕
              </button>

              <div className="space-y-3">
                <span className="font-mono text-xs text-[#F28C28] font-bold uppercase tracking-wider">
                  {selectedPost.category}
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#F28C28]" />
                    <span>{selectedPost.author}</span>
                  </span>
                  <span>{selectedPost.date}</span>
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>

              <div className="h-64 sm:h-80 overflow-hidden bg-black">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="font-body text-sm text-gray-200 leading-relaxed whitespace-pre-line space-y-4">
                {selectedPost.content}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="font-mono text-xs text-gray-400">
                  Cần giải đáp kỹ thuật? Gọi ngay: <strong>0704 682 789</strong>
                </span>
                <a
                  href="/#bao-gia"
                  onClick={() => setSelectedPost(null)}
                  className="btn-accent text-xs py-2.5 px-5"
                >
                  NHẬN BÁO GIÁ TRỰC TIẾP
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  )
}

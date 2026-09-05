import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Package,
  FolderKanban,
  FileCheck,
  Settings,
  Menu,
  X,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Wrench,
  Search,
  Filter
} from 'lucide-react'
import { INITIAL_QUOTES, PRODUCTS_LIST, PROJECTS_LIST, BLOG_POSTS, BUSINESS_INFO } from '../data/mockData'
import type { QuoteRequest, QuoteStatus, Product, Project, BlogPost } from '../types'

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'quotes' | 'products' | 'projects' | 'blog' | 'settings'>('quotes')

  // Quotes state (reads from localStorage or initial mock)
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    try {
      const saved = localStorage.getItem('manhnghia_quotes')
      return saved ? JSON.parse(saved) : INITIAL_QUOTES
    } catch {
      return INITIAL_QUOTES
    }
  })

  const [quoteFilter, setQuoteFilter] = useState<string>('all')
  const [quoteSearch, setQuoteSearch] = useState<string>('')
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState<QuoteRequest | null>(null)

  // Products and projects state
  const [products, setProducts] = useState<Product[]>(PRODUCTS_LIST)
  const [projects, setProjects] = useState<Project[]>(PROJECTS_LIST)
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS)

  // Save quotes to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('manhnghia_quotes', JSON.stringify(quotes))
    } catch (err) {
      console.error(err)
    }
  }, [quotes])

  const handleUpdateQuoteStatus = (id: string, newStatus: QuoteStatus) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    )
    if (selectedQuoteDetail && selectedQuoteDetail.id === id) {
      setSelectedQuoteDetail({ ...selectedQuoteDetail, status: newStatus })
    }
  }

  const handleDeleteQuote = (id: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa yêu cầu báo giá ${id}?`)) {
      setQuotes((prev) => prev.filter((q) => q.id !== id))
      if (selectedQuoteDetail?.id === id) setSelectedQuoteDetail(null)
    }
  }

  // Filtered quotes
  const filteredQuotes = quotes.filter((q) => {
    const matchesFilter = quoteFilter === 'all' || q.status === quoteFilter
    const matchesSearch =
      q.name.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.phone.includes(quoteSearch) ||
      q.content.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.id.toLowerCase().includes(quoteSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Stat calculations
  const totalQuotes = quotes.length
  const newQuotesCount = quotes.filter((q) => q.status === 'new').length
  const processingQuotesCount = quotes.filter((q) => q.status === 'processing').length
  const signedQuotesCount = quotes.filter((q) => q.status === 'signed').length

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold uppercase rounded-sm">
            Mới nhận
          </span>
        )
      case 'processing':
        return (
          <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-mono font-bold uppercase rounded-sm">
            Đang xử lý
          </span>
        )
      case 'quoted':
        return (
          <span className="px-2.5 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs font-mono font-bold uppercase rounded-sm">
            Đã báo giá
          </span>
        )
      case 'signed':
        return (
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold uppercase rounded-sm">
            Đã ký HĐ
          </span>
        )
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold uppercase rounded-sm">
            Đã hủy
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0F11] text-gray-200 flex flex-col font-body">
      {/* Top Bar */}
      <header className="bg-[#171A1D] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-gray-400 hover:text-white bg-[#1E2124] border border-white/10 rounded-sm"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={BUSINESS_INFO.logoUrl}
              alt="Logo"
              style={{ width: 36, height: 36, objectFit: 'contain' }}
              className="bg-white rounded-sm p-0.5 border border-[#F28C28]"
            />
            <div>
              <h1 className="font-display font-bold text-white text-base leading-none">
                MẠNH NGHĨA WINDOW 2 — QUẢN TRỊ WEBSITE
              </h1>
              <span className="font-mono text-[10px] text-[#F28C28] uppercase font-semibold">
                Hệ Thống Tiếp Nhận Báo Giá & Nội Dung Website
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick link to Internal ERP Management */}
          <Link
            to="/admin/projects"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2124] hover:bg-white/10 text-xs font-mono text-gray-300 border border-white/10 rounded-sm transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>Quản Lý Xưởng ERP (Vật tư, Chấm công)</span>
          </Link>

          <Link
            to="/"
            target="_blank"
            className="btn-accent text-xs py-1.5 px-3 flex items-center gap-1"
          >
            <span>Xem Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Body with Sidebar and Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-[#171A1D] border-r border-white/10 transition-all duration-300 flex flex-col justify-between ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-display text-sm uppercase font-bold tracking-wide transition-colors ${
                activeTab === 'quotes'
                  ? 'bg-[#F28C28] text-coal'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Yêu Cầu Báo Giá ({newQuotesCount})</span>}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-display text-sm uppercase font-bold tracking-wide transition-colors ${
                activeTab === 'products'
                  ? 'bg-[#F28C28] text-coal'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Quản Lý Sản Phẩm</span>}
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-display text-sm uppercase font-bold tracking-wide transition-colors ${
                activeTab === 'projects'
                  ? 'bg-[#F28C28] text-coal'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FolderKanban className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Quản Lý Dự Án</span>}
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-display text-sm uppercase font-bold tracking-wide transition-colors ${
                activeTab === 'blog'
                  ? 'bg-[#F28C28] text-coal'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Bài Viết SEO</span>}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-display text-sm uppercase font-bold tracking-wide transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#F28C28] text-coal'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Cài Đặt Doanh Nghiệp</span>}
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="p-4 border-t border-white/10 text-xs font-mono text-gray-500">
              <p>Hotline: 0704 682 789</p>
              <p className="mt-1">Phiên bản: 2.0 (Tailwind v4)</p>
            </div>
          )}
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Stat Cards (S4-02 & S4-11) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#171A1D] border border-white/10 p-5 rounded-sm">
              <span className="font-mono text-xs uppercase text-gray-400">Tổng Yêu Cầu Báo Giá</span>
              <div className="font-display font-extrabold text-3xl text-white mt-1">
                {totalQuotes}
              </div>
              <p className="text-[11px] text-gray-400 font-mono mt-1">Từ khách hàng gửi trực tiếp</p>
            </div>

            <div className="bg-[#171A1D] border border-amber-500/40 p-5 rounded-sm">
              <span className="font-mono text-xs uppercase text-amber-400 font-bold">Cần Xử Lý Gấp (Mới)</span>
              <div className="font-display font-extrabold text-3xl text-amber-400 mt-1">
                {newQuotesCount}
              </div>
              <p className="text-[11px] text-gray-400 font-mono mt-1">Chưa liên hệ khách</p>
            </div>

            <div className="bg-[#171A1D] border border-blue-500/40 p-5 rounded-sm">
              <span className="font-mono text-xs uppercase text-blue-400 font-bold">Đang Khảo Sát / Báo Giá</span>
              <div className="font-display font-extrabold text-3xl text-blue-400 mt-1">
                {processingQuotesCount}
              </div>
              <p className="text-[11px] text-gray-400 font-mono mt-1">Đang lên bản vẽ 2D/3D</p>
            </div>

            <div className="bg-[#171A1D] border border-emerald-500/40 p-5 rounded-sm">
              <span className="font-mono text-xs uppercase text-emerald-400 font-bold">Đã Ký Hợp Đồng</span>
              <div className="font-display font-extrabold text-3xl text-emerald-400 mt-1">
                {signedQuotesCount}
              </div>
              <p className="text-[11px] text-gray-400 font-mono mt-1">Đang gia công tại xưởng</p>
            </div>
          </div>

          {/* TAB 1: QUẢN LÝ YÊU CẦU BÁO GIÁ */}
          {activeTab === 'quotes' && (
            <div className="bg-[#171A1D] border border-white/10 p-5 rounded-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-white uppercase">
                    DANH SÁCH YÊU CẦU BÁO GIÁ
                  </h2>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Quản lý khách hàng tiềm năng gửi form từ website
                  </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm tên, số ĐT, mã..."
                      value={quoteSearch}
                      onChange={(e) => setQuoteSearch(e.target.value)}
                      className="bg-[#1E2124] border border-white/10 text-xs px-3 py-2 pl-9 rounded-sm text-white focus:outline-none focus:border-[#F28C28]"
                    />
                  </div>

                  <select
                    value={quoteFilter}
                    onChange={(e) => setQuoteFilter(e.target.value)}
                    className="bg-[#1E2124] border border-white/10 text-xs px-3 py-2 rounded-sm text-white focus:outline-none focus:border-[#F28C28]"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="new">Mới nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="quoted">Đã báo giá</option>
                    <option value="signed">Đã ký HĐ</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#1E2124] font-mono text-gray-400 uppercase text-[11px]">
                      <th className="p-3">Mã BG</th>
                      <th className="p-3">Khách Hàng</th>
                      <th className="p-3">Số Điện Thoại</th>
                      <th className="p-3">Hạng Mục</th>
                      <th className="p-3">Nội Dung Yêu Cầu</th>
                      <th className="p-3">File</th>
                      <th className="p-3">Trạng Thái</th>
                      <th className="p-3">Thời Gian</th>
                      <th className="p-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredQuotes.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-gray-500 font-mono">
                          Không tìm thấy yêu cầu báo giá nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredQuotes.map((q) => (
                        <tr key={q.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono font-bold text-[#F28C28]">{q.id}</td>
                          <td className="p-3 font-semibold text-white">{q.name}</td>
                          <td className="p-3 font-mono text-gray-300">
                            <a href={`tel:${q.phone}`} className="hover:text-[#F28C28]">
                              {q.phone}
                            </a>
                          </td>
                          <td className="p-3">
                            <span className="font-mono text-[10px] bg-[#1E2124] px-2 py-0.5 border border-white/5">
                              {q.category.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 max-w-xs truncate text-gray-300" title={q.content}>
                            {q.content}
                          </td>
                          <td className="p-3 font-mono text-[11px]">
                            {q.fileName ? (
                              <span className="text-[#F28C28] truncate max-w-[120px] block" title={q.fileName}>
                                📎 {q.fileName}
                              </span>
                            ) : (
                              <span className="text-gray-600">—</span>
                            )}
                          </td>
                          <td className="p-3">{getStatusBadge(q.status)}</td>
                          <td className="p-3 font-mono text-gray-400 whitespace-nowrap">{q.createdAt}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={q.status}
                                onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value as QuoteStatus)}
                                className="bg-[#1E2124] text-[11px] font-mono border border-white/10 text-white px-2 py-1 rounded-sm"
                              >
                                <option value="new">Mới</option>
                                <option value="processing">Đang xử lý</option>
                                <option value="quoted">Đã báo giá</option>
                                <option value="signed">Đã ký HĐ</option>
                                <option value="cancelled">Hủy</option>
                              </select>

                              <button
                                onClick={() => handleDeleteQuote(q.id)}
                                className="p-1 text-gray-500 hover:text-red-400"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: QUẢN LÝ SẢN PHẨM */}
          {activeTab === 'products' && (
            <div className="bg-[#171A1D] border border-white/10 p-5 rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-white uppercase">
                    DANH SÁCH SẢN PHẨM TRÊN WEBSITE ({products.length})
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    Hiển thị trên trang chủ và trang Sản Phẩm
                  </p>
                </div>
                <button
                  onClick={() => alert('Chức năng thêm sản phẩm: Điền thông tin vào hệ thống')}
                  className="btn-accent text-xs py-2 px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Sản Phẩm Mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-[#1E2124] border border-white/10 p-4 rounded-sm flex gap-3">
                    <img src={p.image} alt={p.title} className="w-20 h-20 object-cover rounded-sm shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="font-mono text-[10px] text-[#F28C28] uppercase">{p.categoryName}</span>
                      <h4 className="font-display font-bold text-sm text-white truncate">{p.title}</h4>
                      <p className="font-mono text-xs text-[#F28C28]">{p.priceEstimate || 'Liên hệ xưởng'}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{p.material}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: QUẢN LÝ DỰ ÁN */}
          {activeTab === 'projects' && (
            <div className="bg-[#171A1D] border border-white/10 p-5 rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-white uppercase">
                    HỒ SƠ CÔNG TRÌNH DỰ ÁN ({projects.length})
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    Các dự án đã thi công thực tế
                  </p>
                </div>
                <button
                  onClick={() => alert('Chức năng thêm dự án')}
                  className="btn-accent text-xs py-2 px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Dự Án Mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-[#1E2124] border border-white/10 p-4 rounded-sm flex gap-4">
                    <img src={proj.image} alt={proj.title} className="w-28 h-24 object-cover rounded-sm shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="font-mono text-xs text-[#F28C28]">{proj.location} • {proj.year}</span>
                      <h4 className="font-display font-bold text-base text-white truncate">{proj.title}</h4>
                      <p className="text-xs text-gray-300 font-mono">{proj.scale}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{proj.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BÀI VIẾT SEO */}
          {activeTab === 'blog' && (
            <div className="bg-[#171A1D] border border-white/10 p-5 rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-white uppercase">
                    BÀI VIẾT KỸ THUẬT & SEO GOOGLE ({posts.length})
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    Từ khóa: gia công sắt, inox 304, cửa nhôm Xingfa Bình Dương
                  </p>
                </div>
                <button
                  onClick={() => alert('Chức năng thêm bài viết')}
                  className="btn-accent text-xs py-2 px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Soạn Bài Viết Mới</span>
                </button>
              </div>

              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.id} className="bg-[#1E2124] border border-white/10 p-4 rounded-sm flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-[#F28C28] uppercase">{post.category}</span>
                      <h4 className="font-display font-bold text-base text-white">{post.title}</h4>
                      <p className="font-mono text-xs text-gray-400">{post.date} • {post.readTime} • Tác giả: {post.author}</p>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ĐÃ XUẤT BẢN
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CÀI ĐẶT DOANH NGHIỆP */}
          {activeTab === 'settings' && (
            <div className="bg-[#171A1D] border border-white/10 p-5 rounded-sm space-y-6 max-w-3xl">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-white uppercase">
                  CÀI ĐẶT DOANH NGHIỆP & THÔNG TIN LIÊN HỆ
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  Thông tin hiển thị trên toàn bộ Website và Footer
                </p>
              </div>

              <div className="space-y-4 text-xs font-body">
                <div>
                  <label className="block font-mono text-gray-400 mb-1">TÊN DOANH NGHIỆP:</label>
                  <input
                    type="text"
                    defaultValue={BUSINESS_INFO.name}
                    className="w-full bg-[#1E2124] border border-white/10 text-white p-2.5 rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-gray-400 mb-1">HOTLINE 1 (XƯỞNG):</label>
                    <input
                      type="text"
                      defaultValue={BUSINESS_INFO.hotlines[0]}
                      className="w-full bg-[#1E2124] border border-white/10 text-white p-2.5 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-gray-400 mb-1">HOTLINE 2 (QUẢN LÝ):</label>
                    <input
                      type="text"
                      defaultValue={BUSINESS_INFO.hotlines[1]}
                      className="w-full bg-[#1E2124] border border-white/10 text-white p-2.5 rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-gray-400 mb-1">ĐỊA CHỈ XƯỞNG CHÍNH:</label>
                  <input
                    type="text"
                    defaultValue={BUSINESS_INFO.address}
                    className="w-full bg-[#1E2124] border border-white/10 text-white p-2.5 rounded-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono text-gray-400 mb-1">ĐỊA CHỈ TP. HỒ CHÍ MINH:</label>
                  <input
                    type="text"
                    defaultValue={BUSINESS_INFO.addressHcm}
                    className="w-full bg-[#1E2124] border border-white/10 text-white p-2.5 rounded-sm"
                  />
                </div>

                <div>
                  <button
                    onClick={() => alert('Đã lưu thông tin cấu hình!')}
                    className="btn-accent text-xs py-2 px-5"
                  >
                    LƯU THAY ĐỔI CẤU HÌNH
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

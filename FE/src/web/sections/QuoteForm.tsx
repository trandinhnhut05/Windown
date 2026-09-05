import { useState, useRef } from 'react'
import { Phone, UploadCloud, CheckCircle2, AlertCircle, FileText, Send, Sparkles, Clock, Shield } from 'lucide-react'
import { BUSINESS_INFO, INITIAL_QUOTES } from '../data/mockData'
import type { QuoteRequest } from '../types'
import useIntersection from '../hooks/useIntersection'

export default function QuoteForm() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1, once: true })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'sat',
    dimensions: '',
    content: '',
  })

  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [ticketId, setTicketId] = useState('')

  // Validation function as per Sprint 3 & PROMPT-TEST-001
  const validate = () => {
    const newErrors: Record<string, string> = {}

    // Name check
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ và tên phải có ít nhất 2 ký tự'
    }

    // Phone check (VN phone format: starts with 03, 05, 07, 08, 09 and 10 digits)
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/
    const cleanPhone = formData.phone.trim().replace(/[\s.-]/g, '')
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09)'
    }

    // Email check (optional, but validate format if present)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Địa chỉ email không đúng định dạng'
      }
    }

    // Category check
    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn hạng mục gia công'
    }

    // Content check
    if (!formData.content.trim()) {
      newErrors.content = 'Vui lòng mô tả yêu cầu hoặc địa chỉ công trình'
    } else if (formData.content.trim().length < 5) {
      newErrors.content = 'Yêu cầu phải có ít nhất 5 ký tự để xưởng tư vấn chính xác'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 20 * 1024 * 1024) {
        alert('Dung lượng file tối đa là 20MB')
        return
      }
      setAttachedFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size > 20 * 1024 * 1024) {
        alert('Dung lượng file tối đa là 20MB')
        return
      }
      setAttachedFile(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // Simulate sending to backend API and saving to localStorage
    setTimeout(() => {
      const generatedId = `BG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      setTicketId(generatedId)

      const newQuote: QuoteRequest = {
        id: generatedId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        category: formData.category,
        dimensions: formData.dimensions.trim() || undefined,
        content: formData.content.trim(),
        fileName: attachedFile ? attachedFile.name : undefined,
        fileSize: attachedFile ? `${(attachedFile.size / (1024 * 1024)).toFixed(1)} MB` : undefined,
        status: 'new',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        notes: 'Gửi từ website khách hàng',
      }

      // Save to localStorage for Admin Dashboard
      try {
        const storedQuotesStr = localStorage.getItem('manhnghia_quotes')
        const currentQuotes = storedQuotesStr ? JSON.parse(storedQuotesStr) : INITIAL_QUOTES
        const updated = [newQuote, ...currentQuotes]
        localStorage.setItem('manhnghia_quotes', JSON.stringify(updated))
      } catch (err) {
        console.error('Error saving quote locally:', err)
      }

      setIsSubmitting(false)
      setIsSuccess(true)
    }, 800)
  }

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      category: 'sat',
      dimensions: '',
      content: '',
    })
    setAttachedFile(null)
    setErrors({})
    setIsSuccess(false)
  }

  return (
    <section
      ref={ref}
      id="bao-gia"
      aria-labelledby="quote-heading"
      className="py-20 lg:py-28 bg-[#171A1D] border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 fade-up-element ${isVisible ? 'is-visible' : ''}`}>
          {/* Cột Trái: Thông tin hỗ trợ (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E2124] border border-[#F28C28]/40 text-[#F28C28] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BÁO GIÁ NHANH TRONG 30 PHÚT</span>
            </div>

            <h2
              id="quote-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-wide uppercase leading-tight"
            >
              GỬI YÊU CẦU BÁO GIÁ <br />
              <span className="text-[#F28C28]">TRỰC TIẾP TẬN XƯỞNG</span>
            </h2>

            <p className="font-body text-gray-300 text-sm sm:text-base leading-relaxed">
              Quý khách đang cần làm cửa cổng sắt mỹ thuật, lan can ban công Inox 304, hệ cửa nhôm kính Xingfa hay giàn mái kính biệt thự? Điền thông tin dưới đây hoặc liên hệ trực tiếp kỹ sư phụ trách xưởng:
            </p>

            {/* Hotline Box */}
            <div className="p-5 bg-[#1E2124] border-2 border-[#F28C28]/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F28C28] text-[#171A1D] flex items-center justify-center rounded-sm font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-mono text-xs text-gray-400 uppercase">Hotline & Zalo Kỹ Thuật 24/7</span>
                  <div className="font-mono font-black text-xl text-white">
                    <a href="tel:0704682789" className="hover:text-[#F28C28] transition-colors">
                      0704 682 789
                    </a>
                    {' — '}
                    <a href="tel:0899082777" className="hover:text-[#F28C28] transition-colors">
                      0899 082 777
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Commitments List */}
            <div className="space-y-3 font-body text-xs sm:text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                <span>Kỹ sư đo đạc laser tận nơi miễn phí tại Bình Dương & TP.HCM</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                <span>Bóc tách bản vẽ kỹ thuật chi tiết gửi báo giá trong 30 phút</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                <span>Hợp đồng minh bạch, cam kết không phát sinh bất kỳ chi phí nào</span>
              </div>
            </div>
          </div>

          {/* Cột Phải: Form 7 fields (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#1E2124] border border-white/10 p-6 sm:p-8 relative">
              {isSuccess ? (
                /* Success State Animation as per S3-04 */
                <div className="py-12 text-center space-y-6 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
                      GỬI YÊU CẦU THÀNH CÔNG!
                    </h3>
                    <p className="font-body text-sm text-gray-300 max-w-md mx-auto">
                      Cảm ơn Quý khách <strong className="text-white">{formData.name}</strong>. Kỹ sư xưởng Mạnh Nghĩa Window 2 sẽ liên hệ trực tiếp qua số <strong className="text-[#F28C28]">{formData.phone}</strong> trong vòng 15-30 phút.
                    </p>
                  </div>

                  <div className="inline-block p-3 bg-[#171A1D] border border-white/10 font-mono text-xs text-gray-300">
                    <span>Mã tiếp nhận báo giá: </span>
                    <strong className="text-[#F28C28] font-bold">{ticketId}</strong>
                  </div>

                  <div>
                    <button
                      onClick={handleReset}
                      className="btn-outline text-xs uppercase"
                    >
                      Gửi thêm yêu cầu khác
                    </button>
                  </div>
                </div>
              ) : (
                /* Form 7 fields with realtime validation */
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Field 1: Họ và tên */}
                    <div>
                      <label className="block font-mono text-xs uppercase text-gray-300 mb-1.5 font-semibold">
                        Họ và tên <span className="text-[#F28C28]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Nguyễn Văn Nam"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value })
                          if (errors.name) setErrors({ ...errors, name: '' })
                        }}
                        className={`w-full bg-[#171A1D] border ${
                          errors.name ? 'border-red-500' : 'border-white/10'
                        } text-white px-4 py-2.5 rounded-none text-sm focus:outline-none focus:border-[#F28C28] transition-colors`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Field 2: Số điện thoại */}
                    <div>
                      <label className="block font-mono text-xs uppercase text-gray-300 mb-1.5 font-semibold">
                        Số điện thoại <span className="text-[#F28C28]">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Ví dụ: 0903123456"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value })
                          if (errors.phone) setErrors({ ...errors, phone: '' })
                        }}
                        className={`w-full bg-[#171A1D] border ${
                          errors.phone ? 'border-red-500' : 'border-white/10'
                        } text-white px-4 py-2.5 rounded-none text-sm focus:outline-none focus:border-[#F28C28] transition-colors`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Field 3: Email (tùy chọn) */}
                    <div>
                      <label className="block font-mono text-xs uppercase text-gray-300 mb-1.5 font-semibold">
                        Email nhận bản vẽ <span className="text-gray-500">(Tùy chọn)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="tenban@gmail.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value })
                          if (errors.email) setErrors({ ...errors, email: '' })
                        }}
                        className={`w-full bg-[#171A1D] border ${
                          errors.email ? 'border-red-500' : 'border-white/10'
                        } text-white px-4 py-2.5 rounded-none text-sm focus:outline-none focus:border-[#F28C28] transition-colors`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Field 4: Hạng mục cơ khí */}
                    <div>
                      <label className="block font-mono text-xs uppercase text-gray-300 mb-1.5 font-semibold">
                        Hạng mục quan tâm <span className="text-[#F28C28]">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#171A1D] border border-white/10 text-white px-4 py-2.5 rounded-none text-sm focus:outline-none focus:border-[#F28C28] transition-colors"
                      >
                        <option value="sat">Sắt nghệ thuật & Cổng rào CNC</option>
                        <option value="inox">Inox 304 cao cấp (Lan can, Cửa cổng)</option>
                        <option value="nhom-kinh">Cửa nhôm Xingfa & Cửa lùa Slim</option>
                        <option value="mai-kinh">Mái kính biệt thự & Cầu thang</option>
                        <option value="tong-hop">Trọn gói cơ khí & nhôm kính công trình</option>
                      </select>
                    </div>
                  </div>

                  {/* Field 5: Kích thước / Khối lượng dự kiến */}
                  <div>
                    <label className="block font-mono text-xs uppercase text-gray-300 mb-1.5 font-semibold">
                      Khối lượng / Kích thước ước tính <span className="text-gray-500">(Ví dụ: Cổng 3x2.5m, 15m lan can)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ghi rõ kích thước hoặc diện tích ước lượng nếu có"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="w-full bg-[#171A1D] border border-white/10 text-white px-4 py-2.5 rounded-none text-sm focus:outline-none focus:border-[#F28C28] transition-colors"
                    />
                  </div>

                  {/* Field 6: Yêu cầu chi tiết & Địa chỉ công trình */}
                  <div>
                    <label className="block font-mono text-xs uppercase text-gray-300 mb-1.5 font-semibold">
                      Mô tả yêu cầu chi tiết & Địa chỉ công trình <span className="text-[#F28C28]">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ví dụ: Cần làm cổng sắt CNC mẫu trống đồng và cửa nhôm kính cho nhà phố tại Dĩ An, cần khảo sát đo đạc..."
                      value={formData.content}
                      onChange={(e) => {
                        setFormData({ ...formData, content: e.target.value })
                        if (errors.content) setErrors({ ...errors, content: '' })
                      }}
                      className={`w-full bg-[#171A1D] border ${
                        errors.content ? 'border-red-500' : 'border-white/10'
                      } text-white p-3 rounded-none text-sm focus:outline-none focus:border-[#F28C28] transition-colors`}
                    />
                    {errors.content && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.content}</span>
                      </p>
                    )}
                  </div>

                  {/* Field 7: Drag & Drop File Upload */}
                  <div>
                    <label className="block font-mono text-xs uppercase text-gray-300 mb-1.5 font-semibold">
                      Đính kèm bản vẽ / Hình ảnh công trình <span className="text-gray-500">(JPG, PNG, PDF, DWG tối đa 20MB)</span>
                    </label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 hover:border-[#F28C28] p-4 text-center cursor-pointer bg-[#171A1D] transition-colors"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf,.dwg"
                        className="hidden"
                      />
                      {attachedFile ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-[#F28C28] font-mono">
                          <FileText className="w-5 h-5" />
                          <span className="font-bold">{attachedFile.name}</span>
                          <span className="text-gray-400 text-xs">
                            ({(attachedFile.size / (1024 * 1024)).toFixed(1)} MB)
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <UploadCloud className="w-7 h-7 text-gray-400 mx-auto" />
                          <p className="text-xs text-gray-300">
                            Kéo thả file bản vẽ vào đây hoặc <span className="text-[#F28C28] font-bold">chọn file từ thiết bị</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-accent w-full justify-center py-3.5 text-base"
                    >
                      {isSubmitting ? (
                        <span>ĐANG GỬI THÔNG TIN VỀ XƯỞNG...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>GỬI YÊU CẦU BÁO GIÁ NGAY</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

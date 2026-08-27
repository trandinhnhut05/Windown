/**
 * Format số tiền VND
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value == null || value === '') return '0 ₫'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
}

/**
 * Format số ngắn gọn: 1.500.000 → 1,5 tr
 */
export const formatShortCurrency = (value: number | null | undefined): string => {
  if (value == null) return '0'
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} tỷ`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} tr`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`
  return value.toString()
}

/**
 * Format diện tích m²
 */
export const formatArea = (value: number | null | undefined): string => {
  if (value == null) return '0 m²'
  return `${Number(value).toFixed(2)} m²`
}

/**
 * Format ngày dd/MM/yyyy
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

/**
 * Format datetime dd/MM/yyyy HH:mm
 */
export const formatDateTime = (date: string | null | undefined): string => {
  if (!date) return '—'
  return new Date(date).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/**
 * Status label + CSS class
 */
export const projectStatusMap: Record<string, { label: string; className: string }> = {
  PENDING:         { label: 'Chờ xử lý',   className: 'badge badge-pending' },
  IN_PROGRESS:     { label: 'Đang làm',     className: 'badge badge-in-progress' },
  WAITING_PAYMENT: { label: 'Chờ thu tiền', className: 'badge badge-waiting' },
  COMPLETED:       { label: 'Hoàn thành',   className: 'badge badge-completed' },
  CANCELLED:       { label: 'Đã hủy',       className: 'badge badge-cancelled' },
}

export const paymentTypeMap: Record<string, string> = {
  DEPOSIT: 'Tiền cọc',
  EXTRA:   'Thu thêm',
  FINAL:   'Thanh toán đủ',
}

/**
 * Đọc số thành chữ (tiếng Việt) để người dùng dễ kiểm tra khi nhập tiền
 */
export const numberToVietnameseWords = (num: number | string | null | undefined): string => {
  if (num == null) return ''
  const parsed = typeof num === 'string' ? parseFloat(num.replace(/\D/g, '')) : num
  if (isNaN(parsed) || parsed <= 0) return ''
  if (parsed > 999_999_999_999) return 'Số quá lớn (vượt quá 999 tỷ)'

  const units = ['', 'nghìn', 'triệu', 'tỷ']
  const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']

  const readThreeDigits = (n: number, showZeroHundred: boolean): string => {
    let hundred = Math.floor(n / 100)
    let ten = Math.floor((n % 100) / 10)
    let unit = n % 10
    let res = ''

    if (hundred > 0 || showZeroHundred) {
      res += digits[hundred] + ' trăm '
    }

    if (ten > 0) {
      if (ten === 1) {
        res += 'mười '
      } else {
        res += digits[ten] + ' mươi '
      }
    } else if (hundred > 0 && unit > 0) {
      res += 'lẻ '
    }

    if (unit > 0) {
      if (unit === 1 && ten > 1) {
        res += 'mốt '
      } else if (unit === 5 && ten > 0) {
        res += 'lăm '
      } else {
        res += digits[unit] + ' '
      }
    }

    return res
  }

  let temp = Math.floor(parsed)
  let groups: number[] = []
  while (temp > 0) {
    groups.push(temp % 1000)
    temp = Math.floor(temp / 1000)
  }

  let words = ''
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i]
    if (g > 0) {
      const showZero = i < groups.length - 1
      const gWords = readThreeDigits(g, showZero)
      words += gWords + units[i] + ' '
    }
  }

  words = words.trim()
  if (!words) return ''
  return words.charAt(0).toUpperCase() + words.slice(1) + ' đồng'
}

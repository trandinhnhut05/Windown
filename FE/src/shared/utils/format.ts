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

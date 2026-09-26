import React from 'react'
import { numberToVietnameseWords } from '../utils/format'

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number
  onChange: (val: number) => void
  error?: boolean
  showWords?: boolean
}

export default function CurrencyInput({
  value,
  onChange,
  error,
  showWords = true,
  className,
  placeholder,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState('')

  // Sync internal display value with prop value changes
  React.useEffect(() => {
    const numericStr = value ? String(value) : ''
    const formatted = numericStr ? new Intl.NumberFormat('vi-VN').format(value) : ''
    setDisplayValue(formatted)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value
    // Allow only digits
    const cleaned = rawInput.replace(/\D/g, '')
    const numValue = cleaned ? Number(cleaned) : 0

    // Prevent numbers exceeding a practical limit (e.g. 1000 billion)
    if (numValue > 999_999_999_999) return

    onChange(numValue)

    // Format for input display (e.g., 1.500.000)
    const formatted = cleaned ? new Intl.NumberFormat('vi-VN').format(numValue) : ''
    setDisplayValue(formatted)
  }

  const words = showWords ? numberToVietnameseWords(value) : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder || "0"}
          className={`${className || 'form-input'} ${error ? 'error' : ''}`}
          style={{ paddingRight: '40px', textAlign: 'right', fontWeight: 600, ...props.style }}
          {...props}
        />
        <span style={{
          position: 'absolute',
          right: '12px',
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          đ
        </span>
      </div>
      {words && (
        <span style={{
          fontSize: '11.5px',
          fontStyle: 'italic',
          color: 'var(--color-primary)',
          marginTop: '4px',
          fontWeight: 500,
          lineHeight: '1.2'
        }}>
          ✍️ {words}
        </span>
      )}
    </div>
  )
}

export type ProductCategory = 'sat' | 'inox' | 'nhom-kinh' | 'co-khi' | 'mai-kinh' | 'tat-ca'

export interface Product {
  id: string
  title: string
  name?: string
  category: 'sat' | 'inox' | 'nhom-kinh' | 'co-khi' | 'mai-kinh'
  categoryName: string
  image: string
  material: string
  warranty: string
  description: string
  highlights: string[]
  priceEstimate?: string
  status?: 'active' | 'hidden'
  createdAt?: string
}

export interface Project {
  id: string
  title: string
  name?: string
  location: string
  category: 'sat' | 'inox' | 'nhom-kinh' | 'tong-hop'
  categoryName: string
  scale: string
  materials: string[]
  materialText?: string
  duration: string
  year: string
  image: string
  gallery: string[]
  description: string
  status?: 'published' | 'draft'
}

export type QuoteStatus = 'new' | 'processing' | 'quoted' | 'signed' | 'cancelled'

export interface QuoteRequest {
  id: string
  name: string
  phone: string
  email?: string
  category: string
  content: string
  dimensions?: string
  fileName?: string
  fileSize?: string
  fileUrl?: string
  status: QuoteStatus
  createdAt: string
  notes?: string
}

export interface Service {
  id: string
  title: string
  subtitle: string
  tagline: string
  image: string
  items: string[]
  description: string
  order: number
  status?: 'active' | 'inactive'
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  readTime: string
  date: string
  image: string
  status: 'published' | 'draft'
  seoTitle: string
  seoDescription: string
  tags?: string[]
}

export interface BusinessInfo {
  name: string
  shortName: string
  slogan: string
  hotlines: string[]
  hotlineDisplay: string
  zalo: string
  email: string
  address: string
  addressHcm?: string
  workingHours: string
  taxCode: string
  logoUrl: string
  foundingYear: string
}

export interface StatItem {
  value: string
  label: string
  description: string
}

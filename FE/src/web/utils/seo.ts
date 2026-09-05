export interface SeoConfig {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  schemaJson?: Record<string, unknown>
}

export function applySeo({
  title,
  description,
  canonical = window.location.href,
  ogImage = '/logo-company.jpg',
  schemaJson,
}: SeoConfig) {
  // Title
  document.title = title

  // Meta Description
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', description)

  // Canonical
  let linkCanonical = document.querySelector('link[rel="canonical"]')
  if (!linkCanonical) {
    linkCanonical = document.createElement('link')
    linkCanonical.setAttribute('rel', 'canonical')
    document.head.appendChild(linkCanonical)
  }
  linkCanonical.setAttribute('href', canonical)

  // Open Graph
  const ogTags: Record<string, string> = {
    'og:title': title,
    'og:description': description,
    'og:image': ogImage,
    'og:url': canonical,
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': ogImage,
  }

  Object.entries(ogTags).forEach(([property, content]) => {
    let tag = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`)
    if (!tag) {
      tag = document.createElement('meta')
      if (property.startsWith('og:')) {
        tag.setAttribute('property', property)
      } else {
        tag.setAttribute('name', property)
      }
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', content)
  })

  // Schema.org JSON-LD
  const schemaId = 'schema-seo-jsonld'
  let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null
  if (!scriptTag) {
    scriptTag = document.createElement('script')
    scriptTag.id = schemaId
    scriptTag.type = 'application/ld+json'
    document.head.appendChild(scriptTag)
  }

  const defaultSchema = getLocalBusinessSchema()
  scriptTag.textContent = JSON.stringify(schemaJson || defaultSchema, null, 2)
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Cơ Khí Tổng Hợp Mạnh Nghĩa Window 2',
    alternateName: 'Mạnh Nghĩa Window 2 — Xưởng Cơ Khí Sắt Inox Nhôm Kính',
    image: window.location.origin + '/logo-company.jpg',
    url: window.location.origin,
    telephone: '0704682789',
    priceRange: '500.000đ - 50.000.000đ',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Khu phố Bình Đường, Dĩ An',
      addressLocality: 'Bình Dương',
      addressRegion: 'Bình Dương / TP. Hồ Chí Minh',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 10.8752,
      longitude: 106.7725,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:30',
        closes: '18:30',
      },
    ],
    sameAs: [
      'https://zalo.me/0704682789',
      'https://facebook.com/manhnghiawindow2',
    ],
  }
}

export function getServiceSchema(service: { title: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Cơ Khí Tổng Hợp Mạnh Nghĩa Window 2',
    },
    description: service.description,
  }
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

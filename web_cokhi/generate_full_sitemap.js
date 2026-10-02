const fs = require('fs');

// Read index.html to extract all product items and images
const html = fs.readFileSync('index.html', 'utf8');

// Key base images
const baseImages = [
  {
    loc: 'https://manhnghia2.vn/assets/images/hero-craftsman-sparks.jpg',
    title: 'Hình ảnh thợ hàn cơ khí gia công tia lửa điện tại xưởng Mạnh Nghĩa Đà Nẵng',
    caption: 'Hình ảnh việc làm thực tế thợ cơ khí lành nghề hàn cắt kết cấu sắt thép với tia lửa điện công nghiệp tại xưởng Cơ Khí Mạnh Nghĩa Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/projects/xuong-co-khi-manh-nghia-window.jpg',
    title: 'Xưởng sản xuất và đội ngũ thợ cơ khí gia công chế tạo Mạnh Nghĩa Hòa Quý Đà Nẵng',
    caption: 'Toàn cảnh không khí việc làm thực tế thợ cơ khí gia công sản xuất cổng sắt CNC mỹ thuật và kết cấu thép tại Lô 51/B2-77 Hòa Quý, Ngũ Hành Sơn, Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/projects/mat-tien-xuong-manh-nghia-2.jpg',
    title: 'Mặt tiền trụ sở xưởng Cơ Khí Xây Dựng Mạnh Nghĩa 2 Đà Nẵng',
    caption: 'Địa chỉ trụ sở xưởng sản xuất cơ khí Mạnh Nghĩa 2 tại Lô 51/B2-77 Hòa Quý, Ngũ Hành Sơn, TP. Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/projects/kho-thep-hop-ma-kem.jpg',
    title: 'Kho thép hộp mạ kẽm Hòa Phát nguyên kiện tại xưởng cơ khí Mạnh Nghĩa Đà Nẵng',
    caption: 'Kho nguyên vật liệu thép hộp mạ kẽm và Inox chuẩn bị cho thợ cơ khí gia công theo yêu cầu tại Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/laser-cutting.jpg',
    title: 'Cắt laser kim loại tấm cơ khí chính xác CNC Laser Fiber Đà Nẵng',
    caption: 'Gia công cắt laser fiber sắt tấm hoa văn nghệ thuật cơ khí chính xác theo yêu cầu tại Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/cnc-milling.jpg',
    title: 'Chế tạo dầm kèo kết cấu thép và cơ khí xây dựng nhà tiền chế Đà Nẵng',
    caption: 'Thi công kết cấu khung thép nhà tiền chế, dầm giàn chịu lực và gác lửng cơ khí xây dựng tại Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/luxury-doors.jpg',
    title: 'Cửa cổng sắt CNC mỹ thuật cao cấp mạ kẽm sơn tĩnh điện biệt thự Đà Nẵng',
    caption: 'Thi công cổng sắt CNC 4 cánh mạ kẽm sơn tĩnh điện biệt thự sang trọng tại Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/iron-gate-glass.jpg',
    title: 'Mái kính nghệ thuật khung thép sảnh biệt thự và cổng sắt cơ khí Đà Nẵng',
    caption: 'Gia công lắp đặt mái sảnh kính cường lực kết hợp cổng sắt mỹ nghệ cao cấp tại Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/factory-facility.jpg',
    title: 'Cửa cuốn khe thoáng thông minh công nghệ Đức Đà Nẵng',
    caption: 'Lắp đặt cửa cuốn nhôm khe thoáng tự động motor êm ái bảo hành chính hãng tại Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/precision-components.jpg',
    title: 'Lan can kính cường lực và phụ kiện Inox 304 cơ khí Đà Nẵng',
    caption: 'Sản xuất thi công lan can kính ban công tay vịn Inox 304 chống rỉ sét tại Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/logo-sign-gold.png',
    title: 'Biển hiệu thương hiệu Cơ Khí Mạnh Nghĩa Đà Nẵng mạ vàng sang trọng',
    caption: 'Biển hiệu xưởng sản xuất cơ khí xây dựng và mỹ thuật Mạnh Nghĩa tại Đà Nẵng'
  },
  {
    loc: 'https://manhnghia2.vn/assets/images/logo-manh-nghia.jpg',
    title: 'Logo Cơ Khí Xây Dựng và Mỹ Thuật Mạnh Nghĩa Đà Nẵng',
    caption: 'Logo nhận diện thương hiệu Cơ Khí Mạnh Nghĩa Đà Nẵng'
  }
];

// Extract product items from index.html
const productRegex = /<div class="product-item[^"]*"[^>]*data-category="([^"]+)"[\s\S]*?data-title="([^"]+)"[\s\S]*?data-desc="([^"]+)"[\s\S]*?<img[^>]+src="([^"]+)"[^>]*alt="([^"]+)"/g;
let match;
const productImages = [];
const seenLocs = new Set(baseImages.map(b => b.loc));

while ((match = productRegex.exec(html)) !== null) {
  const [_, cat, title, desc, src, alt] = match;
  const fullLoc = src.startsWith('http') ? src : `https://manhnghia2.vn/${src.replace(/^\.\//, '')}`;
  
  if (!seenLocs.has(fullLoc)) {
    seenLocs.add(fullLoc);
    productImages.push({
      loc: fullLoc,
      title: alt || title,
      caption: desc || `${title} thi công tại Đà Nẵng bởi xưởng Cơ Khí Mạnh Nghĩa`
    });
  }
}

console.log(`Found ${baseImages.length} base images + ${productImages.length} product images = ${baseImages.length + productImages.length} total images.`);

// Clean XML string helper
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const allImages = [...baseImages, ...productImages];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://manhnghia2.vn/</loc>
    <lastmod>2026-10-02</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
`;

allImages.forEach(img => {
  xml += `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
      <image:geo_location>Đà Nẵng, Việt Nam</image:geo_location>
    </image:image>
`;
});

xml += `  </url>
</urlset>
`;

fs.writeFileSync('sitemap.xml', xml, 'utf8');
console.log('sitemap.xml successfully generated with full Google Image extensions!');

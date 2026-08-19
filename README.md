# Windown — Quản lý Xưởng Nhôm Kính

Hệ thống quản lý toàn diện cho xưởng nhôm kính: công trình, vật tư, nhân công, chấm công.

## 🚀 Khởi chạy nhanh

### Yêu cầu
- Node.js 18+ và npm
- Java 17+
- MySQL 8.0+ (hoặc Docker)
- Maven 3.9+ (đã cài tại `C:\tools\apache-maven-3.9.6`)

---

### Cách 1: Chạy trực tiếp (Development)

**Bước 1 — Khởi động MySQL**
```bash
# Nếu dùng Docker:
docker run -d --name windown_mysql -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=windown_db \
  mysql:8.0
```

**Bước 2 — Chạy Backend**
```bash
cd BE
# Thêm mvn vào PATH nếu chưa có
$env:PATH += ";C:\tools\apache-maven-3.9.6\bin"

mvn spring-boot:run
# → Chạy tại http://localhost:8080
# → Flyway tự tạo bảng và seed data
```

**Bước 3 — Chạy Frontend**
```bash
cd FE
npm install
npm run dev
# → Chạy tại http://localhost:5173
```

**Đăng nhập:** `admin` / `admin123`

---

### Cách 2: Docker Compose (Production-like)

```bash
# Từ thư mục gốc
docker-compose up -d

# Frontend vẫn chạy riêng:
cd FE && npm run dev
```

---

## 📋 API Endpoints

| Method | URL | Mô tả |
|--------|-----|-------|
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/me` | Thông tin user hiện tại |
| GET | `/api/projects` | Danh sách công trình (filter, search, page) |
| POST | `/api/projects` | Tạo công trình mới |
| GET | `/api/projects/:id` | Chi tiết công trình |
| PUT | `/api/projects/:id` | Cập nhật công trình |
| DELETE | `/api/projects/:id` | Xóa công trình |
| POST | `/api/projects/:id/payments` | Ghi nhận thanh toán |
| GET | `/api/projects/dashboard` | Thống kê KPI |

### Ví dụ login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🗂️ Cấu trúc dự án

```
Windown/
├── FE/                    # React 18 + TypeScript + Vite
│   └── src/
│       ├── features/      # Dashboard, Projects, Materials, Workers...
│       ├── shared/        # Components, store, API, utils
│       └── App.tsx        # Routing
├── BE/                    # Spring Boot 3.3 + Java 17
│   └── src/main/java/com/windown/
│       ├── auth/          # JWT Authentication
│       ├── project/       # Công trình CRUD
│       ├── material/      # Vật tư (Sprint 2)
│       ├── worker/        # Nhân công (Sprint 3)
│       └── common/        # Exceptions, utilities
└── docker-compose.yml
```

---

## 🗓️ Trạng thái phát triển

| Sprint | Mô tả | Trạng thái |
|--------|-------|-----------|
| Sprint 1 | Công trình CRUD, Tính tiền, Thanh toán, Dashboard | ✅ Hoàn thành |
| Sprint 2 | Vật tư, Chi phí, Biểu đồ | 🔜 Kế hoạch |
| Sprint 3 | Nhân công, Chấm công, Lương | 🔜 Kế hoạch |
| Sprint 4 | PDF, Backup, Lịch nhắc, Bảo hành | 🔜 Kế hoạch |

---

## 🔧 Cấu hình

**FE** — `FE/.env` (tùy chọn):
```env
VITE_API_BASE_URL=http://localhost:8080
```

**BE** — `BE/src/main/resources/application.yml`:
- DB: `jdbc:mysql://localhost:3306/windown_db`
- User/pass: `root` / `root`
- JWT secret: thay đổi trước khi deploy production

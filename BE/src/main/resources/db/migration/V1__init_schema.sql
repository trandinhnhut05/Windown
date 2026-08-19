-- ============================================================
-- V1__init_schema.sql
-- Khởi tạo schema Windown — Quản lý Xưởng Nhôm Kính
-- ============================================================

-- Users (Tài khoản đăng nhập)
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(100) NOT NULL,
    role        ENUM('OWNER','STAFF') NOT NULL DEFAULT 'OWNER',
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects (Công trình)
CREATE TABLE IF NOT EXISTS projects (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_code    VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Mã CT tự sinh: CT-YYYYMM-XXX',
    name            VARCHAR(200) NOT NULL COMMENT 'Tên công trình / mô tả',
    customer_name   VARCHAR(100) NOT NULL,
    customer_phone  VARCHAR(20),
    address         VARCHAR(300),
    length_m        DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT 'Chiều dài (m)',
    width_m         DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT 'Chiều rộng (m)',
    area_m2         DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT 'Diện tích = Dài x Rộng',
    unit_price      DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Đơn giá (VND/m²)',
    total_amount    DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Thành tiền = Diện tích x Đơn giá',
    deposit         DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Tiền cọc ban đầu',
    extra_paid      DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Tổng các lần thu thêm',
    remaining_debt  DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - deposit - extra_paid) VIRTUAL,
    status          ENUM('PENDING','IN_PROGRESS','WAITING_PAYMENT','COMPLETED','CANCELLED')
                    NOT NULL DEFAULT 'PENDING',
    start_date      DATE,
    delivery_date   DATE COMMENT 'Ngày giao hàng dự kiến',
    note            TEXT,
    created_by      BIGINT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Payments (Lịch sử thanh toán)
CREATE TABLE IF NOT EXISTS payments (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id  BIGINT NOT NULL,
    amount      DECIMAL(15,2) NOT NULL,
    type        ENUM('DEPOSIT','EXTRA','FINAL') NOT NULL,
    note        VARCHAR(300),
    paid_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Material Templates (Vật tư thường dùng — Sprint 2)
CREATE TABLE IF NOT EXISTS material_templates (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    unit          VARCHAR(30)  NOT NULL COMMENT 'ĐVT: cây, kg, tấm...',
    default_price DECIMAL(15,2) DEFAULT 0,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE
);

-- Materials (Vật tư theo công trình — Sprint 2)
CREATE TABLE IF NOT EXISTS materials (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id  BIGINT NOT NULL,
    name        VARCHAR(100) NOT NULL,
    unit        VARCHAR(30)  NOT NULL,
    quantity    DECIMAL(10,3) NOT NULL DEFAULT 0,
    unit_price  DECIMAL(15,2) NOT NULL DEFAULT 0,
    total       DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) VIRTUAL,
    note        VARCHAR(300),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Workers (Thợ — Sprint 3)
CREATE TABLE IF NOT EXISTS workers (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(20),
    daily_wage  DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT 'Lương ngày (VND)',
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    note        VARCHAR(300),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendance (Chấm công — Sprint 3)
CREATE TABLE IF NOT EXISTS attendance (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id   BIGINT NOT NULL,
    work_date   DATE NOT NULL,
    is_present  BOOLEAN NOT NULL DEFAULT TRUE,
    note        VARCHAR(200),
    UNIQUE KEY uq_worker_date (worker_id, work_date),
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);

-- Salary Advances (Ứng lương — Sprint 3)
CREATE TABLE IF NOT EXISTS salary_advances (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id    BIGINT NOT NULL,
    amount       DECIMAL(12,2) NOT NULL,
    advance_date DATE NOT NULL,
    note         VARCHAR(300),
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);

-- Warranties (Bảo hành — Sprint 4)
CREATE TABLE IF NOT EXISTS warranties (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id      BIGINT NOT NULL,
    warranty_date   DATE NOT NULL,
    issue           VARCHAR(500) COMMENT 'Mô tả sự cố',
    is_resolved     BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at     DATE,
    note            TEXT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Reminders (Nhắc việc — Sprint 4)
CREATE TABLE IF NOT EXISTS reminders (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    remind_at   DATETIME NOT NULL,
    type        ENUM('DELIVERY','PAYMENT','WARRANTY','OTHER') NOT NULL DEFAULT 'OTHER',
    is_done     BOOLEAN NOT NULL DEFAULT FALSE,
    project_id  BIGINT,
    note        VARCHAR(300),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- ============================================================
-- Seed data: Default admin user (password: admin123)
-- BCrypt hash of "admin123"
-- ============================================================
INSERT INTO users (username, password, full_name, role) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKSW.lSRQhTb3xjYFWkLM8JiGSWy', 'Chủ Xưởng', 'OWNER');

-- Seed: Vật tư thường dùng
INSERT INTO material_templates (name, unit, default_price) VALUES
('Nhôm hộp', 'cây', 85000),
('Nhôm thanh', 'cây', 70000),
('Kính trắng 5mm', 'm²', 120000),
('Kính cường lực 8mm', 'm²', 380000),
('Que hàn', 'kg', 35000),
('Tôn lạnh 0.5mm', 'tấm', 180000),
('Sơn tĩnh điện', 'kg', 90000),
('Vít inox', 'hộp', 25000),
('Gioăng EPDM', 'm', 8000),
('Bánh xe cửa', 'bộ', 45000);

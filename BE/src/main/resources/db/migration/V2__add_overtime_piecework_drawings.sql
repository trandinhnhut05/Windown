-- ============================================================
-- V2__add_overtime_piecework_drawings.sql
-- Thêm các cột chấm công chi tiết, lương khoán và bản vẽ công trình
-- ============================================================

-- 1. Cập nhật bảng attendance để chấm công chi tiết theo giờ/buổi và OT
ALTER TABLE attendance 
ADD COLUMN hours_worked DECIMAL(4,2) NOT NULL DEFAULT 8.0 COMMENT 'Số giờ làm việc (mặc định 8.0 = 1 ngày công)',
ADD COLUMN ot_hours DECIMAL(4,2) NOT NULL DEFAULT 0.0 COMMENT 'Số giờ tăng ca',
ADD COLUMN ot_coefficient DECIMAL(3,2) NOT NULL DEFAULT 1.5 COMMENT 'Hệ số tăng ca';

-- 2. Tạo bảng piecework_compensations ghi nhận tiền khoán sản phẩm
CREATE TABLE IF NOT EXISTS piecework_compensations (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id    BIGINT NOT NULL,
    project_id   BIGINT COMMENT 'Liên kết công trình (nếu có)',
    description  VARCHAR(200) NOT NULL COMMENT 'Mô tả công việc khoán (e.g. Gia công ráp cửa)',
    quantity     DECIMAL(10,2) NOT NULL DEFAULT 1.0,
    unit_price   DECIMAL(12,2) NOT NULL DEFAULT 0.0,
    amount       DECIMAL(12,2) NOT NULL DEFAULT 0.0 COMMENT 'Thành tiền = SL x Đơn giá',
    work_date    DATE NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- 3. Tạo bảng project_drawings để đính kèm bản vẽ/PDF kỹ thuật
CREATE TABLE IF NOT EXISTS project_drawings (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id   BIGINT NOT NULL,
    file_name    VARCHAR(255) NOT NULL,
    file_path    VARCHAR(255) NOT NULL,
    file_type    VARCHAR(50) NOT NULL,
    uploaded_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

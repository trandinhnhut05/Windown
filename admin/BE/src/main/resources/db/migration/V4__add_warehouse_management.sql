-- ============================================================
-- V4__add_warehouse_management.sql
-- Thêm tính năng Quản lý kho (vật tư kho, phiếu nhập/xuất, thẻ kho)
-- ============================================================

-- 1. Bảng vật tư trong kho
CREATE TABLE IF NOT EXISTS warehouse_items (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    code            VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã vật tư, vd: VT-001, NHOM-XF55',
    name            VARCHAR(150) NOT NULL COMMENT 'Tên vật tư',
    category        VARCHAR(50) NOT NULL DEFAULT 'KHAC' COMMENT 'NHOM, KINH, PHU_KIEN, VAT_TU_PHU, KHAC',
    unit            VARCHAR(30) NOT NULL COMMENT 'ĐVT: cây, thanh, m2, bộ, chai, cuộn, cái, kg...',
    current_stock   DECIMAL(12,3) NOT NULL DEFAULT 0.000 COMMENT 'Số lượng tồn kho hiện tại',
    min_stock       DECIMAL(12,3) NOT NULL DEFAULT 0.000 COMMENT 'Định mức tồn an toàn tối thiểu để cảnh báo',
    cost_price      DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá vốn / giá nhập gần nhất',
    selling_price   DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Đơn giá bán / xuất tham khảo',
    location        VARCHAR(100) COMMENT 'Vị trí lưu kho: Kệ A1, Kho phụ kiện...',
    note            VARCHAR(300),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_wh_items_code (code),
    INDEX idx_wh_items_category (category)
);

-- 2. Bảng phiếu nhập / xuất kho
CREATE TABLE IF NOT EXISTS warehouse_receipts (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    code                    VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã phiếu: PN-xxx, PX-xxx',
    type                    ENUM('IMPORT', 'EXPORT') NOT NULL COMMENT 'IMPORT: Nhập kho, EXPORT: Xuất kho',
    reason                  VARCHAR(50) NOT NULL COMMENT 'NHAP_MUA, NHAP_HOAN_TRA, XUAT_CONG_TRINH, XUAT_HU_HONG, XUAT_BAN_LE, XUAT_KHAC',
    project_id              BIGINT COMMENT 'Nếu xuất cho công trình cụ thể',
    supplier_or_recipient   VARCHAR(150) COMMENT 'Nhà cung cấp (phiếu nhập) hoặc Người nhận (phiếu xuất)',
    receipt_date            DATE NOT NULL,
    total_amount            DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng giá trị phiếu',
    note                    VARCHAR(500),
    created_by              BIGINT,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_wh_receipts_date (receipt_date),
    INDEX idx_wh_receipts_type (type)
);

-- 3. Bảng chi tiết vật tư trong phiếu nhập / xuất
CREATE TABLE IF NOT EXISTS warehouse_receipt_items (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_id      BIGINT NOT NULL,
    item_id         BIGINT NOT NULL,
    quantity        DECIMAL(12,3) NOT NULL COMMENT 'Số lượng',
    unit_price      DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Đơn giá',
    total_price     DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Thành tiền = quantity * unit_price',
    note            VARCHAR(255),
    FOREIGN KEY (receipt_id) REFERENCES warehouse_receipts(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES warehouse_items(id) ON DELETE RESTRICT,
    INDEX idx_wh_receipt_items_receipt (receipt_id),
    INDEX idx_wh_receipt_items_item (item_id)
);

-- 4. Bảng thẻ kho / nhật ký biến động kho (Stock Ledger)
CREATE TABLE IF NOT EXISTS warehouse_transactions (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id             BIGINT NOT NULL,
    receipt_id          BIGINT,
    type                VARCHAR(30) NOT NULL COMMENT 'IMPORT, EXPORT, ADJUST',
    quantity            DECIMAL(12,3) NOT NULL COMMENT 'Số lượng biến động (+ nhập, - xuất)',
    stock_before        DECIMAL(12,3) NOT NULL COMMENT 'Tồn trước giao dịch',
    stock_after         DECIMAL(12,3) NOT NULL COMMENT 'Tồn sau giao dịch',
    transaction_date    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note                VARCHAR(300),
    FOREIGN KEY (item_id) REFERENCES warehouse_items(id) ON DELETE CASCADE,
    FOREIGN KEY (receipt_id) REFERENCES warehouse_receipts(id) ON DELETE SET NULL,
    INDEX idx_wh_trans_item (item_id),
    INDEX idx_wh_trans_date (transaction_date)
);

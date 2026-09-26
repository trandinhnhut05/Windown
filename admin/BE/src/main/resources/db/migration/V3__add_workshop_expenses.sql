-- ============================================================
-- V3__add_workshop_expenses.sql
-- Thêm bảng other_expenses lưu chi phí chung của xưởng
-- ============================================================

CREATE TABLE IF NOT EXISTS other_expenses (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    category         VARCHAR(50) NOT NULL COMMENT 'RENT, ELECTRICITY, TRANSPORT, MACHINERY_MAINTENANCE, OTHER',
    amount           DECIMAL(12,2) NOT NULL DEFAULT 0.0,
    expense_date     DATE NOT NULL,
    description      VARCHAR(255),
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

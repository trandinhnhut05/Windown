package com.windown.warehouse.entity;

public enum ReceiptReason {
    NHAP_MUA,            // Nhập hàng mua mới
    NHAP_HOAN_TRA,       // Nhập hoàn trả từ công trình
    XUAT_CONG_TRINH,     // Xuất phục vụ thi công công trình
    XUAT_HU_HONG,        // Xuất do hư hỏng / cắt vụn / hao hụt
    XUAT_BAN_LE,         // Xuất bán lẻ
    XUAT_KHAC            // Xuất dùng chung xưởng
}

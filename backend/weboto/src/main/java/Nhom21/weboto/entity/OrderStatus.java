package Nhom21.weboto.entity;

public enum OrderStatus {
    PENDING,    // Chờ thanh toán/xác nhận
    PAID,       // Đã thanh toán
    SHIPPING,   // Đang giao hàng
    COMPLETED,  // Đã hoàn thành
    CANCELLED   // Đã hủy
}
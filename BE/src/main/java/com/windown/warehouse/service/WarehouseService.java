package com.windown.warehouse.service;

import com.windown.auth.entity.User;
import com.windown.auth.repository.UserRepository;
import com.windown.common.exception.AppException;
import com.windown.material.entity.Material;
import com.windown.material.repository.MaterialRepository;
import com.windown.project.entity.Project;
import com.windown.project.repository.ProjectRepository;
import com.windown.warehouse.dto.*;
import com.windown.warehouse.entity.*;
import com.windown.warehouse.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WarehouseService {

    private final WarehouseItemRepository itemRepository;
    private final WarehouseReceiptRepository receiptRepository;
    private final WarehouseReceiptItemRepository receiptItemRepository;
    private final WarehouseTransactionRepository transactionRepository;
    private final ProjectRepository projectRepository;
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;

    // ==========================================
    // 1. Quản lý Danh mục & Tồn kho Vật tư
    // ==========================================

    public List<WarehouseItemResponse> getItems(String keyword, ItemCategory category, Boolean lowStockOnly) {
        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        return itemRepository.searchItems(kw, category, lowStockOnly).stream()
                .map(this::toItemResponse)
                .toList();
    }

    public WarehouseItemResponse getItemById(Long id) {
        WarehouseItem item = itemRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy vật tư kho #" + id));
        return toItemResponse(item);
    }

    @Transactional
    public WarehouseItemResponse createItem(WarehouseItemRequest request) {
        String code = request.code();
        if (code == null || code.isBlank()) {
            code = generateItemCode(request.category());
        } else {
            code = code.trim().toUpperCase();
            if (itemRepository.existsByCode(code)) {
                throw AppException.badRequest("Mã vật tư '" + code + "' đã tồn tại");
            }
        }

        BigDecimal currentStock = request.currentStock() != null ? request.currentStock() : BigDecimal.ZERO;
        BigDecimal minStock = request.minStock() != null ? request.minStock() : BigDecimal.ZERO;
        BigDecimal costPrice = request.costPrice() != null ? request.costPrice() : BigDecimal.ZERO;
        BigDecimal sellingPrice = request.sellingPrice() != null ? request.sellingPrice() : BigDecimal.ZERO;

        WarehouseItem item = WarehouseItem.builder()
                .code(code)
                .name(request.name().trim())
                .category(request.category() != null ? request.category() : ItemCategory.KHAC)
                .unit(request.unit().trim())
                .currentStock(currentStock)
                .minStock(minStock)
                .costPrice(costPrice)
                .sellingPrice(sellingPrice)
                .location(request.location())
                .note(request.note())
                .isActive(true)
                .build();

        item = itemRepository.save(item);

        // Nếu ban đầu khai báo tồn kho > 0, ghi nhận 1 giao dịch khởi tạo
        if (currentStock.compareTo(BigDecimal.ZERO) > 0) {
            WarehouseTransaction tx = WarehouseTransaction.builder()
                    .item(item)
                    .type("INIT")
                    .quantity(currentStock)
                    .stockBefore(BigDecimal.ZERO)
                    .stockAfter(currentStock)
                    .transactionDate(LocalDateTime.now())
                    .note("Khởi tạo số dư tồn kho ban đầu")
                    .build();
            transactionRepository.save(tx);
        }

        return toItemResponse(item);
    }

    @Transactional
    public WarehouseItemResponse updateItem(Long id, WarehouseItemRequest request) {
        WarehouseItem item = itemRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy vật tư kho #" + id));

        if (request.code() != null && !request.code().isBlank()) {
            String newCode = request.code().trim().toUpperCase();
            if (itemRepository.existsByCodeAndIdNot(newCode, id)) {
                throw AppException.badRequest("Mã vật tư '" + newCode + "' đã tồn tại");
            }
            item.setCode(newCode);
        }

        item.setName(request.name().trim());
        if (request.category() != null) item.setCategory(request.category());
        item.setUnit(request.unit().trim());
        if (request.minStock() != null) item.setMinStock(request.minStock());
        if (request.costPrice() != null) item.setCostPrice(request.costPrice());
        if (request.sellingPrice() != null) item.setSellingPrice(request.sellingPrice());
        item.setLocation(request.location());
        item.setNote(request.note());

        return toItemResponse(itemRepository.save(item));
    }

    @Transactional
    public void deleteItem(Long id) {
        WarehouseItem item = itemRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy vật tư kho #" + id));
        item.setIsActive(false);
        itemRepository.save(item);
    }

    // ==========================================
    // 2. Quản lý Phiếu Nhập / Xuất Kho
    // ==========================================

    public List<WarehouseReceiptResponse> getReceipts(ReceiptType type, LocalDate startDate, LocalDate endDate, Long projectId) {
        return receiptRepository.searchReceipts(type, startDate, endDate, projectId).stream()
                .map(this::toReceiptResponse)
                .toList();
    }

    public WarehouseReceiptResponse getReceiptById(Long id) {
        WarehouseReceipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy phiếu kho #" + id));
        return toReceiptResponse(receipt);
    }

    @Transactional
    public WarehouseReceiptResponse createReceipt(WarehouseReceiptRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw AppException.badRequest("Phiếu kho phải có ít nhất 1 mặt hàng");
        }

        User currentUser = getCurrentUser();
        Project project = null;
        if (request.projectId() != null) {
            project = projectRepository.findById(request.projectId())
                    .orElseThrow(() -> AppException.notFound("Không tìm thấy công trình #" + request.projectId()));
        }

        String code = generateReceiptCode(request.type());
        LocalDate receiptDate = request.receiptDate() != null ? request.receiptDate() : LocalDate.now();

        WarehouseReceipt receipt = WarehouseReceipt.builder()
                .code(code)
                .type(request.type())
                .reason(request.reason())
                .project(project)
                .supplierOrRecipient(request.supplierOrRecipient())
                .receiptDate(receiptDate)
                .note(request.note())
                .createdBy(currentUser)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (ReceiptItemRequest itemReq : request.items()) {
            WarehouseItem item = itemRepository.findById(itemReq.itemId())
                    .orElseThrow(() -> AppException.notFound("Không tìm thấy vật tư kho #" + itemReq.itemId()));

            BigDecimal qty = itemReq.quantity();
            if (qty.compareTo(BigDecimal.ZERO) <= 0) {
                throw AppException.badRequest("Số lượng vật tư phải lớn hơn 0");
            }

            BigDecimal unitPrice = itemReq.unitPrice() != null ? itemReq.unitPrice() : BigDecimal.ZERO;
            if (unitPrice.compareTo(BigDecimal.ZERO) <= 0) {
                // Tự động lấy giá vốn hiện tại nếu không nhập giá
                unitPrice = item.getCostPrice();
            }

            BigDecimal totalPrice = qty.multiply(unitPrice);
            totalAmount = totalAmount.add(totalPrice);

            WarehouseReceiptItem receiptItem = WarehouseReceiptItem.builder()
                    .item(item)
                    .quantity(qty)
                    .unitPrice(unitPrice)
                    .totalPrice(totalPrice)
                    .note(itemReq.note())
                    .build();
            receipt.addItem(receiptItem);

            // Cập nhật tồn kho và thẻ kho
            BigDecimal stockBefore = item.getCurrentStock();
            BigDecimal stockAfter;

            if (request.type() == ReceiptType.IMPORT) {
                stockAfter = stockBefore.add(qty);
                item.setCurrentStock(stockAfter);
                // Cập nhật giá vốn gần nhất
                if (unitPrice.compareTo(BigDecimal.ZERO) > 0) {
                    item.setCostPrice(unitPrice);
                }
            } else { // EXPORT
                if (stockBefore.compareTo(qty) < 0) {
                    throw AppException.badRequest(String.format(
                            "Vật tư '%s' hiện chỉ còn tồn %s %s, không đủ để xuất %s %s",
                            item.getName(), stockBefore, item.getUnit(), qty, item.getUnit()
                    ));
                }
                stockAfter = stockBefore.subtract(qty);
                item.setCurrentStock(stockAfter);

                // Nếu xuất cho công trình và chọn đồng bộ sang vật tư công trình
                if (project != null && Boolean.TRUE.equals(request.syncToProjectMaterials())) {
                    Material material = Material.builder()
                            .project(project)
                            .name(item.getName())
                            .unit(item.getUnit())
                            .quantity(qty)
                            .unitPrice(unitPrice)
                            .note("Xuất từ kho theo phiếu " + code)
                            .build();
                    materialRepository.save(material);
                }
            }

            itemRepository.save(item);

            // Ghi nhật ký thẻ kho
            WarehouseTransaction tx = WarehouseTransaction.builder()
                    .item(item)
                    .receipt(receipt)
                    .type(request.type().name())
                    .quantity(request.type() == ReceiptType.IMPORT ? qty : qty.negate())
                    .stockBefore(stockBefore)
                    .stockAfter(stockAfter)
                    .transactionDate(receiptDate.atStartOfDay())
                    .note(String.format("Phiếu %s (%s): %s", code, request.reason(), request.note() != null ? request.note() : ""))
                    .build();
            transactionRepository.save(tx);
        }

        receipt.setTotalAmount(totalAmount);
        receipt = receiptRepository.save(receipt);

        return toReceiptResponse(receipt);
    }

    // ==========================================
    // 3. Thẻ kho & Báo cáo thống kê
    // ==========================================

    public List<WarehouseTransactionResponse> getTransactions(Long itemId) {
        List<WarehouseTransaction> list = (itemId != null)
                ? transactionRepository.findByItemIdOrderByTransactionDateDesc(itemId)
                : transactionRepository.findTop100ByOrderByTransactionDateDesc();

        return list.stream()
                .map(this::toTransactionResponse)
                .toList();
    }

    public WarehouseSummaryResponse getSummary() {
        long totalItems = itemRepository.count();
        BigDecimal totalStockValue = itemRepository.calculateTotalStockValue();
        long lowStockCount = itemRepository.countLowStockItems();

        LocalDate now = LocalDate.now();
        int year = now.getYear();
        int month = now.getMonthValue();

        long totalImports = receiptRepository.countByTypeAndMonth(ReceiptType.IMPORT, year, month);
        BigDecimal importValue = receiptRepository.sumAmountByTypeAndMonth(ReceiptType.IMPORT, year, month);

        long totalExports = receiptRepository.countByTypeAndMonth(ReceiptType.EXPORT, year, month);
        BigDecimal exportValue = receiptRepository.sumAmountByTypeAndMonth(ReceiptType.EXPORT, year, month);

        return new WarehouseSummaryResponse(
                totalItems,
                totalStockValue != null ? totalStockValue : BigDecimal.ZERO,
                lowStockCount,
                totalImports,
                importValue != null ? importValue : BigDecimal.ZERO,
                totalExports,
                exportValue != null ? exportValue : BigDecimal.ZERO
        );
    }

    // ==========================================
    // Helpers & Mappers
    // ==========================================

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElse(null);
    }

    private String generateItemCode(ItemCategory category) {
        String prefix = switch (category != null ? category : ItemCategory.KHAC) {
            case NHOM -> "NHOM";
            case KINH -> "KINH";
            case PHU_KIEN -> "PK";
            case VAT_TU_PHU -> "VTP";
            case KHAC -> "VT";
        };
        long count = itemRepository.count() + 1;
        return String.format("%s-%04d", prefix, count);
    }

    private String generateReceiptCode(ReceiptType type) {
        String prefix = (type == ReceiptType.IMPORT) ? "PN" : "PX";
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long seq = receiptRepository.count() + 1;
        return String.format("%s-%s-%03d", prefix, dateStr, seq);
    }

    private WarehouseItemResponse toItemResponse(WarehouseItem i) {
        BigDecimal totalValue = (i.getCurrentStock() != null && i.getCostPrice() != null)
                ? i.getCurrentStock().multiply(i.getCostPrice())
                : BigDecimal.ZERO;
        boolean isLowStock = i.getCurrentStock() != null && i.getMinStock() != null &&
                             i.getCurrentStock().compareTo(i.getMinStock()) <= 0;

        return new WarehouseItemResponse(
                i.getId(),
                i.getCode(),
                i.getName(),
                i.getCategory(),
                i.getUnit(),
                i.getCurrentStock(),
                i.getMinStock(),
                i.getCostPrice(),
                i.getSellingPrice(),
                totalValue,
                i.getLocation(),
                i.getNote(),
                isLowStock,
                i.getIsActive(),
                i.getCreatedAt(),
                i.getUpdatedAt()
        );
    }

    private WarehouseReceiptResponse toReceiptResponse(WarehouseReceipt r) {
        List<ReceiptItemResponse> items = r.getItems().stream()
                .map(item -> new ReceiptItemResponse(
                        item.getId(),
                        item.getItem().getId(),
                        item.getItem().getCode(),
                        item.getItem().getName(),
                        item.getItem().getUnit(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getTotalPrice(),
                        item.getNote()
                ))
                .toList();

        return new WarehouseReceiptResponse(
                r.getId(),
                r.getCode(),
                r.getType(),
                r.getReason(),
                r.getProject() != null ? r.getProject().getId() : null,
                r.getProject() != null ? r.getProject().getProjectCode() : null,
                r.getProject() != null ? r.getProject().getName() : null,
                r.getSupplierOrRecipient(),
                r.getReceiptDate(),
                r.getTotalAmount(),
                r.getNote(),
                r.getCreatedBy() != null ? r.getCreatedBy().getFullName() : null,
                r.getCreatedAt(),
                items
        );
    }

    private WarehouseTransactionResponse toTransactionResponse(WarehouseTransaction tx) {
        return new WarehouseTransactionResponse(
                tx.getId(),
                tx.getItem().getId(),
                tx.getItem().getCode(),
                tx.getItem().getName(),
                tx.getItem().getUnit(),
                tx.getReceipt() != null ? tx.getReceipt().getId() : null,
                tx.getReceipt() != null ? tx.getReceipt().getCode() : null,
                tx.getType(),
                tx.getQuantity(),
                tx.getStockBefore(),
                tx.getStockAfter(),
                tx.getTransactionDate(),
                tx.getNote()
        );
    }
}

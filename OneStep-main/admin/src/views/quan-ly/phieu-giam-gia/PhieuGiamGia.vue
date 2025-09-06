<template>
    <div class="voucher-admin">
        <div class="header">
            <h2>Quản lý phiếu giảm giá</h2>
        </div>
        <div class="filter-section">
            <h3>Bộ lọc tìm kiếm</h3>
            <div class="filter-box">
                <div class="filter-row">
                    <div class="filter-item">
                        <label><i class="fa fa-search"></i> Mã/Tên Phiếu</label>
                        <input type="text" placeholder="Tìm kiếm..." />
                    </div>
                    <div class="filter-item">
                        <label><i class="fa fa-toggle-on"></i> Trạng thái</label>
                        <select>
                            <option>Chọn trạng thái</option>
                            <option>Đang hoạt động</option>
                            <option>Hết hạn</option>
                        </select>
                    </div>
                    <div class="filter-item">
                        <label><i class="fa fa-percent"></i> Kiểu giảm</label>
                        <select>
                            <option>Chọn kiểu giảm</option>
                            <option>Phần trăm</option>
                            <option>Tiền mặt</option>
                        </select>
                    </div>
                    <div class="filter-item date-range">
                        <label><i class="fa fa-calendar"></i> Khoảng thời gian</label>
                        <div class="date-inputs">
                            <input type="date" />
                            <span> - </span>
                            <input type="date" />
                        </div>
                    </div>
                    <div class="filter-item filter-actions">
                        <button class="btn reset-btn"><i class="fa fa-undo"></i> Đặt lại</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="voucher-list-section">
            <div class="voucher-list-header">
                <h3>Danh sách phiếu giảm giá</h3>
                <div>
                    <span class="voucher-count"><i class="fa fa-ticket"></i> {{ vouchers.length }} phiếu giảm giá</span>
                    <button class="btn add-btn"><i class="fa fa-plus"></i> Thêm mới</button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="voucher-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã</th>
                            <th>Tên</th>
                            <th>Điều kiện</th>
                            <th>Giá trị</th>
                            <th>Số lượng</th>
                            <th>Bắt đầu</th>
                            <th>Kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="vouchers.length === 0">
                            <td colspan="10" class="no-data">
                                <div class="empty-state">
                                    <div class="empty-icon">🎫</div>
                                    <div class="empty-text">Chưa có phiếu giảm giá nào</div>
                                    <div class="empty-subtext">Nhấn "Thêm mới" để tạo phiếu giảm giá đầu tiên</div>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="(voucher, index) in vouchers" :key="voucher.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ voucher.ma }}</td>
                            <td>{{ voucher.ten }}</td>
                            <td>{{ formatCondition(voucher.dieuKien) }}</td>
                            <td>{{ formatValue(voucher.giaTri, voucher.loai) }}</td>
                            <td>{{ voucher.soLuong }}</td>
                            <td>{{ formatDate(voucher.ngayBatDau) }}</td>
                            <td>{{ formatDate(voucher.ngayKetThuc) }}</td>
                            <td><span :class="['status', getStatusClass(voucher.ngayKetThuc)]">{{ getStatusText(voucher.ngayKetThuc) }}</span></td>
                            <td>
                                <button class="action-btn edit" title="Sửa" @click="editVoucher(voucher)"><i class="fa fa-edit"></i></button>
                                <button class="action-btn delete" title="Xóa" @click="deleteVoucher(voucher.id)"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination">
  <button class="page-btn" disabled><i class="fa fa-angle-left"></i></button>
  <button class="page-btn active">1</button>
  <button class="page-btn">2</button>
  <button class="page-btn">3</button>
  <button class="page-btn"><i class="fa fa-angle-right"></i></button>
</div>

            </div>
        </div>
    </div>
</template>

<script src="./PhieuGiamGia.js"></script>

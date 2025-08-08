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
                    <span class="voucher-count"><i class="fa fa-ticket"></i> 10 phiếu giảm giá</span>
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
                        <tr>
                            <td>1</td>
                            <td>PGG005</td>
                            <td>Voucher thành viên VIP</td>
                            <td>3.000.000 đ</td>
                            <td>30%</td>
                            <td>25</td>
                            <td>2024-01-01<br />00:00:00</td>
                            <td>2024-12-31<br />00:00:00</td>
                            <td><span class="status active">Đang hoạt động</span></td>
                            <td>
                                <button class="action-btn edit" title="Sửa"><i class="fa fa-edit"></i></button>
                                <button class="action-btn delete" title="Xóa"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>PGG004</td>
                            <td>Giảm giá Black Friday</td>
                            <td>1.500.000 đ</td>
                            <td>25%</td>
                            <td>75</td>
                            <td>2024-11-24<br />00:00:00</td>
                            <td>2024-11-30<br />00:00:00</td>
                            <td><span class="status active">Đang hoạt động</span></td>
                            <td>
                                <button class="action-btn edit" title="Sửa"><i class="fa fa-edit"></i></button>
                                <button class="action-btn delete" title="Xóa"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>PGG003</td>
                            <td>Khuyến mãi cuối năm</td>
                            <td>2.000.000 đ</td>
                            <td>20%</td>
                            <td>200</td>
                            <td>2024-07-01<br />00:00:00</td>
                            <td>2024-07-31<br />00:00:00</td>
                            <td><span class="status active">Đang hoạt động</span></td>
                            <td>
                                <button class="action-btn edit" title="Sửa"><i class="fa fa-edit"></i></button>
                                <button class="action-btn delete" title="Xóa"><i class="fa fa-trash"></i></button>
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

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
    gap: 8px;
}
.page-btn {
    background: #f0f5ff;
    color: #1677ff;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
    transition: background 0.2s, color 0.2s;
}
.page-btn:hover {
    background: #1677ff;
    color: #fff;
}
.page-btn.active {
    background: #1677ff;
    color: #fff;
    font-weight: bold;
}
.page-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.voucher-admin {
    background: linear-gradient(135deg, #f8fafc 0%, #e6f0ff 100%);
    min-height: 100vh;
    padding: 32px 0;
    font-family: 'Segoe UI', Arial, sans-serif;
}
.header {
    margin-bottom: 24px;
    text-align: center;
}
.header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1677ff;
    letter-spacing: 1px;
}
.filter-section {
    background: #fff;
    border-radius: 12px;
    padding: 24px 32px;
    margin: 0 auto 32px auto;
    box-shadow: 0 4px 24px rgba(22,119,255,0.07);
    max-width: 1100px;
}
.filter-section h3 {
    font-size: 1.1rem;
    margin-bottom: 18px;
    font-weight: 600;
    color: #1677ff;
}
.filter-box {
    display: flex;
    flex-direction: column;
}
.filter-row {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
}
.filter-item {
    display: flex;
    flex-direction: column;
    min-width: 180px;
    margin-bottom: 0;
}
.filter-item label {
    font-size: 14px;
    margin-bottom: 6px;
    color: #555;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
}
.filter-item input,
.filter-item select {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    font-size: 15px;
    background: #f7faff;
    transition: border 0.2s;
}
.filter-item input:focus,
.filter-item select:focus {
    border: 1.5px solid #1677ff;
    outline: none;
    background: #fff;
}
.filter-item span {
    margin: 0 4px;
    align-self: center;
}
.date-range .date-inputs {
    display: flex;
    align-items: center;
    gap: 6px;
}
.filter-actions {
    display: flex;
    align-items: flex-end;
    min-width: 120px;
}
.btn {
    background: linear-gradient(90deg, #1677ff 60%, #52c41a 100%);
    color: #fff;
    border: none;
    padding: 9px 22px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(22,119,255,0.08);
    transition: background 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    gap: 7px;
}
.btn:hover {
    background: linear-gradient(90deg, #52c41a 60%, #1677ff 100%);
    box-shadow: 0 4px 16px rgba(22,119,255,0.13);
}
.btn.add-btn {
    background: linear-gradient(90deg, #52c41a 60%, #1677ff 100%);
    margin-left: 16px;
    padding: 9px 20px;
}
.btn.add-btn:hover {
    background: linear-gradient(90deg, #1677ff 60%, #52c41a 100%);
}
.btn.reset-btn {
    background: #f0f5ff;
    color: #1677ff;
    border: 1px solid #1677ff;
    font-weight: 500;
    transition: background 0.2s, color 0.2s;
}
.btn.reset-btn:hover {
    background: #e6f7ff;
    color: #52c41a;
}
.voucher-list-section {
    background: #fff;
    border-radius: 12px;
    padding: 28px 32px;
    box-shadow: 0 4px 24px rgba(22,119,255,0.07);
    max-width: 1100px;
    margin: 0 auto;
}
.voucher-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
}
.voucher-list-header h3 {
    font-size: 1.1rem;
    color: #1677ff;
    font-weight: 600;
    margin: 0;
}
.voucher-count {
    font-size: 15px;
    color: #555;
    margin-right: 18px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}
.table-responsive {
    overflow-x: auto;
}
.voucher-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(22,119,255,0.04);
}
.voucher-table th, .voucher-table td {
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 12px;
    text-align: center;
    font-size: 15px;
    vertical-align: middle;
}
.voucher-table th {
    background: #f0f5ff;
    font-weight: 700;
    color: #1677ff;
    border-top: none;
}
.voucher-table tr:last-child td {
    border-bottom: none;
}
.status.active {
    background: #e6fffb;
    color: #13c2c2;
    padding: 4px 14px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    display: inline-block;
    box-shadow: 0 1px 4px rgba(19,194,194,0.07);
}
.action-btn {
    background: #f0f5ff;
    border: none;
    border-radius: 5px;
    margin: 0 2px;
    padding: 7px 10px;
    cursor: pointer;
    color: #1677ff;
    font-size: 17px;
    transition: background 0.2s, color 0.2s;
}
.action-btn.edit:hover {
    background: #e6fffb;
    color: #13c2c2;
}
.action-btn.delete {
    background: #fff1f0;
    color: #ff4d4f;
}
.action-btn.delete:hover {
    background: #fff0f6;
    color: #d4380d;
}
@media (max-width: 900px) {
    .filter-row {
        flex-direction: column;
        gap: 12px;
    }
    .voucher-list-section, .filter-section {
        padding: 16px 6px;
    }
}
</style>
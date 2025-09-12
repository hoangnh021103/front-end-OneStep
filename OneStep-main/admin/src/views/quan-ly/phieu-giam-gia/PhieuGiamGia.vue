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
                        <input v-model="search" type="text" placeholder="Tìm kiếm..." />
                    </div>
                    <div class="filter-item">
                        <label><i class="fa fa-toggle-on"></i> Trạng thái</label>
                        <select v-model="status">
                            <option value="">Chọn trạng thái</option>
                            <option value="Đang hoạt động">Đang hoạt động</option>
                            <option value="Hết hạn">Hết hạn</option>
                        </select>
                    </div>
                    <div class="filter-item">
                        <label><i class="fa fa-percent"></i> Kiểu giảm</label>
                        <select v-model="discountType">
                            <option value="">Chọn kiểu giảm</option>
                            <option :value="0">Phần trăm</option>
                            <option :value="1">Tiền mặt</option>
                        </select>
                    </div>
                    <div class="filter-item date-range">
                        <label><i class="fa fa-calendar"></i> Khoảng thời gian</label>
                        <div class="date-inputs">
                            <input v-model="fromDate" type="date" />
                            <span> - </span>
                            <input v-model="toDate" type="date" />
                        </div>
                    </div>
                    <div class="filter-item filter-actions">
                        <button class="btn reset-btn" @click="resetFilters"><i class="fa fa-undo"></i> Đặt lại</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="voucher-list-section">
            <div class="voucher-list-header">
                <h3>Danh sách phiếu giảm giá</h3>
                <div>
                    <button class="btn add-btn" @click="$router.push({ name: 'ThemPhieuGiamGia' })"><i class="fa fa-plus"></i> Thêm mới</button>
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
                        <tr v-if="filteredVouchers.length === 0">
                            <td colspan="10" class="no-data">
                                <div class="empty-state">
                                    <div class="empty-icon">🎫</div>
                                    <div class="empty-text">Chưa có phiếu giảm giá nào</div>
                                    <div class="empty-subtext">Nhấn "Thêm mới" để tạo phiếu giảm giá đầu tiên</div>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="(voucher, index) in pagedVouchers" :key="voucher.id">
                            <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
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
                    <button :disabled="currentPage === 1" @click="currentPage--" class="page-btn"><i class="fa fa-angle-left"></i></button>
                    <button v-for="p in totalPages" :key="p" :class="['page-btn', { active: p === currentPage }]" @click="currentPage = p">{{ p }}</button>
                    <button :disabled="currentPage === totalPages" @click="currentPage++" class="page-btn"><i class="fa fa-angle-right"></i></button>
                    <select v-model.number="pageSize" @change="currentPage = 1">
                        <option :value="5">5 / page</option>
                        <option :value="10">10 / page</option>
                        <option :value="20">20 / page</option>
                    </select>
                </div>

            </div>
        </div>


    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      vouchers: [],
      search: "",
      status: "",
      discountType: "",
      fromDate: "",
      toDate: "",
      isLoading: false,
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    filteredVouchers() {
      const keyword = this.search.toLowerCase();
      return this.vouchers.filter(
        v =>
          ((v.ma && v.ma.toLowerCase().includes(keyword)) ||
          (v.ten && v.ten.toLowerCase().includes(keyword))) &&
          (this.status === "" || this.getStatusText(v.ngayKetThuc) === this.status) &&
          (this.discountType === "" || v.loai == this.discountType) &&
          (this.fromDate === "" || v.ngayBatDau >= this.fromDate) &&
          (this.toDate === "" || v.ngayKetThuc <= this.toDate)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredVouchers.length / this.pageSize) || 1;
    },
    pagedVouchers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredVouchers.slice(start, start + this.pageSize);
    }
  },
  methods: {
    async fetchVouchers() {
      try {
        this.isLoading = true;
        const res = await axios.get("http://localhost:8080/voucher/hien-thi");
        this.vouchers = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu phiếu giảm giá:", err);
        toast.error("Không thể tải dữ liệu phiếu giảm giá. Vui lòng thử lại sau.");
      } finally {
        this.isLoading = false;
      }
    },
    resetFilters() {
      this.search = "";
      this.status = "";
      this.discountType = "";
      this.fromDate = "";
      this.toDate = "";
      this.currentPage = 1;
      this.fetchVouchers();
    },
    editVoucher(voucher) {
      this.$router.push({ name: 'SuaPhieuGiamGia', params: { id: voucher.id } });
    },
    async deleteVoucher(id) {
      if (confirm("Xác nhận xoá phiếu giảm giá này?")) {
        try {
          this.isLoading = true;
          await axios.delete(`http://localhost:8080/voucher/delete/${id}`);
          this.fetchVouchers();
          toast.success("Xóa phiếu giảm giá thành công!");
        } catch (error) {
          toast.error("Lỗi khi xóa phiếu giảm giá:", error);
          toast.error("Có lỗi xảy ra khi xóa phiếu giảm giá!");
        } finally {
          this.isLoading = false;
        }
      }
    },
    // Helper methods để format dữ liệu hiển thị
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    },
    formatCondition(dieuKien) {
      return `Đơn hàng tối thiểu ${dieuKien.toLocaleString('vi-VN')}đ`;
    },
    formatValue(giaTri, loai) {
      if (loai === 0) {
        return `${giaTri}%`;
      } else {
        return `${giaTri.toLocaleString('vi-VN')}đ`;
      }
    },
    getStatusText(ngayKetThuc) {
      const today = new Date();
      const endDate = new Date(ngayKetThuc);
      return endDate >= today ? 'Đang hoạt động' : 'Hết hạn';
    },
    getStatusClass(ngayKetThuc) {
      const today = new Date();
      const endDate = new Date(ngayKetThuc);
      return endDate >= today ? 'active' : 'inactive';
    }
  },
  mounted() {
    this.fetchVouchers();
  }
};
</script>

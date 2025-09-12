<template>
    <div class="discount-container">
        <header class="header">
            <h2>Quản lý đợt giảm giá</h2>
            <div class="filters">
                <input v-model="search" type="text" class="search-input"
                    placeholder="Nhập tên sản phẩm hoặc voucher để tìm kiếm.." />
                <button class="reset-btn" @click="resetFilters">Đặt lại bộ lọc</button>
            </div>
            <button class="add-btn" @click="openAddModal"><i class="fa fa-plus"></i> Thêm mới đợt giảm giá</button>
        </header>

        <div class="table-wrapper">
            <p class="table-info">{{ filteredDiscounts.length }} đợt giảm giá</p>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Sản phẩm</th>
                        <th>Voucher</th>
                        <th>Ngày cập nhật</th>
                        <th>Người tạo</th>
                        <th>Người cập nhật</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredDiscounts.length === 0">
                        <td colspan="7" class="no-data">
                            <div class="empty-state">
                                <div class="empty-icon"><i class="fa fa-percent"></i></div>
                                <div class="empty-text">Chưa có đợt giảm giá nào</div>
                                <div class="empty-subtext">Nhấn "Thêm mới đợt giảm giá" để tạo đợt giảm giá đầu tiên</div>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(discount, index) in paginatedDiscounts" :key="discount.id">
                        <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
                        <td>{{ discount.tenSanPham }}</td>
                        <td>{{ discount.tenVoucher }}</td>
                        <td>{{ formatDate(discount.ngayCapNhat) }}</td>
                        <td>{{ discount.nguoiTao }}</td>
                        <td>{{ discount.nguoiCapNhat }}</td>
                        <td class="action-buttons">
                            <button class="edit-btn" @click="openEditModal(discount)" title="Sửa">✏️</button>
                            <button class="delete-btn" @click="deleteDiscount(discount.id)" title="Xóa">🗑️</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Phân trang -->
            <div class="pagination">
                <button :disabled="currentPage === 1" @click="currentPage--">‹</button>
                <span v-for="p in totalPages" :key="p" :class="['page', { active: p === currentPage }]"
                    @click="currentPage = p">
                    {{ p }}
                </span>
                <button :disabled="currentPage === totalPages" @click="currentPage++">›</button>
                <select v-model.number="pageSize" @change="currentPage = 1">
                    <option :value="5">5 / page</option>
                    <option :value="10">10 / page</option>
                    <option :value="20">20 / page</option>
                </select>
            </div>
        </div>

        <!-- Modal thêm/sửa -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal">
                <h3>{{ editingId ? "Sửa đợt giảm giá" : "Thêm mới đợt giảm giá" }}</h3>
                <form @submit.prevent="saveDiscount">
                    <div class="form-group">
                        <label>Sản phẩm ID:</label>
                        <input v-model.number="form.sanPhamId" type="number" min="1" required />
                    </div>
                    <div class="form-group">
                        <label>Tên sản phẩm:</label>
                        <input v-model="form.tenSanPham" required />
                    </div>
                    <div class="form-group">
                        <label>Voucher ID:</label>
                        <input v-model.number="form.voucherId" type="number" min="1" required />
                    </div>
                    <div class="form-group">
                        <label>Tên voucher:</label>
                        <input v-model="form.tenVoucher" required />
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="save-btn" :disabled="isLoading">
                            {{ isLoading ? 'Đang xử lý...' : 'Lưu' }}
                        </button>
                        <button type="button" class="cancel-btn" @click="closeModal" :disabled="isLoading">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      discounts: [],
      search: "",
      showModal: false,
      editingId: null,
      isLoading: false,
      form: {
        id: 0,
        sanPhamId: 0,
        tenSanPham: "",
        voucherId: 0,
        tenVoucher: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      },
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    filteredDiscounts() {
      const keyword = this.search.toLowerCase();
      return this.discounts.filter(d => {
        const matchesSearch = (d.tenSanPham && d.tenSanPham.toLowerCase().includes(keyword)) ||
                             (d.tenVoucher && d.tenVoucher.toLowerCase().includes(keyword));
        return matchesSearch;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredDiscounts.length / this.pageSize) || 1;
    },
    paginatedDiscounts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredDiscounts.slice(start, start + this.pageSize);
    }
  },
  methods: {
    async fetchDiscounts() {
      try {
        this.isLoading = true;
        const res = await axios.get("http://localhost:8080/san-pham-khuyen-mai/hien-thi");
        this.discounts = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu đợt giảm giá:", err);
        alert("Không thể tải dữ liệu đợt giảm giá. Vui lòng thử lại sau.");
      } finally {
        this.isLoading = false;
      }
    },
    resetFilters() {
      this.search = "";
      this.currentPage = 1;
      this.fetchDiscounts();
    },
    openAddModal() {
      this.editingId = null;
      this.resetForm();
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async saveDiscount() {
      // Validation
      if (!this.form.sanPhamId || this.form.sanPhamId <= 0) {
        alert("Vui lòng nhập ID sản phẩm hợp lệ.");
        return;
      }
      if (!this.form.tenSanPham.trim()) {
        alert("Vui lòng nhập tên sản phẩm.");
        return;
      }
      if (!this.form.voucherId || this.form.voucherId <= 0) {
        alert("Vui lòng nhập ID voucher hợp lệ.");
        return;
      }
      if (!this.form.tenVoucher.trim()) {
        alert("Vui lòng nhập tên voucher.");
        return;
      }

      try {
        this.isLoading = true;
        
        if (this.editingId) {
          // Cập nhật đợt giảm giá
          await axios.put(`http://localhost:8080/san-pham-khuyen-mai/update/${this.editingId}`, this.form);
          alert("Cập nhật đợt giảm giá thành công!");
        } else {
          // Thêm mới đợt giảm giá
          await axios.post("http://localhost:8080/san-pham-khuyen-mai/add", this.form);
          alert("Thêm đợt giảm giá thành công!");
        }
        
        this.closeModal();
        this.fetchDiscounts(); // Refresh danh sách
      } catch (error) {
        console.error("Lỗi khi lưu đợt giảm giá:", error);
        alert("Có lỗi xảy ra khi lưu đợt giảm giá!");
      } finally {
        this.isLoading = false;
      }
    },
    openEditModal(discount) {
      this.editingId = discount.id;
      this.form = { ...discount };
      this.showModal = true;
    },
    async deleteDiscount(id) {
      if (confirm("Xác nhận xoá đợt giảm giá này?")) {
        try {
          this.isLoading = true;
          await axios.delete(`http://localhost:8080/san-pham-khuyen-mai/delete/${id}`);
          this.fetchDiscounts(); // Refresh danh sách sau khi xóa
          alert("Xóa đợt giảm giá thành công!");
        } catch (error) {
          console.error("Lỗi khi xóa đợt giảm giá:", error);
          alert("Có lỗi xảy ra khi xóa đợt giảm giá!");
        } finally {
          this.isLoading = false;
        }
      }
    },
    // Helper method để format ngày tháng
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    },
    // Helper method để reset form
    resetForm() {
      this.form = {
        id: 0,
        sanPhamId: 0,
        tenSanPham: "",
        voucherId: 0,
        tenVoucher: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    }
  },
  mounted() {
    this.fetchDiscounts();
  }
};
</script>

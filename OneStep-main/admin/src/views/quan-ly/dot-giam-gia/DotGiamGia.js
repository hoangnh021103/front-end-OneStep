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
          await axios.put(`http://localhost:8080/san-pham-khuyen-mai/cap-nhat/${this.editingId}`, this.form);
          alert("Cập nhật đợt giảm giá thành công!");
        } else {
          // Thêm mới đợt giảm giá
          await axios.post("http://localhost:8080/san-pham-khuyen-mai/them", this.form);
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
          await axios.delete(`http://localhost:8080/san-pham-khuyen-mai/xoa/${id}`);
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

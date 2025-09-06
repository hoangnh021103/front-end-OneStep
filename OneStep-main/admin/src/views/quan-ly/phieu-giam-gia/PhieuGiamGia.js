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
      showModal: false,
      newVoucher: {
        id: 0,
        ma: "",
        ten: "",
        loai: 0,
        giaTri: 0,
        dieuKien: 0,
        soLuong: 0,
        ngayBatDau: "",
        ngayKetThuc: "",
        duongDanAnh: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      },
      editIndex: null,
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
        const res = await axios.get("http://localhost:8080/voucher/hien-thi");
        this.vouchers = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
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
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newVoucher = {
        id: 0,
        ma: "",
        ten: "",
        loai: 0,
        giaTri: 0,
        dieuKien: 0,
        soLuong: 0,
        ngayBatDau: "",
        ngayKetThuc: "",
        duongDanAnh: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveVoucher() {
      if (!this.newVoucher.ma) {
        alert("Vui lòng nhập mã phiếu giảm giá.");
        return;
      }
      if (!this.newVoucher.ten) {
        alert("Vui lòng nhập tên phiếu giảm giá.");
        return;
      }
      if (!this.newVoucher.dieuKien) {
        alert("Vui lòng nhập điều kiện.");
        return;
      }
      if (!this.newVoucher.giaTri) {
        alert("Vui lòng nhập giá trị giảm.");
        return;
      }
      if (!this.newVoucher.soLuong) {
        alert("Vui lòng nhập số lượng.");
        return;
      }
      if (!this.newVoucher.ngayBatDau) {
        alert("Vui lòng chọn ngày bắt đầu.");
        return;
      }
      if (!this.newVoucher.ngayKetThuc) {
        alert("Vui lòng chọn ngày kết thúc.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editVoucher(voucher) {
      this.editIndex = voucher.id;
      this.newVoucher = { ...voucher };
      this.showModal = true;
    },
    async deleteVoucher(id) {
      if (confirm("Xác nhận xoá phiếu giảm giá này?")) {
        try {
          await axios.delete(`http://localhost:8080/voucher/xoa/${id}`);
          this.fetchVouchers(); // Refresh danh sách sau khi xóa
          alert("Xóa phiếu giảm giá thành công!");
        } catch (error) {
          console.error("Lỗi khi xóa phiếu giảm giá:", error);
          alert("Có lỗi xảy ra khi xóa phiếu giảm giá!");
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

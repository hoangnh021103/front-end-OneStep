import axios from "axios";
export default {
  data() {
    return {
      employees: [],
      search: "",
      genderFilter: "",
      showModal: false,
      editEmployee: null,
      modalData: {
        id: 0,
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        urlAnh: "",
        vaiTroId: 0,
        ngayTao: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      },
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    filteredEmployees() {
      const keyword = this.search.toLowerCase();
      return this.employees.filter(
        e =>
          (e.hoTen && e.hoTen.toLowerCase().includes(keyword)) ||
          (e.email && e.email.toLowerCase().includes(keyword)) ||
          (e.soDienThoai && e.soDienThoai.includes(keyword)) &&
          (this.genderFilter === "" || e.gioiTinh === this.genderFilter)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredEmployees.length / this.pageSize) || 1;
    },
    pagedEmployees() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredEmployees.slice(start, start + this.pageSize);
    },
    visiblePages() {
      let pages = [];
      let start = Math.max(1, this.currentPage - 1);
      let end = Math.min(this.totalPages, start + 1);
      if (end - start < 1) start = Math.max(1, end - 1);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    }
  },
  methods: {
    async fetchEmployees() {
      try {
        const res = await axios.get("http://localhost:8080/nhan-vien/hien-thi");
        this.employees = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    resetFilter() {
      this.search = "";
      this.genderFilter = "";
      this.currentPage = 1;
      this.fetchEmployees();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openAddModal() {
      this.editEmployee = null;
      this.modalData = {
        id: 0,
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        urlAnh: "",
        vaiTroId: 0,
        ngayTao: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveEmployee() {
      if (!this.modalData.hoTen) {
        alert("Vui lòng nhập họ và tên nhân viên.");
        return;
      }
      if (!this.modalData.email) {
        alert("Vui lòng nhập email.");
        return;
      }
      if (!this.modalData.soDienThoai) {
        alert("Vui lòng nhập số điện thoại.");
        return;
      }
      if (!this.modalData.gioiTinh) {
        alert("Vui lòng chọn giới tính.");
        return;
      }
      if (!this.modalData.vaiTroId || this.modalData.vaiTroId === 0) {
        alert("Vui lòng chọn vai trò.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    openEditModal(emp) {
      this.editEmployee = emp;
      this.modalData = { ...emp };
      this.showModal = true;
    },
    async deleteEmployee(id) {
      if (confirm("Xác nhận xoá nhân viên này?")) {
        try {
          await axios.delete(`http://localhost:8080/nhan-vien/xoa/${id}`);
          this.fetchEmployees(); // Refresh danh sách sau khi xóa
          alert("Xóa nhân viên thành công!");
        } catch (error) {
          console.error("Lỗi khi xóa nhân viên:", error);
          alert("Có lỗi xảy ra khi xóa nhân viên!");
        }
      }
    },
    // Helper methods để format dữ liệu hiển thị
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    },
    getRoleName(vaiTroId) {
      const roles = {
        0: 'Chưa xác định',
        1: 'Quản lý',
        2: 'Nhân viên',
        3: 'Thực tập sinh'
      };
      return roles[vaiTroId] || 'Chưa xác định';
    }
  },
  watch: {
    filteredEmployees() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    },
    pageSize() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchEmployees();
  }
};

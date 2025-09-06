import axios from "axios";
export default {
  data() {
    return {
      customers: [],
      search: "",
      genderFilter: "",
      showModal: false,
      newCustomer: {
        id: 0,
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        email: "",
        soDienThoai: "",
        urlAnh: "",
        ngayTao: "",
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
    filteredCustomers() {
      const keyword = this.search.toLowerCase();
      return this.customers.filter(
        c =>
          (c.hoTen && c.hoTen.toLowerCase().includes(keyword)) ||
          (c.email && c.email.toLowerCase().includes(keyword)) ||
          (c.soDienThoai && c.soDienThoai.includes(keyword)) &&
          (this.genderFilter === "" || c.gioiTinh === this.genderFilter)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredCustomers.length / this.pageSize) || 1;
    },
    pagedCustomers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredCustomers.slice(start, start + this.pageSize);
    },
    visiblePages() {
      let pages = [];
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + 4);
      if (end - start < 4) start = Math.max(1, end - 4);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    }
  },
  methods: {
    async fetchCustomers() {
      try {
        console.log("Đang gọi API khách hàng...");
        const res = await axios.get("http://localhost:8080/khach-hang/hien-thi");
        console.log("Response từ API:", res.data);
        
        // Xử lý dữ liệu từ API
        this.customers = Array.isArray(res.data) ? res.data : res.data.data || [];
        
        console.log("Dữ liệu khách hàng đã load:", this.customers);
        
      } catch (err) {
        console.error("Lỗi khi gọi API khách hàng:", err);
        this.customers = [];
        
        let errorMessage = "Không thể tải dữ liệu khách hàng.";
        
        if (err.code === 'ECONNREFUSED') {
          errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra xem server có đang chạy không.";
        } else if (err.response?.status === 404) {
          errorMessage = "API endpoint không tồn tại. Vui lòng kiểm tra đường dẫn API.";
        } else if (err.response?.status === 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau.";
        }
        
        alert(errorMessage);
      }
    },
    resetFilter() {
      this.search = "";
      this.genderFilter = "";
      this.currentPage = 1;
      this.fetchCustomers();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newCustomer = {
        id: 0,
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        email: "",
        soDienThoai: "",
        urlAnh: "",
        ngayTao: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveCustomer() {
      if (!this.newCustomer.hoTen) {
        alert("Vui lòng nhập họ và tên khách hàng.");
        return;
      }
      if (!this.newCustomer.email) {
        alert("Vui lòng nhập email khách hàng.");
        return;
      }
      if (!this.newCustomer.soDienThoai) {
        alert("Vui lòng nhập số điện thoại khách hàng.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editCustomer(customer) {
      this.editIndex = customer.id;
      this.newCustomer = { ...customer };
      this.showModal = true;
    },
    async deleteCustomer(id) {
      if (confirm("Xác nhận xoá khách hàng này?")) {
        try {
          await axios.delete(`http://localhost:8080/khach-hang/xoa/${id}`);
          this.fetchCustomers(); // Refresh danh sách sau khi xóa
          alert("Xóa khách hàng thành công!");
        } catch (error) {
          console.error("Lỗi khi xóa khách hàng:", error);
          alert("Có lỗi xảy ra khi xóa khách hàng!");
        }
      }
    },
    openAddModal() {
      this.openModal();
    },
    openEditModal(customer) {
      this.editCustomer(customer);
    },
    // Helper method để format ngày tháng
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    }
  },
  watch: {
    filteredCustomers() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    },
    pageSize() {
      this.currentPage = 1;
    }
  },
  mounted() {
    console.log("Component mounted, fetching customers...");
    this.fetchCustomers();
  }
};

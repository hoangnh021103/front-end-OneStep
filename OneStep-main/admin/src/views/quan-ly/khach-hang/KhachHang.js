import axios from "axios";
export default {
  data() {
    return {
      customers: [],
      search: "",
      status: "",
      showModal: false,
      newCustomer: {
        ten: "",
        trangThai: 1,
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
          (c.ten && c.ten.toLowerCase().includes(keyword)) &&
          (this.status === "" || c.trangThai == this.status)
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
        if (Array.isArray(res.data)) {
          this.customers = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          this.customers = res.data.data;
        } else {
          this.customers = [];
        }
        
        console.log("Dữ liệu khách hàng đã load:", this.customers);
      } catch (err) {
        console.error("Lỗi khi gọi API khách hàng:", err);
        alert("Không thể tải dữ liệu khách hàng. Vui lòng kiểm tra kết nối API.");
        this.customers = [];
      }
    },
    resetFilter() {
      this.search = "";
      this.status = "";
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
        ten: "",
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveCustomer() {
      if (!this.newCustomer.ten) {
        alert("Vui lòng nhập tên khách hàng.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editCustomer(index) {
      this.editIndex = index;
      this.newCustomer = { ...this.customers[index] };
      this.showModal = true;
    },
    deleteCustomer(index) {
      if (confirm("Xác nhận xoá khách hàng này?")) {
        // Gọi API xoá ở đây nếu cần
        this.customers.splice(index, 1);
      }
    },
    openAddModal() {
      this.openModal();
    },
    openEditModal(customer) {
      const index = this.customers.findIndex(c => c.id === customer.id);
      if (index !== -1) {
        this.editCustomer(index);
      }
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
    this.fetchCustomers();
  }
};

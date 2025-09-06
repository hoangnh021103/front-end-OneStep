import axios from "axios";
export default {
  data() {
    return {
      employees: [],
      search: "",
      status: "",
      showModal: false,
      newEmployee: {
        code: "",
        name: "",
        email: "",
        phone: "",
        joinDate: "",
        status: "active",
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
    filteredEmployees() {
      const keyword = this.search.toLowerCase();
      return this.employees.filter(
        e =>
          (e.name && e.name.toLowerCase().includes(keyword)) ||
          (e.code && e.code.toLowerCase().includes(keyword)) &&
          (this.status === "" || e.status === this.status)
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
      this.status = "";
      this.fetchEmployees();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newEmployee = {
        code: "",
        name: "",
        email: "",
        phone: "",
        joinDate: "",
        status: "active",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveEmployee() {
      if (!this.newEmployee.code) {
        alert("Vui lòng nhập mã nhân viên.");
        return;
      }
      if (!this.newEmployee.name) {
        alert("Vui lòng nhập tên nhân viên.");
        return;
      }
      if (!this.newEmployee.email) {
        alert("Vui lòng nhập email.");
        return;
      }
      if (!this.newEmployee.phone) {
        alert("Vui lòng nhập số điện thoại.");
        return;
      }
      if (!this.newEmployee.joinDate) {
        alert("Vui lòng nhập ngày tham gia.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editEmployee(index) {
      this.editIndex = index;
      this.newEmployee = { ...this.employees[index] };
      this.showModal = true;
    },
    deleteEmployee(index) {
      if (confirm("Xác nhận xoá nhân viên này?")) {
        // Gọi API xoá ở đây nếu cần
        this.employees.splice(index, 1);
      }
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

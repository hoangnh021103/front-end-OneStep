import axios from "axios";
export default {
  data() {
    return {
      customers: [],
      search: "",
      status: "",
      showModal: false,
      newCustomer: {
        code: "",
        name: "",
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
    filteredCustomers() {
      const keyword = this.search.toLowerCase();
      return this.customers.filter(
        c =>
          (c.name && c.name.toLowerCase().includes(keyword)) ||
          (c.code && c.code.toLowerCase().includes(keyword)) &&
          (this.status === "" || c.status === this.status)
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
        const res = await axios.get("http://localhost:8080/khach-hang/hien-thi");
        this.customers = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
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
        code: "",
        name: "",
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
    saveCustomer() {
      if (!this.newCustomer.code) {
        alert("Vui lòng nhập mã khách hàng.");
        return;
      }
      if (!this.newCustomer.name) {
        alert("Vui lòng nhập tên khách hàng.");
        return;
      }
      if (!this.newCustomer.phone) {
        alert("Vui lòng nhập số điện thoại.");
        return;
      }
      if (!this.newCustomer.joinDate) {
        alert("Vui lòng nhập ngày tham gia.");
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

import axios from "axios";
export default {
  data() {
    return {
      invoices: [],
      search: "",
      fromDate: "",
      toDate: "",
      tab: "all",
      showModal: false,
      newInvoice: {
        code: "",
        customerName: "",
        customerPhone: "",
        type: "OFFLINE",
        staffCode: "",
        staffName: "",
        total: "",
        createdAt: "",
        status: "pending",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      },
      editIndex: null
    };
  },
  computed: {
    filteredInvoices() {
      return this.invoices
        .filter(inv => {
          const matchSearch = this.search === "" ||
            inv.customerName.toLowerCase().includes(this.search.toLowerCase()) ||
            inv.customerPhone.includes(this.search) ||
            inv.staffName.toLowerCase().includes(this.search.toLowerCase());
          const matchFrom = !this.fromDate || inv.createdAt >= this.fromDate;
          const matchTo = !this.toDate || inv.createdAt <= this.toDate;
          return matchSearch && matchFrom && matchTo;
        })
        .map(inv => ({
          ...inv,
          statusLabel: this.statusLabel(inv.status),
          statusClass: inv.status
        }));
    },
    tabInvoices() {
      if (this.tab === "all") return this.filteredInvoices;
      return this.filteredInvoices.filter(inv => inv.status === this.tab);
    }
  },
  methods: {
    async fetchInvoices() {
      try {
        const res = await axios.get("http://localhost:8080/hoa-don/hien-thi");
        this.invoices = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    resetFilter() {
      this.search = "";
      this.fromDate = "";
      this.toDate = "";
      this.fetchInvoices();
    },
    countByStatus(status) {
      return this.filteredInvoices.filter(inv => inv.status === status).length;
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("vi-VN");
    },
    statusLabel(status) {
      switch (status) {
        case "pending": return "Chờ xác nhận";
        case "confirmed": return "Đã xác nhận";
        case "shipping": return "Chờ giao";
        case "delivering": return "Đang giao";
        case "done": return "Hoàn thành";
        case "cancel": return "Đã hủy";
        default: return "";
      }
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newInvoice = {
        code: "",
        customerName: "",
        customerPhone: "",
        type: "OFFLINE",
        staffCode: "",
        staffName: "",
        total: "",
        createdAt: "",
        status: "pending",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveInvoice() {
      if (!this.newInvoice.code) {
        alert("Vui lòng nhập mã hóa đơn.");
        return;
      }
      if (!this.newInvoice.customerName) {
        alert("Vui lòng nhập tên khách hàng.");
        return;
      }
      if (!this.newInvoice.customerPhone) {
        alert("Vui lòng nhập số điện thoại khách hàng.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editInvoice(index) {
      this.editIndex = index;
      this.newInvoice = { ...this.invoices[index] };
      this.showModal = true;
    },
    deleteInvoice(index) {
      if (confirm("Xác nhận xoá hóa đơn này?")) {
        // Gọi API xoá ở đây nếu cần
        this.invoices.splice(index, 1);
      }
    }
  },
  mounted() {
    this.fetchInvoices();
  }
};

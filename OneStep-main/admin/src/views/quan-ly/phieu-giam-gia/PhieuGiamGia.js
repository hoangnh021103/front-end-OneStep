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
        code: "",
        name: "",
        condition: "",
        value: "",
        quantity: "",
        startDate: "",
        endDate: "",
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
    filteredVouchers() {
      const keyword = this.search.toLowerCase();
      return this.vouchers.filter(
        v =>
          (v.code && v.code.toLowerCase().includes(keyword)) ||
          (v.name && v.name.toLowerCase().includes(keyword)) &&
          (this.status === "" || v.status === this.status) &&
          (this.discountType === "" || v.discountType === this.discountType) &&
          (this.fromDate === "" || v.startDate >= this.fromDate) &&
          (this.toDate === "" || v.endDate <= this.toDate)
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
        code: "",
        name: "",
        condition: "",
        value: "",
        quantity: "",
        startDate: "",
        endDate: "",
        status: "active",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveVoucher() {
      if (!this.newVoucher.code) {
        alert("Vui lòng nhập mã phiếu giảm giá.");
        return;
      }
      if (!this.newVoucher.name) {
        alert("Vui lòng nhập tên phiếu giảm giá.");
        return;
      }
      if (!this.newVoucher.condition) {
        alert("Vui lòng nhập điều kiện.");
        return;
      }
      if (!this.newVoucher.value) {
        alert("Vui lòng nhập giá trị giảm.");
        return;
      }
      if (!this.newVoucher.quantity) {
        alert("Vui lòng nhập số lượng.");
        return;
      }
      if (!this.newVoucher.startDate) {
        alert("Vui lòng chọn ngày bắt đầu.");
        return;
      }
      if (!this.newVoucher.endDate) {
        alert("Vui lòng chọn ngày kết thúc.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editVoucher(index) {
      this.editIndex = index;
      this.newVoucher = { ...this.vouchers[index] };
      this.showModal = true;
    },
    deleteVoucher(index) {
      if (confirm("Xác nhận xoá phiếu giảm giá này?")) {
        // Gọi API xoá ở đây nếu cần
        this.vouchers.splice(index, 1);
      }
    }
  },
  mounted() {
    this.fetchVouchers();
  }
};

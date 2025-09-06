import axios from "axios";
export default {
  data() {
    return {
      discounts: [],
      search: "",
      status: "",
      showModal: false,
      newDiscount: {
        code: "",
        name: "",
        value: "",
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
    filteredDiscounts() {
      const keyword = this.search.toLowerCase();
      return this.discounts.filter(d => {
        const matchesSearch = (d.code && d.code.toLowerCase().includes(keyword)) ||
                             (d.name && d.name.toLowerCase().includes(keyword));
        const matchesStatus = this.status === "" || d.status === this.status;
        return matchesSearch && matchesStatus;
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
        const res = await axios.get("http://localhost:8080/dot-giam-gia/hien-thi");
        this.discounts = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    resetFilters() {
      this.search = "";
      this.status = "";
      this.currentPage = 1;
      this.fetchDiscounts();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newDiscount = {
        code: "",
        name: "",
        value: "",
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
    saveDiscount() {
      if (!this.newDiscount.code) {
        alert("Vui lòng nhập mã đợt giảm giá.");
        return;
      }
      if (!this.newDiscount.name) {
        alert("Vui lòng nhập tên đợt giảm giá.");
        return;
      }
      if (!this.newDiscount.value) {
        alert("Vui lòng nhập giá trị giảm.");
        return;
      }
      if (!this.newDiscount.startDate) {
        alert("Vui lòng chọn ngày bắt đầu.");
        return;
      }
      if (!this.newDiscount.endDate) {
        alert("Vui lòng chọn ngày kết thúc.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editDiscount(index) {
      this.editIndex = index;
      this.newDiscount = { ...this.discounts[index] };
      this.showModal = true;
    },
    deleteDiscount(index) {
      if (confirm("Xác nhận xoá đợt giảm giá này?")) {
        // Gọi API xoá ở đây nếu cần
        this.discounts.splice(index, 1);
      }
    }
  },
  mounted() {
    this.fetchDiscounts();
  }
};

import axios from "axios";
export default {
  data() {
    return {
      brands: [],
      search: "",
      status: "",
      showModal: false,
      newBrand: {
        ten: "",
        hinhAnh: "",
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      },
      editIndex: null
    };
  },
  computed: {
    filteredBrands() {
      const keyword = this.search.toLowerCase();
      return this.brands.filter(
        b =>
          (b.ten && b.ten.toLowerCase().includes(keyword)) &&
          (this.status === "" || b.trangThai == this.status)
      );
    }
  },
  methods: {
    async fetchBrands() {
      try {
        const res = await axios.get("http://localhost:8080/thuong-hieu/hien-thi");
        this.brands = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    resetFilters() {
      this.search = "";
      this.status = "";
      this.fetchBrands();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newBrand = {
        ten: "",
        hinhAnh: "",
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveBrand() {
      if (!this.newBrand.ten) {
        alert("Vui lòng nhập tên thương hiệu.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editBrand(index) {
      this.editIndex = index;
      this.newBrand = { ...this.brands[index] };
      this.showModal = true;
    },
    deleteBrand(index) {
      if (confirm("Xác nhận xoá thương hiệu này?")) {
        // Gọi API xoá ở đây nếu cần
        this.brands.splice(index, 1);
      }
    }
  },
  mounted() {
    this.fetchBrands();
  }
};

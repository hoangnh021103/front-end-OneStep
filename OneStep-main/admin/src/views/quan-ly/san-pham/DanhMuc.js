import axios from "axios";
export default {
  data() {
    return {
      categories: [],
      search: "",
      status: "",
      showModal: false,
      newCategory: {
        ten: "",
        ma: "",
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      },
      editIndex: null
    };
  },
  computed: {
    filteredCategories() {
      const keyword = this.search.toLowerCase();
      return this.categories.filter(
        c =>
          (c.ten && c.ten.toLowerCase().includes(keyword)) ||
          (c.ma && c.ma.toLowerCase().includes(keyword)) &&
          (this.status === "" || c.trangThai == this.status)
      );
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await axios.get("http://localhost:8080/danh-muc/hien-thi");
        this.categories = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    resetFilters() {
      this.search = "";
      this.status = "";
      this.fetchCategories();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newCategory = {
        ten: "",
        ma: "",
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveCategory() {
      if (!this.newCategory.ten) {
        alert("Vui lòng nhập tên danh mục.");
        return;
      }
      if (!this.newCategory.ma) {
        alert("Vui lòng nhập mã danh mục.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editCategory(index) {
      this.editIndex = index;
      this.newCategory = { ...this.categories[index] };
      this.showModal = true;
    },
    deleteCategory(index) {
      if (confirm("Xác nhận xoá danh mục này?")) {
        // Gọi API xoá ở đây nếu cần
        this.categories.splice(index, 1);
      }
    }
  },
  mounted() {
    this.fetchCategories();
  }
};

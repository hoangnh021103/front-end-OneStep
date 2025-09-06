import axios from "axios";
export default {
  data() {
    return {
      products: [],
      search: "",
      status: "",
      showModal: false,
      newProduct: {
        tenSanPham: "",
        moTa: "",
        duongDanAnh: "",
        trangThai: 1
      },
      editIndex: null
    };
  },
  computed: {
    filteredProducts() {
      const keyword = this.search.toLowerCase();
      return this.products.filter(
        p =>
          (p.tenSanPham && p.tenSanPham.toLowerCase().includes(keyword)) &&
          (this.status === "" || p.trangThai == this.status)
      );
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get("http://localhost:8080/san-pham/hien-thi");
        this.products = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    resetFilter() {
      this.search = "";
      this.status = "";
      this.fetchProducts();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newProduct = {
        tenSanPham: "",
        moTa: "",
        duongDanAnh: "",
        trangThai: 1
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveProduct() {
      if (!this.newProduct.tenSanPham) {
        alert("Vui lòng nhập tên sản phẩm.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editProduct(index) {
      this.editIndex = index;
      this.newProduct = { ...this.products[index] };
      this.showModal = true;
    },
    deleteProduct(index) {
      if (confirm("Xác nhận xoá sản phẩm này?")) {
        // Gọi API xoá ở đây nếu cần
        this.products.splice(index, 1);
      }
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
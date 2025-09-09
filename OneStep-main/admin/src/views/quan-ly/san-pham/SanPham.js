import { sanPhamApi } from '@/api/sanPhamApi';
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
        const data = await sanPhamApi.layDanhSachSanPham();
        this.products = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', err);
        alert('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
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
    async saveProduct() {
      if (!this.newProduct.tenSanPham) {
        alert("Vui lòng nhập tên sản phẩm.");
        return;
      }
      
      try {
        if (this.editIndex !== null) {
          // Cập nhật sản phẩm
          await sanPhamApi.capNhatSanPham(this.newProduct.id || this.newProduct.maSanPham, this.newProduct);
          alert('Cập nhật sản phẩm thành công!');
        } else {
          // Thêm sản phẩm mới
          await sanPhamApi.themSanPham(this.newProduct);
          alert('Thêm sản phẩm thành công!');
        }
        this.closeModal();
        this.fetchProducts(); // Tải lại danh sách
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'Không xác định';
        console.error('Lỗi khi lưu sản phẩm:', msg, err);
        alert(`Không thể lưu sản phẩm: ${msg}`);
      }
    },
    editProduct(index) {
      this.editIndex = index;
      this.newProduct = { ...this.products[index] };
      this.showModal = true;
    },
    async deleteProduct(index) {
      if (confirm("Xác nhận xoá sản phẩm này?")) {
        try {
          const product = this.products[index];
          await sanPhamApi.xoaSanPham(product.id || product.maSanPham);
          alert('Xóa sản phẩm thành công!');
          this.products.splice(index, 1);
        } catch (err) {
          console.error('Lỗi khi xóa sản phẩm:', err);
          alert('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
        }
      }
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
import axios from "axios";
export default {
  data() {
    return {
      products: [],
      search: "",
    };
  },
  computed: {
    filteredProducts() {
      if (!this.search) return this.products;
      const keyword = this.search.toLowerCase();
      return this.products.filter(
        (p) =>
          String(p.maSanPham).toLowerCase().includes(keyword) ||
          (p.tenSanPham && p.tenSanPham.toLowerCase().includes(keyword))
      );
    },
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
      this.fetchProducts();
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
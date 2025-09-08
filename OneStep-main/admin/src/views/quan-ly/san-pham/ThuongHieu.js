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
        trangThai: 1
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
        console.error("Lỗi khi tải danh sách thương hiệu:", err);
        alert("Có lỗi xảy ra khi tải danh sách thương hiệu!");
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
        trangThai: 1
      };
    },
    closeModal() {
      this.showModal = false;
      this.editIndex = null;
      this.newBrand = {
        ten: "",
        trangThai: 1
      };
    },
    async saveBrand() {
      if (!this.newBrand.ten) {
        alert("Vui lòng nhập tên thương hiệu.");
        return;
      }

      try {
        if (this.editIndex === null) {
          const res = await axios.post(
            "http://localhost:8080/thuong-hieu/add",
            this.newBrand
          );
          this.brands.push(res.data);
          alert("Thêm thương hiệu thành công!");
        } else {
          const brandId = this.brands[this.editIndex].id;
          const res = await axios.put(
            `http://localhost:8080/thuong-hieu/update/${brandId}`,
            this.newBrand
          );
          this.brands.splice(this.editIndex, 1, res.data);
          alert("Cập nhật thương hiệu thành công!");
        }
        this.closeModal();
      } catch (err) {
        console.error("Lỗi khi lưu thương hiệu:", err);
        alert("Có lỗi xảy ra khi lưu thương hiệu!");
      }
    },
    editBrand(index) {
      this.editIndex = index;
      this.newBrand = { ...this.brands[index] };
      this.showModal = true;
    },
    async deleteBrand(index) {
      const brand = this.brands[index];
      if (confirm("Xác nhận xoá thương hiệu này?")) {
        try {
          await axios.delete(
            `http://localhost:8080/thuong-hieu/delete/${brand.id}`
          );
          this.brands.splice(index, 1);
          alert("Xóa thương hiệu thành công!");
        } catch (err) {
          console.error("Lỗi khi xoá thương hiệu:", err);
          alert("Có lỗi xảy ra khi xoá thương hiệu!");
        }
      }
    }
  },
  mounted() {
    this.fetchBrands();
  }
};

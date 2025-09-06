import axios from "axios";
export default {
  data() {
    return {
      sizes: [],
      search: "",
      status: "",
      showModal: false,
      loading: false,
      error: null,
      success: null,
      newSize: {
        ten: "",
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      },
      editIndex: null,
      validationErrors: {}
    };
  },
  computed: {
    filteredSizes() {
      const keyword = this.search.toLowerCase();
      return this.sizes.filter(
        s =>
          (s.ten && s.ten.toLowerCase().includes(keyword)) &&
          (this.status === "" || s.trangThai == this.status)
      );
    }
  },
  methods: {
    async fetchSizes() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get("http://localhost:8080/kich-co/hien-thi");
        this.sizes = Array.isArray(res.data) ? res.data : res.data.data || [];
        this.success = "Tải dữ liệu thành công!";
        setTimeout(() => { this.success = null; }, 3000);
      } catch (err) {
        console.error(err);
        this.error = "Không thể tải dữ liệu. Vui lòng thử lại!";
        setTimeout(() => { this.error = null; }, 5000);
      } finally {
        this.loading = false;
      }
    },
    resetFilters() {
      this.search = "";
      this.status = "";
      this.fetchSizes();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.validationErrors = {};
      this.newSize = {
        ten: "",
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
      this.validationErrors = {};
    },
    validateForm() {
      this.validationErrors = {};
      let isValid = true;

      if (!this.newSize.ten || this.newSize.ten.trim() === "") {
        this.validationErrors.ten = "Tên kích thước không được để trống";
        isValid = false;
      }

      // Kiểm tra tên trùng lặp
      const existingSize = this.sizes.find(s => 
        s.ten.toLowerCase() === this.newSize.ten.toLowerCase() && 
        s.id !== this.sizes[this.editIndex]?.id
      );
      if (existingSize) {
        this.validationErrors.ten = "Tên kích thước đã tồn tại";
        isValid = false;
      }

      return isValid;
    },
    async saveSize() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      try {
        const sizeData = {
          ten: this.newSize.ten.trim(),
          trangThai: this.newSize.trangThai
        };

        if (this.editIndex !== null) {
          // Cập nhật
          const response = await axios.put(
            `http://localhost:8080/kich-co/cap-nhat/${this.sizes[this.editIndex].id}`,
            sizeData
          );
          this.sizes[this.editIndex] = { ...this.sizes[this.editIndex], ...sizeData };
          this.success = "Cập nhật kích thước thành công!";
        } else {
          // Thêm mới
          const response = await axios.post("http://localhost:8080/kich-co/them", sizeData);
          this.sizes.unshift(response.data);
          this.success = "Thêm kích thước thành công!";
        }
        
        this.closeModal();
        setTimeout(() => { this.success = null; }, 3000);
      } catch (err) {
        console.error(err);
        this.error = this.editIndex !== null ? 
          "Không thể cập nhật kích thước!" : 
          "Không thể thêm kích thước!";
        setTimeout(() => { this.error = null; }, 5000);
      } finally {
        this.loading = false;
      }
    },
    editSize(index) {
      this.editIndex = index;
      this.validationErrors = {};
      this.newSize = { ...this.sizes[index] };
      this.showModal = true;
    },
    async deleteSize(index) {
      if (!confirm("Xác nhận xoá kích thước này?")) {
        return;
      }

      this.loading = true;
      try {
        await axios.delete(`http://localhost:8080/kich-co/xoa/${this.sizes[index].id}`);
        this.sizes.splice(index, 1);
        this.success = "Xóa kích thước thành công!";
        setTimeout(() => { this.success = null; }, 3000);
      } catch (err) {
        console.error(err);
        this.error = "Không thể xóa kích thước!";
        setTimeout(() => { this.error = null; }, 5000);
      } finally {
        this.loading = false;
      }
    },
    clearMessages() {
      this.error = null;
      this.success = null;
    }
  },
  mounted() {
    this.fetchSizes();
  }
};

import axios from "axios";
export default {
  data() {
    return {
      sizes: [],
      search: "",
      status: "",
      showModal: false,
      newSize: {
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
    filteredSizes() {
      const keyword = this.search.toLowerCase();
      return this.sizes.filter(
        s =>
          ((s.ten && s.ten.toLowerCase().includes(keyword)) ||
           (s.ma && s.ma.toLowerCase().includes(keyword))) &&
          (this.status === "" || s.trangThai == this.status)
      );
    }
  },
  methods: {
    async fetchSizes() {
      try {
        const res = await axios.get("http://localhost:8080/kich-thuoc/hien-thi");
        this.sizes = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
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
      this.newSize = {
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
    addSize() {
      if (!this.newSize.ten) {
        alert("Vui lòng nhập tên kích thước.");
        return;
      }
      if (!this.newSize.ma) {
        alert("Vui lòng nhập mã kích thước.");
        return;
      }
      
      // Tạo mã tự động nếu chưa có
      if (!this.newSize.ma) {
        this.newSize.ma = this.generateSizeCode(this.newSize.ten);
      }
      
      // Gọi API thêm kích thước
      this.saveSize();
    },
    saveSize() {
      if (this.editIndex !== null) {
        // Cập nhật kích thước hiện có
        this.sizes[this.editIndex] = { ...this.newSize };
      } else {
        // Thêm kích thước mới
        this.sizes.push({ ...this.newSize });
      }
      
      // Gọi API lưu ở đây nếu cần
      this.closeModal();
    },
    editSize(index) {
      this.editIndex = index;
      this.newSize = { ...this.sizes[index] };
      this.showModal = true;
    },
    deleteSize(index) {
      if (confirm("Xác nhận xoá kích thước này?")) {
        // Gọi API xoá ở đây nếu cần
        this.sizes.splice(index, 1);
      }
    },
    generateSizeCode(sizeName) {
      // Tạo mã tự động từ tên kích thước
      const cleanName = sizeName.replace(/\s+/g, '').toUpperCase();
      const timestamp = Date.now().toString().slice(-4);
      return `KT${cleanName.slice(0, 3)}${timestamp}`;
    }
  },
  mounted() {
    this.fetchSizes();
  }
};

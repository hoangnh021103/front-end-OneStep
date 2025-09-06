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
          (s.ten && s.ten.toLowerCase().includes(keyword)) &&
          (this.status === "" || s.trangThai == this.status)
      );
    }
  },
  methods: {
    async fetchSizes() {
      try {
        console.log("Đang gọi API kích thước...");
        const res = await axios.get("http://localhost:8080/kich-co/hien-thi");
        console.log("Response từ API:", res.data);
        
        // Xử lý dữ liệu từ API
        if (Array.isArray(res.data)) {
          this.sizes = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          this.sizes = res.data.data;
        } else {
          this.sizes = [];
        }
        
        console.log("Dữ liệu kích thước đã load:", this.sizes);
      } catch (err) {
        console.error("Lỗi khi gọi API kích thước:", err);
        alert("Không thể tải dữ liệu kích thước. Vui lòng kiểm tra kết nối API.");
        this.sizes = [];
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
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveSize() {
      if (!this.newSize.ten) {
        alert("Vui lòng nhập tên kích thước.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    addSize() {
      this.saveSize();
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
    }
  },
  mounted() {
    this.fetchSizes();
  }
};

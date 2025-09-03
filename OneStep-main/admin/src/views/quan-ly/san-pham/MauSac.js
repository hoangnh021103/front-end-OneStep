import axios from "axios";
export default {
  data() {
    return {
      colors: [],
      searchQuery: "",
      showModal: false,
      newColor: {
        ten: "",
        ma: "",
        hex: "#000000",
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      },
      editIndex: null
    };
  },
  computed: {
    filteredColors() {
      const keyword = this.searchQuery.toLowerCase();
      return this.colors.filter(
        c =>
          (c.ten && c.ten.toLowerCase().includes(keyword)) ||
          (c.ma && c.ma.toLowerCase().includes(keyword))
      );
    }
  },
  methods: {
    async fetchColors() {
      try {
        const res = await axios.get("http://localhost:8080/mau-sac/hien-thi");
        this.colors = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    resetFilter() {
      this.searchQuery = "";
      this.fetchColors();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newColor = {
        ten: "",
        ma: "",
        hex: "#000000",
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveColor() {
      if (
        !this.newColor.ten ||
        !this.newColor.ma ||
        !/^#[0-9A-Fa-f]{6}$/.test(this.newColor.hex)
      ) {
        alert("Vui lòng nhập thông tin hợp lệ.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editColor(index) {
      this.editIndex = index;
      this.newColor = { ...this.colors[index] };
      this.showModal = true;
    },
    deleteColor(index) {
      if (confirm("Xác nhận xoá màu này?")) {
        // Gọi API xoá ở đây nếu cần
        this.colors.splice(index, 1);
      }
    },
    updatePreview() {
      // Live preview handled by :style binding
    }
  },
  mounted() {
    this.fetchColors();
  }
};
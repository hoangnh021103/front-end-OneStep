import axios from "axios";
export default {
  data() {
    return {
      colors: [],
      searchQuery: "",
      showModal: false,
      newColor: {
        ten: "",
        hex: "#000000",
        trangThai: 1
      },
      editIndex: null
    };
  },
  computed: {
    filteredColors() {
      const keyword = this.searchQuery.toLowerCase();
      return this.colors.filter(
        c =>
          (c.ten && c.ten.toLowerCase().includes(keyword))
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
        hex: "#000000",
        trangThai: 1
      };
    },
    closeModal() {
      this.showModal = false;
    },
    async saveColor() {
      if (
        !this.newColor.ten ||
        !/^#[0-9A-Fa-f]{6}$/.test(this.newColor.hex)
      ) {
        alert("Vui lòng nhập thông tin hợp lệ.");
        return;
      }
      try {
        if (this.editIndex === null) {
          await axios.post("http://localhost:8080/mau-sac/add", this.newColor);
          alert("Thêm màu sắc thành công!");
        } else {
          const id = this.colors[this.editIndex].id;
          await axios.put(`http://localhost:8080/mau-sac/update/${id}`, this.newColor);
          alert("Cập nhật màu sắc thành công!");
        }
        await this.fetchColors();
      } catch (err) {
        console.error("Lỗi khi lưu màu sắc:", err);
        alert("Có lỗi xảy ra khi lưu màu sắc!");
      }
      this.closeModal();
    },
    editColor(index) {
      this.editIndex = index;
      this.newColor = { ...this.colors[index] };
      this.showModal = true;
    },
    async deleteColor(index) {
      const color = this.colors[index];
      if (confirm("Xác nhận xoá màu này?")) {
        try {
          await axios.delete(`http://localhost:8080/mau-sac/delete/${color.id}`);
          await this.fetchColors();
          alert("Xóa màu sắc thành công!");
        } catch (err) {
          console.error("Lỗi khi xóa màu sắc:", err);
          alert("Không thể xóa màu sắc. Vui lòng thử lại!");
        }
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
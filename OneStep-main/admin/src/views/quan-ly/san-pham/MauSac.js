import axios from "axios";
export default {
  data() {
    return {
      colors: [],
      searchQuery: "",
      showModal: false,
      newColor: {
        ten: "",
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
        trangThai: 1
      };
    },
    closeModal() {
      this.showModal = false;
    },
    async saveColor() {
      if (!this.newColor.ten) {
        alert("Vui lòng nhập tên màu sắc.");
        return;
      }
      try {
        const payload = {
          ten: this.newColor.ten,
          trangThai: this.newColor.trangThai
        };
        if (this.editIndex === null) {
          await axios.post("http://localhost:8080/mau-sac/add", payload);
          alert("Thêm màu sắc thành công!");
        } else {
          const id = this.colors[this.editIndex].id;
          await axios.put(`http://localhost:8080/mau-sac/update/${id}`, payload);
          alert("Cập nhật màu sắc thành công!");
        }
        await this.fetchColors();
      } catch (err) {
        const serverMessage = err?.response?.data?.message || err?.response?.data || err?.message || "Không xác định";
        console.error("Lỗi khi lưu màu sắc:", serverMessage, err);
        alert(`Có lỗi xảy ra khi lưu màu sắc: ${serverMessage}`);
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
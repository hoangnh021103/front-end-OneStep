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
        trangThai: 1
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
    // 🟢 Lấy danh sách kích thước
    async fetchSizes() {
      try {
        const res = await axios.get("http://localhost:8080/kich-co/hien-thi");

        if (Array.isArray(res.data)) {
          this.sizes = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          this.sizes = res.data.data;
        } else {
          this.sizes = [];
        }
      } catch (err) {
        console.error("Lỗi khi gọi API kích thước:", err);
        alert("Không thể tải dữ liệu kích thước. Vui lòng kiểm tra kết nối API.");
        this.sizes = [];
      }
    },

    // 🟢 Reset bộ lọc
    resetFilters() {
      this.search = "";
      this.status = "";
      this.fetchSizes();
    },

    // 🟢 Mở modal thêm
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newSize = {
        ten: "",
        trangThai: 1
      };
    },

    // 🟢 Đóng modal
    closeModal() {
      this.showModal = false;
    },

    // 🟢 Lưu (thêm/sửa) kích thước
    async saveSize() {
      if (!this.newSize.ten) {
        alert("Vui lòng nhập tên kích thước.");
        return;
      }

      try {
        if (this.editIndex === null) {
          // 🆕 Thêm mới
          const res = await axios.post("http://localhost:8080/kich-co/add", this.newSize);
          this.sizes.push(res.data);
          alert("Thêm kích thước thành công!");
        } else {
          // ✏️ Cập nhật
          const id = this.sizes[this.editIndex].id;
          const res = await axios.put(`http://localhost:8080/kich-co/update/${id}`, this.newSize);
          this.sizes.splice(this.editIndex, 1, res.data);
          alert("Cập nhật kích thước thành công!");
        }
      } catch (err) {
        console.error("Lỗi khi lưu kích thước:", err);
        alert("Có lỗi xảy ra khi lưu kích thước!");
      }

      this.closeModal();
    },

    // 🟢 Gọi saveSize khi bấm nút Thêm/Cập nhật
    addSize() {
      this.saveSize();
    },

    // 🟢 Chỉnh sửa kích thước
    editSize(index) {
      this.editIndex = index;
      this.newSize = { ...this.sizes[index] };
      this.showModal = true;
    },

    // 🟢 Xóa kích thước
    async deleteSize(index) {
      const size = this.sizes[index];
      if (confirm(`Xác nhận xoá kích thước "${size.ten}"?`)) {
        try {
          await axios.delete(`http://localhost:8080/kich-co/delete/${size.id}`);
          this.sizes.splice(index, 1);
          alert("Xóa kích thước thành công!");
        } catch (err) {
          console.error("Lỗi khi xóa kích thước:", err);
          alert("Không thể xóa kích thước. Vui lòng thử lại!");
        }
      }
    }
  },

  // 🟢 Khi load component → gọi API
  mounted() {
    this.fetchSizes();
  }
};

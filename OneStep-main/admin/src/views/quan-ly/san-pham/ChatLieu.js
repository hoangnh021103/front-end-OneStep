import axios from "axios";

export default {
  data() {
    return {
      materials: [],
      search: "",
      status: "",
      showModal: false,
      newMaterial: {
        ten: "",
        trangThai: 1
      },
      editIndex: null
    };
  },
  computed: {
    filteredMaterials() {
      const keyword = this.search.toLowerCase();
      return this.materials.filter(
        m =>
          (m.ten && m.ten.toLowerCase().includes(keyword)) &&
          (this.status === "" || m.trangThai == this.status)
      );
    }
  },
  methods: {
    // 🟢 Lấy danh sách chất liệu
    async fetchMaterials() {
      try {
        const res = await axios.get("http://localhost:8080/chat-lieu/hien-thi");
        this.materials = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error("Lỗi khi tải chất liệu:", err);
        alert("Không thể tải dữ liệu chất liệu!");
      }
    },

    // 🟢 Reset bộ lọc
    resetFilters() {
      this.search = "";
      this.status = "";
      this.fetchMaterials();
    },

    // 🟢 Mở modal thêm
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newMaterial = {
        ten: "",
        trangThai: 1
      };
    },

    // 🟢 Đóng modal
    closeModal() {
      this.showModal = false;
    },

    // 🟢 Lưu (thêm/sửa) chất liệu
    async saveMaterial() {
      if (!this.newMaterial.ten) {
        alert("Vui lòng nhập tên chất liệu.");
        return;
      }

      try {
        if (this.editIndex === null) {
          // 🆕 Thêm mới
          const res = await axios.post("http://localhost:8080/chat-lieu/add", this.newMaterial);
          this.materials.push(res.data);
          alert("Thêm chất liệu thành công!");
        } else {
          // ✏️ Cập nhật
          const id = this.materials[this.editIndex].id;
          const res = await axios.put(`http://localhost:8080/chat-lieu/update/${id}`, this.newMaterial);
          this.materials.splice(this.editIndex, 1, res.data);
          alert("Cập nhật chất liệu thành công!");
        }
      } catch (err) {
        console.error("Lỗi khi lưu chất liệu:", err);
        alert("Có lỗi xảy ra khi lưu chất liệu!");
      }

      this.closeModal();
    },

    // 🟢 Gọi saveMaterial khi bấm Thêm/Cập nhật
    addMaterial() {
      this.saveMaterial();
    },

    // 🟢 Chỉnh sửa chất liệu
    editMaterial(index) {
      this.editIndex = index;
      this.newMaterial = { ...this.materials[index] };
      this.showModal = true;
    },

    // 🟢 Xóa chất liệu
    async deleteMaterial(index) {
      const material = this.materials[index];
      if (confirm(`Xác nhận xoá chất liệu "${material.ten}"?`)) {
        try {
          await axios.delete(`http://localhost:8080/chat-lieu/delete/${material.id}`);
          this.materials.splice(index, 1);
          alert("Xóa chất liệu thành công!");
        } catch (err) {
          console.error("Lỗi khi xóa chất liệu:", err);
          alert("Không thể xóa chất liệu. Vui lòng thử lại!");
        }
      }
    }
  },

  mounted() {
    this.fetchMaterials();
  }
};

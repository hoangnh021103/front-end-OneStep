import axios from "axios";
export default {
  data() {
    return {
      soles: [],
      search: "",
      status: "",
      showModal: false,
      newSole: {
        ten: "",
        trangThai: 1
      },
      editIndex: null
    };
  },
  computed: {
    filteredSoles() {
      const keyword = this.search.toLowerCase();
      return this.soles.filter(
        s =>
          (s.ten && s.ten.toLowerCase().includes(keyword)) &&
          (this.status === "" || s.trangThai == this.status)
      );
    }
  },
  methods: {
    async fetchSoles() {
      try {
        const res = await axios.get("http://localhost:8080/de-giay/hien-thi");
        this.soles = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    resetFilters() {
      this.search = "";
      this.status = "";
      this.fetchSoles();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newSole = {
        ten: "",
        trangThai: 1
      };
    },
    closeModal() {
      this.showModal = false;
    },

    // 🟢 thêm mới hoặc cập nhật
    async saveSole() {
      if (!this.newSole.ten) {
        alert("Vui lòng nhập tên loại đế.");
        return;
      }

      try {
        if (this.editIndex === null) {
          // ➕ Thêm mới
          const res = await axios.post("http://localhost:8080/de-giay/add", this.newSole);
          this.soles.push(res.data);
          alert("Thêm loại đế thành công!");
        } else {
          // ✏️ Cập nhật
          const soleId = this.soles[this.editIndex].id;
          const res = await axios.put(
            `http://localhost:8080/de-giay/update/${soleId}`,
            this.newSole
          );

          // Cập nhật lại trong mảng
          this.soles.splice(this.editIndex, 1, res.data);

          alert("Cập nhật loại đế thành công!");
        }
        this.closeModal();
      } catch (err) {
        console.error("Lỗi khi lưu loại đế:", err);
        alert("Có lỗi xảy ra khi lưu loại đế!");
      }
    },

    // 🟢 mở modal edit
    editSole(index) {
      this.editIndex = index;
      this.newSole = { ...this.soles[index] };
      this.showModal = true;
    },

    // 🟢 xóa loại đế
    async deleteSole(index) {
      const sole = this.soles[index];
      if (confirm("Xác nhận xoá loại đế này?")) {
        try {
          await axios.delete(`http://localhost:8080/de-giay/delete/${sole.id}`);
          this.soles.splice(index, 1);
          alert("Xóa loại đế thành công!");
        } catch (err) {
          console.error("Lỗi khi xoá loại đế:", err);
          alert("Có lỗi xảy ra khi xoá loại đế!");
        }
      }
    }
  },
  mounted() {
    this.fetchSoles();
  }
};

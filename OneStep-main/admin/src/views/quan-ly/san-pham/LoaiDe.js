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
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
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
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveSole() {
      if (!this.newSole.ten) {
        alert("Vui lòng nhập tên loại đế.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editSole(index) {
      this.editIndex = index;
      this.newSole = { ...this.soles[index] };
      this.showModal = true;
    },
    deleteSole(index) {
      if (confirm("Xác nhận xoá loại đế này?")) {
        // Gọi API xoá ở đây nếu cần
        this.soles.splice(index, 1);
      }
    }
  },
  mounted() {
    this.fetchSoles();
  }
};

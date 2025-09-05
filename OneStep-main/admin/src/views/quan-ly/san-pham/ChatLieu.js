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
        trangThai: 1,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
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
    async fetchMaterials() {
      try {
        const res = await axios.get("http://localhost:8080/chat-lieu/hien-thi");
        this.materials = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    resetFilters() {
      this.search = "";
      this.status = "";
      this.fetchMaterials();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newMaterial = {
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
    saveMaterial() {
      if (!this.newMaterial.ten) {
        alert("Vui lòng nhập tên chất liệu.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    editMaterial(index) {
      this.editIndex = index;
      this.newMaterial = { ...this.materials[index] };
      this.showModal = true;
    },
    deleteMaterial(index) {
      if (confirm("Xác nhận xoá chất liệu này?")) {
        // Gọi API xoá ở đây nếu cần
        this.materials.splice(index, 1);
      }
    }
  },
   mounted() {
    this.fetchMaterials();
  }
};
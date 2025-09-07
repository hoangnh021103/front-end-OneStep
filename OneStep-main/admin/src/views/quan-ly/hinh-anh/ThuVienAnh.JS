import axios from "axios";
export default {
  name: "ThuVienAnh",
  data() {
    return {
      dsAnh: [],
      danhSachSanPham: [],
      search: "",
      showModal: false,
      editImage: null,
      modalData: {
        sanPhamId: "",
        tenSanPham: "",
        duongDanAnh: "",
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    filteredImages() {
      const keyword = this.search.toLowerCase();
      return this.dsAnh.filter(
        img => (
          (img.tenSanPham && img.tenSanPham.toLowerCase().includes(keyword)) ||
          (this.getTenSanPham(img) && this.getTenSanPham(img).toLowerCase().includes(keyword))
        )
      );
    },
    totalPages() {
      return Math.ceil(this.filteredImages.length / this.pageSize) || 1;
    },
    pagedImages() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredImages.slice(start, start + this.pageSize);
    },
    visiblePages() {
      const total = this.totalPages;
      const cur = this.currentPage;
      if (total <= 5) return Array.from({length: total}, (_, i) => i+1);
      if (cur <= 3) return [1,2,3,4,5];
      if (cur >= total-2) return [total-4, total-3, total-2, total-1, total];
      return [cur-2, cur-1, cur, cur+1, cur+2];
    }
  },
  methods: {
    async fetchAnhSanPham() {
      try {
        const res = await axios.get("http://localhost:8080/anh-san-pham/hien-thi");
        if (Array.isArray(res.data)) {
          this.dsAnh = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          this.dsAnh = res.data.data;
        } else {
          this.dsAnh = [];
        }
      } catch (err) {
        alert("Không thể tải danh sách ảnh sản phẩm!");
        this.dsAnh = [];
      }
    },
    async fetchDanhSachSanPham() {
      try {
        const res = await axios.get("http://localhost:8080/san-pham/hien-thi");
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        this.danhSachSanPham = list.map(sp => ({ id: sp.id || sp.maSanPham || sp.idSanPham, tenSanPham: sp.tenSanPham }));
      } catch (err) {
        this.danhSachSanPham = [];
      }
    },
    getTenSanPham(img) {
      const sanPhamId = img?.sanPham?.id || img?.sanPhamId;
      if (!sanPhamId) return img.tenSanPham || "";
      const found = this.danhSachSanPham.find(sp => String(sp.id) === String(sanPhamId));
      return found?.tenSanPham || img.tenSanPham || "";
    },
    resetFilter() {
      this.search = "";
    },
    openAddModal() {
      this.editImage = null;
      this.modalData = {
        sanPhamId: "",
        tenSanPham: "",
        duongDanAnh: "",
      };
      this.showModal = true;
    },
    openEditModal(img) {
      this.editImage = img;
      this.modalData = {
        sanPhamId: img?.sanPham?.id || img?.sanPhamId || "",
        tenSanPham: img.tenSanPham || "",
        duongDanAnh: img.duongDanAnh || ""
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.editImage = null;
    },
    async saveImage() {
      if (this.editImage) {
        // Sửa tạm thời local
        Object.assign(this.editImage, {
          tenSanPham: this.modalData.tenSanPham,
          duongDanAnh: this.modalData.duongDanAnh,
          sanPhamId: this.modalData.sanPhamId
        });
        this.closeModal();
      } else {
        // Thêm mới: chỉ gửi tên và URL ảnh
        try {
          const data = {
            tenSanPham: this.modalData.tenSanPham,
            duongDanAnh: this.modalData.duongDanAnh,
            daXoa: 0
          };
          await axios.post("http://localhost:8080/anh-san-pham/add", data);
          this.fetchAnhSanPham();
          this.closeModal();
        } catch (err) {
          alert("Lỗi khi thêm ảnh: " + (err.response?.data?.message || err.message));
        }
      }
    },
    deleteImage(id) {
      if (confirm("Bạn có chắc muốn xóa ảnh này?")) {
        this.dsAnh = this.dsAnh.filter(img => img.id !== id);
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('vi-VN');
    },
    viewImage(img) {
      window.open(img.duongDanAnh, '_blank');
    }
  },
  mounted() {
    this.fetchAnhSanPham();
    this.fetchDanhSachSanPham();
  }
};

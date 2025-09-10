<template>
  <div class="image-manager">
    <header>
      <h2>Quản lý thư viện ảnh</h2>
    </header>
    <section class="filter-section">
      <div class="filter-row">
        <input v-model="search" placeholder="Tìm kiếm tên ảnh hoặc sản phẩm..." />
        <button @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
      </div>
    </section>
    <section class="image-list-section">
      <div class="list-header">
        <span>Danh sách ảnh</span>
        <button class="add-btn" @click="openAddModal"><i class="fa fa-plus"></i> Thêm mới ảnh</button>
      </div>
      <table class="image-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Tên ảnh</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredImages.length === 0">
            <td colspan="7" class="no-data">
              <div class="empty-state">
                <div class="empty-icon"><i class="fa fa-image"></i></div>
                <div class="empty-text">Chưa có ảnh nào</div>
                <div class="empty-subtext">Nhấn "Thêm mới ảnh" để bắt đầu</div>
              </div>
            </td>
          </tr>
          <tr v-for="(img, idx) in pagedImages" :key="img.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
            <td>
              <img 
                :src="img.duongDanAnh" 
                :alt="img.tenSanPham" 
                class="img-thumb" 
                @error="handleImageError"
                @load="handleImageLoad"
              />
              <div v-if="!img.duongDanAnh" class="no-image">Không có ảnh</div>
            </td>
            <td>{{ img.tenSanPham }}</td>
            <td>
              <button class="action-btn view" @click="viewImage(img)" title="Xem"><i class="fa fa-eye"></i></button>
              <button class="action-btn edit" @click="openEditModal(img)" title="Sửa"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" @click="deleteImage(img.id)" title="Xóa"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-center">
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="changePage(currentPage-1)">‹</button>
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="{active: currentPage === page}"
            @click="changePage(page)"
          >{{ page }}</button>
          <button :disabled="currentPage === totalPages" @click="changePage(currentPage+1)">›</button>
          <select v-model.number="pageSize">
            <option v-for="size in [5,10,20]" :key="size" :value="size">{{size}} / page</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Modal Thêm/Sửa -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ editImage ? 'Sửa ảnh' : 'Thêm ảnh mới' }}</h3>
        <form @submit.prevent="saveImage">
          <div class="form-group">
            <label>Tên ảnh:</label>
            <input 
              v-model="modalData.tenSanPham" 
              placeholder="Nhập tên ảnh (ví dụ: puma)" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label>Đường dẫn ảnh:</label>
            <input 
              v-model="modalData.duongDanAnh" 
              placeholder="Nhập URL ảnh (ví dụ: https://example.com/image.jpg)" 
              required 
            />
          </div>
          
          <!-- Preview ảnh -->
          <div v-if="modalData.duongDanAnh && modalData.duongDanAnh.startsWith('http')" class="image-preview">
            <h4>Preview ảnh:</h4>
            <img 
              :src="modalData.duongDanAnh" 
              :alt="modalData.tenSanPham" 
              class="preview-img" 
              @error="handlePreviewError"
              @load="handlePreviewLoad"
            />
          </div>
          
          <div class="modal-actions">
            <button type="submit">
              <i class="fa fa-check"></i> {{ editImage ? 'Sửa' : 'Thêm' }}
            </button>
            <button type="button" @click="closeModal">
              <i class="fa fa-times"></i> Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
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
    },
    handleImageError() {},
    handleImageLoad() {},
    handlePreviewError() {},
    handlePreviewLoad() {}
  },
  mounted() {
    this.fetchAnhSanPham();
    this.fetchDanhSachSanPham();
  }
};
</script>


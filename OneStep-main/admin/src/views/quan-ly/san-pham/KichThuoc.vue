<template>
  <div class="page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title"> Quản Lý Kích Thước</h2>
    </div>

    <!-- Bộ lọc tìm kiếm -->
    <div class="filter-section">
      <h3 class="section-title">Bộ lọc tìm kiếm</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="Nhập tên kích thước" />
        <select v-model="status">
          <option value="">Tất cả trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Ngừng</option>
        </select>
        <button @click="resetFilters" class="reset-btn">
          <i class="fa fa-undo"></i> Đặt lại
        </button>
      </div>
    </div>

    <!-- Danh sách kích thước -->
    <div class="list-section">
      <div class="list-header">
        <h3 class="section-title">Danh sách kích thước</h3>
        <button @click="openModal" class="add-btn">
          <i class="fa fa-plus"></i> Thêm mới
        </button>
      </div>

      <div class="table-wrapper">
        <table class="size-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Số size</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredSizes" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.ten }}</td>
              <td>
                <span
                  :class="[
                    'status-tag',
                    item.trangThai === 1 ? 'active' : 'inactive'
                  ]"
                >
                  {{ item.trangThai === 1 ? "Còn Hàng" : "Hết Hàng" }}
                </span>
              </td>
              <td>
                <button
                  class="action-btn edit"
                  title="Sửa"
                  @click="editSize(index)"
                >
                  <i class="fa fa-edit"></i>
                </button>
                <button
                  class="action-btn delete"
                  title="Xóa"
                  @click="deleteSize(index)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Thêm/Sửa kích thước -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>
          {{ editIndex !== null ? "Chỉnh Sửa Kích Thước" : "Thêm Kích Thước" }}
        </h3>
        <label for="sizeNameInput">Tên kích thước</label>
        <input
          id="sizeNameInput"
          type="text"
          v-model="newSize.ten"
          placeholder="Nhập tên kích thước"
        />
        <div class="modal-actions">
          <button @click="addSize" class="confirm-btn">
            <i class="fa fa-check"></i>
            {{ editIndex !== null ? "Cập nhật" : "Thêm" }}
          </button>
          <button @click="closeModal" class="cancel-btn">
            <i class="fa fa-times"></i> Huỷ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
    async fetchSizes() {
      try {
        console.log("Đang gọi API kích thước...");
        const res = await axios.get("http://localhost:8080/kich-co/hien-thi");
        console.log("Response từ API:", res.data);
        
        // Xử lý dữ liệu từ API
        if (Array.isArray(res.data)) {
          this.sizes = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          this.sizes = res.data.data;
        } else {
          this.sizes = [];
        }
        
        console.log("Dữ liệu kích thước đã load:", this.sizes);
      } catch (err) {
        console.error("Lỗi khi gọi API kích thước:", err);
        alert("Không thể tải dữ liệu kích thước. Vui lòng kiểm tra kết nối API.");
        this.sizes = [];
      }
    },
    resetFilters() {
      this.search = "";
      this.status = "";
      this.fetchSizes();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newSize = {
        ten: "",
        trangThai: 1
      };
    },
    closeModal() {
      this.showModal = false;
    },
    saveSize() {
      if (!this.newSize.ten) {
        alert("Vui lòng nhập tên kích thước.");
        return;
      }
      // Gọi API thêm/sửa ở đây nếu cần
      this.closeModal();
    },
    addSize() {
      this.saveSize();
    },
    editSize(index) {
      this.editIndex = index;
      this.newSize = { ...this.sizes[index] };
      this.showModal = true;
    },
    deleteSize(index) {
      if (confirm("Xác nhận xoá kích thước này?")) {
        // Gọi API xoá ở đây nếu cần
        this.sizes.splice(index, 1);
      }
    }
  },
  mounted() {
    this.fetchSizes();
  }
};
</script>
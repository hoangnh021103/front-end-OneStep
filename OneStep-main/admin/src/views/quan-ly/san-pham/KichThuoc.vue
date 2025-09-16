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
          <option value="1">Còn hàng</option>
          <option value="0">Hết hàng</option>
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
        <label for="sizeStatusSelect">Trạng thái</label>
        <select id="sizeStatusSelect" v-model="newSize.trangThai">
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>
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
import { toast } from 'vue3-toastify';
export default {
  data() {
    return {
      sizes: [],
      search: "",
      status: "",
      showModal: false,
      newSize: {
        ten: "",
        trangThai: 1,
        ngayCapNhat: new Date().toISOString().split('T')[0]
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
        const res = await axios.get("http://localhost:8080/kich-co/hien-thi");
        
        // Xử lý dữ liệu từ API
        if (Array.isArray(res.data)) {
          this.sizes = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          this.sizes = res.data.data;
        } else {
          this.sizes = [];
          toast.warning("Không có dữ liệu kích thước nào.");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API kích thước:", err);
        toast.error(`Không thể tải dữ liệu kích thước: ${err.message || 'Lỗi kết nối API'}`);
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
        trangThai: 1,
        ngayCapNhat: new Date().toISOString().split('T')[0]
      };
    },
    closeModal() {
      this.showModal = false;
    },
    async saveSize() {
      if (!this.newSize.ten) {
        toast.error("Vui lòng nhập tên kích thước.");
        return;
      }
      
      // Thêm ngày cập nhật
      this.newSize.ngayCapNhat = new Date().toISOString().split('T')[0];

      try {
        if (this.editIndex === null) {
          // 🆕 Thêm mới
          const res = await axios.post("http://localhost:8080/kich-co/add", this.newSize);
          // Cập nhật mảng local với dữ liệu từ response
          this.sizes.push(res.data);
          toast.success(`Thêm kích thước "${this.newSize.ten}" thành công!`);
        } else {
          // ✏️ Cập nhật
          const id = this.sizes[this.editIndex].id;
          const res = await axios.put(`http://localhost:8080/kich-co/update/${id}`, this.newSize);
          // Cập nhật mảng local với dữ liệu từ response
          this.sizes.splice(this.editIndex, 1, res.data);
          toast.success(`Cập nhật kích thước "${this.newSize.ten}" thành công!`);
        }
      } catch (err) {
        console.error("Lỗi khi lưu kích thước:", err);
        toast.error(`Có lỗi xảy ra khi ${this.editIndex === null ? 'thêm' : 'cập nhật'} kích thước: ${err.message || 'Không xác định'}`);
      }

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
    async deleteSize(index) {
      const size = this.sizes[index];
      if (!size) {
        toast.error("Không tìm thấy kích thước!");
        return;
      }
      
      if (confirm(`Bạn có chắc chắn muốn xóa kích thước "${size.ten}" không?`)) {
        try {
          await axios.delete(`http://localhost:8080/kich-co/delete/${size.id}`);
          // Xóa trực tiếp từ mảng local thay vì gọi lại API
          this.sizes.splice(index, 1);
          toast.success(`Đã xóa kích thước "${size.ten}" thành công!`);
        } catch (err) {
          console.error("Lỗi khi xóa kích thước:", err);
          toast.error(`Không thể xóa kích thước "${size.ten}". Lỗi: ${err.message || 'Không xác định'}`);
        }
      }
    }
  },
  mounted() {
    this.fetchSizes();
  }
};
</script>
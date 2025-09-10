<template>
  <div class="page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title">Quản Lý Chất Liệu</h2>
      <p class="page-subtitle">Thêm, tìm kiếm và quản lý các chất liệu sản phẩm</p>
    </div>

    <!-- Bộ lọc -->
    <div class="filter-section">
      <h3 class="section-title">Bộ lọc tìm kiếm</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="Nhập tên chất liệu" />
        <select v-model="status">
          <option value="">Tất cả trạng thái</option>
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>
        <button @click="resetFilters" class="reset-btn">
          <i class="fa fa-undo"></i> Đặt lại
        </button>
      </div>
    </div>

    <!-- Danh sách chất liệu -->
    <div class="list-section">
      <div
        class="list-header"
        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;"
      >
        <h3 class="section-title" style="margin: 0;">Danh Sách Chất Liệu</h3>
        <button @click="openModal" class="add-btn">
          <i class="fa fa-plus"></i> Thêm mới
        </button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên chất liệu</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredMaterials" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.ten }}</td>
              <td>
                <span :class="['status-tag', item.trangThai === 1 ? 'active' : 'inactive']">
                  {{ item.trangThai === 1 ? "Còn hàng" : "Hết hàng" }}
                </span>
              </td>
              <td>
                <button
                  class="action-btn edit"
                  title="Sửa"
                  @click="editMaterial(index)"
                >
                  <i class="fa fa-edit"></i>
                </button>
                <button
                  class="action-btn delete"
                  title="Xóa"
                  @click="deleteMaterial(index)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>{{ editIndex === null ? "Thêm Chất Liệu" : "Cập Nhật Chất Liệu" }}</h3>
        <label>Tên chất liệu</label>
        <input type="text" v-model="newMaterial.ten" placeholder="Nhập chất liệu" />
        <label>Trạng thái</label>
        <select v-model="newMaterial.trangThai">
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>
        <div class="modal-actions">
          <button @click="addMaterial" class="confirm-btn">
            <i class="fa fa-check"></i> Xác nhận
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
        toast.error("Không thể tải dữ liệu chất liệu!");
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
        toast.error("Vui lòng nhập tên chất liệu.");
        return;
      }

      try {
        if (this.editIndex === null) {
          // 🆕 Thêm mới
          const res = await axios.post("http://localhost:8080/chat-lieu/add", this.newMaterial);
          this.materials.push(res.data);
          toast.success("Thêm chất liệu thành công!");
        } else {
          // ✏️ Cập nhật
          const id = this.materials[this.editIndex].id;
          const res = await axios.put(`http://localhost:8080/chat-lieu/update/${id}`, this.newMaterial);
          this.materials.splice(this.editIndex, 1, res.data);
          toast.success("Cập nhật chất liệu thành công!");
        }
      } catch (err) {
        console.error("Lỗi khi lưu chất liệu:", err);
        toast.error("Có lỗi xảy ra khi lưu chất liệu!");
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
          toast.success("Xóa chất liệu thành công!");
        } catch (err) {
          console.error("Lỗi khi xóa chất liệu:", err);
          toast.error("Không thể xóa chất liệu. Vui lòng thử lại!");
        }
      }
    }
  },

  mounted() {
    this.fetchMaterials();
  }
};
</script>

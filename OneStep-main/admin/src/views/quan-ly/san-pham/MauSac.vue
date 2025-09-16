<template>
  <div class="container">
    <h2>Quản lý màu sắc</h2>

    <!-- Tìm kiếm -->
    <div class="filter-box">
      <label>Tìm kiếm màu sắc:</label>
      <div class="filter-row">
        <input v-model="searchQuery" type="text" placeholder="Nhập tên để tìm..." />
        <button class="button" @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
      </div>
    </div>

    <!-- Danh sách màu sắc + nút thêm mới -->
    <div class="table-container">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <h3 style="margin: 0;">Danh Sách Màu Sắc</h3>
        <button class="button" @click="openModal"><i class="fa fa-plus"></i> Thêm mới màu sắc</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(color, index) in filteredColors" :key="color.id">
            <td>{{ index + 1 }}</td>
            <td>
              <span>{{ color.ten }}</span>
              <span v-if="color.hex" style="margin-left:8px;">
                <div :style="{background: color.hex, width:'18px', height:'18px', borderRadius:'50%', display:'inline-block', border:'1px solid #ccc'}"></div>
              </span>
            </td>
            <td>
              <span :class="['status', color.trangThai === 1 ? 'active' : 'inactive']">
                {{ color.trangThai === 1 ? 'Còn hàng' : 'Hết hàng' }}
              </span>
            </td>
            <td class="actions">
              <button class="action-btn edit" title="Sửa" @click="editColor(index)"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" title="Xóa" @click="deleteColor(index)"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editIndex !== null ? 'Sửa màu sắc' : 'Thêm màu sắc' }}</h3>
        <div class="form-group">
          <label>Tên màu sắc *</label>
          <input v-model="newColor.ten" type="text" placeholder="Nhập tên màu sắc" />
        </div>

        

        <div class="form-group">
          <label>Trạng thái</label>
          <select v-model="newColor.trangThai">
            <option :value="1">Còn hàng</option>
            <option :value="0">Hết hàng</option>
          </select>
        </div>

        <div class="modal-actions">
          <button class="button" @click="saveColor"><i class="fa fa-check"></i> Xác nhận</button>
          <button class="button" @click="closeModal"><i class="fa fa-times"></i> Huỷ</button>
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
      colors: [],
      searchQuery: "",
      showModal: false,
      newColor: {
        ten: "",
        trangThai: 1
      },
      editIndex: null
    };
  },
  computed: {
    filteredColors() {
      const keyword = this.searchQuery.toLowerCase();
      return this.colors.filter(
        c =>
          (c.ten && c.ten.toLowerCase().includes(keyword))
      );
    }
  },
  methods: {
    async fetchColors() {
      try {
        const res = await axios.get("http://localhost:8080/mau-sac/hien-thi");
        this.colors = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    resetFilter() {
      this.searchQuery = "";
      this.fetchColors();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newColor = {
        ten: "",
        trangThai: 1
      };
    },
    closeModal() {
      this.showModal = false;
    },
    async saveColor() {
      if (!this.newColor.ten) {
        toast.error("Vui lòng nhập tên màu sắc.");
        return;
      }
      try {
        const payload = {
          ten: this.newColor.ten,
          trangThai: this.newColor.trangThai
        };
        if (this.editIndex === null) {
          await axios.post("http://localhost:8080/mau-sac/add", payload);
          toast.success("Thêm màu sắc thành công!");
        } else {
          const id = this.colors[this.editIndex].id;
          await axios.put(`http://localhost:8080/mau-sac/update/${id}`, payload);
          toast.success("Cập nhật màu sắc thành công!");
        }
        await this.fetchColors();
      } catch (err) {
        const serverMessage = err?.response?.data?.message || err?.response?.data || err?.message || "Không xác định";
        console.error("Lỗi khi lưu màu sắc:", serverMessage, err);
        toast.error(`Có lỗi xảy ra khi lưu màu sắc: ${serverMessage}`);
      }
      this.closeModal();
    },
    editColor(index) {
      this.editIndex = index;
      this.newColor = { ...this.colors[index] };
      this.showModal = true;
    },
    async deleteColor(index) {
      const color = this.colors[index];
      if (confirm("Xác nhận xoá màu này?")) {
        try {
          await axios.delete(`http://localhost:8080/mau-sac/delete/${color.id}`);
          await this.fetchColors();
          toast.success("Xóa màu sắc thành công!");
        } catch (err) {
          console.error("Lỗi khi xóa màu sắc:", err);
          toast.error("Không thể xóa màu sắc. Vui lòng thử lại!");
        }
      }
    },
    updatePreview() {
      // Live preview handled by :style binding
    }
  },
  mounted() {
    this.fetchColors();
  }
};
</script>

<template>
  <div class="page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title">Quản Lý Loại Đế</h2>
    
    </div>

    <!-- Bộ lọc -->
    <div class="filter-section">
      <h3 class="section-title">Bộ lọc</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="Tìm theo tên" />
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

    <!-- Danh sách loại đế -->
    <div class="list-section">
      <div class="list-header">
        <h3 class="section-title">Danh sách loại đế</h3>
        <button @click="openModal" class="add-btn">
          <i class="fa fa-plus"></i> Thêm mới
        </button>
      </div>

      <div class="table-wrapper">
        <table class="material-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên loại đế</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredSoles" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.ten }}</td>
              <td>
                <span :class="['status-tag', item.trangThai === 1 ? 'active' : 'inactive']">
                  {{ item.trangThai === 1 ? "Còn hàng" : "Hết hàng" }}
                </span>
              </td>
              <td>
                <button class="action-btn edit" title="Sửa" @click="editSole(index)">
                  <i class="fa fa-edit"></i>
                </button>
                <button class="action-btn delete" title="Xóa" @click="deleteSole(index)">
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal thêm / sửa -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>{{ editIndex === null ? "Thêm Loại Đế" : "Chỉnh Sửa Loại Đế" }}</h3>

        <label>Tên loại đế</label>
        <input type="text" v-model="newSole.ten" placeholder="Nhập tên loại đế" />

        <label>Trạng thái</label>
        <select v-model="newSole.trangThai">
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>

        <div class="modal-actions">
          <button @click="saveSole" class="confirm-btn">
            <i class="fa fa-check"></i> {{ editIndex === null ? "Thêm" : "Lưu" }}
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

    // 🟢 Validate sole type
    async validateSole() {
      // Validate sole type name
      if (!this.newSole.ten || !this.newSole.ten.trim()) {
        toast.error("Tên loại đế là bắt buộc.");
        return false;
      }

      if (this.newSole.ten.trim().length < 2) {
        toast.error("Tên loại đế phải có ít nhất 2 ký tự.");
        return false;
      }

      if (this.newSole.ten.trim().length > 100) {
        toast.error("Tên loại đế không được vượt quá 100 ký tự.");
        return false;
      }

      if (!/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\-\.&]+$/.test(this.newSole.ten.trim())) {
        toast.error("Tên loại đế chỉ được chứa chữ cái, khoảng trắng, dấu gạch ngang, dấu chấm và dấu &.");
        return false;
      }

      // Check for duplicate sole type name (only for new sole types)
      if (this.editIndex === null) {
        try {
          const existingSoles = await axios.get("http://localhost:8080/de-giay/hien-thi");
          const soleExists = existingSoles.data.some(sole =>
            sole.ten && sole.ten.toLowerCase() === this.newSole.ten.trim().toLowerCase()
          );
          if (soleExists) {
            toast.error("Tên loại đế đã được sử dụng.");
            return false;
          }
        } catch (error) {
          console.error("Error checking sole uniqueness:", error);
        }
      }

      return true;
    },

    // 🟢 thêm mới hoặc cập nhật
    async saveSole() {
      if (!(await this.validateSole())) {
        return;
      }

      try {
        if (this.editIndex === null) {
          // ➕ Thêm mới
          const res = await axios.post("http://localhost:8080/de-giay/add", this.newSole);
          this.soles.push(res.data);
          toast.success("Thêm loại đế thành công!");
        } else {
          // ✏️ Cập nhật
          const soleId = this.soles[this.editIndex].id;
          const res = await axios.put(
            `http://localhost:8080/de-giay/update/${soleId}`,
            this.newSole
          );

          // Cập nhật lại trong mảng
          this.soles.splice(this.editIndex, 1, res.data);

          toast.success("Cập nhật loại đế thành công!");
        }
        this.closeModal();
      } catch (err) {
        console.error("Lỗi khi lưu loại đế:", err);
        toast.error("Có lỗi xảy ra khi lưu loại đế!");
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
          toast.success("Xóa loại đế thành công!");
        } catch (err) {
          console.error("Lỗi khi xoá loại đế:", err);
          toast.error("Có lỗi xảy ra khi xoá loại đế!");
        }
      }
    }
  },
  mounted() {
    this.fetchSoles();
  }
};
</script>

<!-- ThuongHieu.vue -->
<template>
  <div class="thuong-hieu page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title">Quản lý Thương Hiệu</h2>
    </div>

    <!-- Bộ lọc -->
    <div class="filter-section">
      <h3 class="section-title">Bộ lọc tìm kiếm</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="Tìm theo tên thương hiệu" />
        <select v-model="status">
          <option value="">Tất cả trạng thái</option>
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>
        <button @click="resetFilters" class="reset-btn"><i class="fa fa-undo"></i> Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách -->
    <div class="list-section">
      <div class="list-header">
        <h3 class="section-title">Danh sách thương hiệu</h3>
        <button @click="openModal" class="add-btn"><i class="fa fa-plus"></i> Thêm mới</button>
      </div>

      <div class="brand-table-wrapper">
        <table class="brand-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên thương hiệu</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(brand, index) in filteredBrands" :key="brand.id">
              <td>{{ index + 1 }}</td>
              <td>{{ brand.ten }}</td>
              <td>
                <span :class="['status-tag', brand.trangThai === 1 ? 'active' : 'inactive']">
                  {{ brand.trangThai === 1 ? 'Còn hàng' : 'Hết hàng' }}
                </span>
              </td>
              <td>
                <button class="action-btn edit" title="Sửa" @click="editBrand(index)"><i class="fa fa-edit"></i></button>
                <button class="action-btn delete" title="Xóa" @click="deleteBrand(index)"><i class="fa fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredBrands.length === 0" class="empty-text">Chưa có thương hiệu nào.</div>
      </div>
    </div>

    <!-- Modal thêm/sửa -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>{{ editIndex !== null ? 'Sửa Thương Hiệu' : 'Thêm Thương Hiệu' }}</h3>

        <label for="brandNameInput">Tên thương hiệu *</label>
        <input id="brandNameInput" type="text" v-model="newBrand.ten" placeholder="Nhập tên thương hiệu" />
        <label for="brandStatusSelect">Trạng thái</label>
        <select id="brandStatusSelect" v-model="newBrand.trangThai">
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>

        <div class="modal-actions">
          <button @click="saveBrand" class="confirm-btn"><i class="fa fa-check"></i> {{ editIndex !== null ? 'Cập nhật' : 'Thêm' }}</button>
          <button @click="closeModal" class="cancel-btn"><i class="fa fa-times"></i> Huỷ</button>
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
      brands: [],
      search: "",
      status: "",
      showModal: false,
      newBrand: {
        ten: "",
        trangThai: 1
      },
      editIndex: null
    };
  },
  computed: {
    filteredBrands() {
      const keyword = this.search.toLowerCase();
      return this.brands.filter(
        b =>
          (b.ten && b.ten.toLowerCase().includes(keyword)) &&
          (this.status === "" || b.trangThai == this.status)
      );
    }
  },
  methods: {
    async fetchBrands() {
      try {
        const res = await axios.get("http://localhost:8080/thuong-hieu/hien-thi");
        this.brands = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error("Lỗi khi tải danh sách thương hiệu:", err);
        toast.error("Có lỗi xảy ra khi tải danh sách thương hiệu!");
      }
    },
    resetFilters() {
      this.search = "";
      this.status = "";
      this.fetchBrands();
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newBrand = {
        ten: "",
        trangThai: 1
      };
    },
    closeModal() {
      this.showModal = false;
      this.editIndex = null;
      this.newBrand = {
        ten: "",
        trangThai: 1
      };
    },
    async validateBrand() {
      // Validate brand name
      if (!this.newBrand.ten || !this.newBrand.ten.trim()) {
        toast.error("Tên thương hiệu là bắt buộc.");
        return false;
      }

      if (this.newBrand.ten.trim().length < 2) {
        toast.error("Tên thương hiệu phải có ít nhất 2 ký tự.");
        return false;
      }

      if (this.newBrand.ten.trim().length > 100) {
        toast.error("Tên thương hiệu không được vượt quá 100 ký tự.");
        return false;
      }

      if (!/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\-\.&]+$/.test(this.newBrand.ten.trim())) {
        toast.error("Tên thương hiệu chỉ được chứa chữ cái, khoảng trắng, dấu gạch ngang, dấu chấm và dấu &.");
        return false;
      }

      // Check for duplicate brand name (only for new brands)
      if (this.editIndex === null) {
        try {
          const existingBrands = await axios.get("http://localhost:8080/thuong-hieu/hien-thi");
          const brandExists = existingBrands.data.some(brand =>
            brand.ten && brand.ten.toLowerCase() === this.newBrand.ten.trim().toLowerCase()
          );
          if (brandExists) {
            toast.error("Tên thương hiệu đã được sử dụng.");
            return false;
          }
        } catch (error) {
          console.error("Error checking brand uniqueness:", error);
        }
      }

      return true;
    },

    async saveBrand() {
      if (!(await this.validateBrand())) {
        return;
      }

      try {
        if (this.editIndex === null) {
          const res = await axios.post(
            "http://localhost:8080/thuong-hieu/add",
            this.newBrand
          );
          this.brands.push(res.data);
          toast.success("Thêm thương hiệu thành công!");
        } else {
          const brandId = this.brands[this.editIndex].id;
          const res = await axios.put(
            `http://localhost:8080/thuong-hieu/update/${brandId}`,
            this.newBrand
          );
          this.brands.splice(this.editIndex, 1, res.data);
          toast.success("Cập nhật thương hiệu thành công!");
        }
        this.closeModal();
      } catch (err) {
        console.error("Lỗi khi lưu thương hiệu:", err);
        toast.error("Có lỗi xảy ra khi lưu thương hiệu!");
      }
    },
    editBrand(index) {
      this.editIndex = index;
      this.newBrand = { ...this.brands[index] };
      this.showModal = true;
    },
    async deleteBrand(index) {
      const brand = this.brands[index];
      if (confirm("Xác nhận xoá thương hiệu này?")) {
        try {
          await axios.delete(
            `http://localhost:8080/thuong-hieu/delete/${brand.id}`
          );
          this.brands.splice(index, 1);
          toast.success("Xóa thương hiệu thành công!");
        } catch (err) {
          console.error("Lỗi khi xoá thương hiệu:", err);
          toast.error("Có lỗi xảy ra khi xoá thương hiệu!");
        }
      }
    }
  },
  mounted() {
    this.fetchBrands();
  }
};
</script>
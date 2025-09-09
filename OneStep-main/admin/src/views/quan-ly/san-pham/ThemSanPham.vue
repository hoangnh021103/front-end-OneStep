<template>
  <div class="container">
    <div class="header">
      <h2>Thêm sản phẩm</h2>
      <button class="btn-back" @click="$router.push({ name: 'SanPham' })">
        <i class="fa fa-arrow-left"></i> Quay lại danh sách
      </button>
    </div>
    <div class="form-card">
      <div class="form-grid">
        <div class="form-group">
          <label>Tên sản phẩm *</label>
          <input
            v-model="form.tenSanPham"
            type="text"
            placeholder="Nhập tên sản phẩm"
            :class="{ 'error': errors.tenSanPham }"
          />
          <span class="error-message" v-if="errors.tenSanPham">{{ errors.tenSanPham }}</span>
        </div>
        <div class="form-group">
          <label>Mô tả</label>
          <textarea
            v-model="form.moTa"
            rows="4"
            placeholder="Nhập mô tả"
            :class="{ 'error': errors.moTa }"
          ></textarea>
          <span class="error-message" v-if="errors.moTa">{{ errors.moTa }}</span>
        </div>
        <div class="form-group">
          <label>Ảnh đại diện *</label>
          <div
            class="image-upload-container"
            @click="$refs.fileInput.click()"
            :class="{ 'uploading': isUploading }"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none;"
              @change="handleImageUpload"
            />
            <div v-if="!imageUrl" class="image-placeholder">
              Chọn ảnh đại diện
            </div>
            <img
              v-else
              :src="imageUrl"
              class="image-preview"
              style="width: 250px; height: 250px; object-fit: cover; border-radius: 8px;"
            />
            <div v-if="isUploading" class="loading-overlay">
              <i class="fa fa-spinner fa-spin"></i>
            </div>
          </div>
          <span class="error-message" v-if="errors.duongDanAnh">{{ errors.duongDanAnh }}</span>
        </div>
        <div class="form-group">
          <label>Trạng thái</label>
          <select v-model="form.trangThai" :class="{ 'error': errors.trangThai }">
            <option :value="1">Còn hàng</option>
            <option :value="0">Hết hàng</option>
          </select>
          <span class="error-message" v-if="errors.trangThai">{{ errors.trangThai }}</span>
        </div>
      </div>
      <div class="actions">
        <button
          class="btn-primary"
          @click="handleSubmit"
          :disabled="isSubmitting"
        >
          <i class="fa fa-check"></i> {{ isSubmitting ? 'Đang lưu...' : 'Lưu' }}
        </button>
        <button
          class="btn-secondary"
          @click="$router.push({ name: 'SanPham' })"
          :disabled="isSubmitting"
        >
          <i class="fa fa-times"></i> Huỷ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { sanPhamApi } from '@/api/sanPhamApi';
import { toast } from 'vue3-toastify';

export default {
  name: 'ThemSanPham',
  data() {
    return {
      form: {
        tenSanPham: '',
        moTa: '',
        duongDanAnh: null,
        trangThai: 1
      },
      imageUrl: null,
      isSubmitting: false,
      isUploading: false,
      errors: {
        tenSanPham: '',
        moTa: '',
        duongDanAnh: '',
        trangThai: ''
      }
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

 

      this.isUploading = true;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result;
        this.form.duongDanAnh = file;
        this.errors.duongDanAnh = '';
        this.isUploading = false;
      };
      reader.readAsDataURL(file);
    },
    validateForm() {
      this.errors = { tenSanPham: '', moTa: '', duongDanAnh: '', trangThai: '' };
      let isValid = true;

      if (!this.form.tenSanPham.trim()) {
        this.errors.tenSanPham = 'Tên sản phẩm là bắt buộc.';
        isValid = false;
      }
      if (!this.form.duongDanAnh) {
        this.errors.duongDanAnh = 'Ảnh đại diện là bắt buộc.';
        isValid = false;
      }
      if (this.form.trangThai !== 0 && this.form.trangThai !== 1) {
        this.errors.trangThai = 'Vui lòng chọn trạng thái hợp lệ.';
        isValid = false;
      }
      return isValid;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      try {
        this.isSubmitting = true;
        this.isUploading = true;

        const formData = new FormData();
        formData.append('tenSanPham', this.form.tenSanPham);
        formData.append('moTa', this.form.moTa);
        formData.append('trangThai', this.form.trangThai);
        if (this.form.duongDanAnh) {
          formData.append('duongDanAnh', this.form.duongDanAnh);
        }

        // Debug FormData
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        await sanPhamApi.themSanPham(formData);
        toast.success('Thêm sản phẩm thành công!');
        this.$router.push({ name: 'SanPham' });
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Không xác định';
        console.error('Lỗi khi thêm sản phẩm:', msg, err);
        this.$message.error(`Không thể thêm sản phẩm: ${msg}`);
      } finally {
        this.isSubmitting = false;
        this.isUploading = false;
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.form-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}
input,
select,
textarea {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  transition: border-color 0.3s;
}
input:focus,
select:focus,
textarea:focus {
  border-color: #4f46e5;
  outline: none;
}
.error {
  border-color: #e53e3e;
}
.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}
.image-upload-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 250px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  transition: border-color 0.3s;
}
.image-upload-container:hover {
  border-color: #4f46e5;
}
.image-placeholder {
  color: #888;
  font-size: 14px;
  text-align: center;
}
.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}
.actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}
.btn-primary {
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}
.btn-primary:hover {
  background: #4338ca;
}
.btn-primary:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}
.btn-secondary, .btn-back {
  background: #e5e7eb;
  color: #111827;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}
.btn-secondary:hover, .btn-back:hover {
  background: #d1d5db;
}
</style>
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
          <label>Mã code</label>
          <input
            v-model="form.maCode"
            type="text"
            placeholder="Nhập mã code"
            :class="{ 'error': errors.maCode }"
          />
          <span class="error-message" v-if="errors.maCode">{{ errors.maCode }}</span>
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
          <label>Thương hiệu *</label>
          <select v-model="form.thuongHieuId" :class="{ 'error': errors.thuongHieuId }">
            <option value="0" disabled>Chọn thương hiệu</option>
            <option v-for="thuongHieu in thuongHieuList" :key="thuongHieu.id" :value="thuongHieu.id">
              {{ thuongHieu.ten }}
            </option>
          </select>
          <span class="error-message" v-if="errors.thuongHieuId">{{ errors.thuongHieuId }}</span>
        </div>
        <div class="form-group">
          <label>Chất liệu *</label>
          <select v-model="form.chatLieuId" :class="{ 'error': errors.chatLieuId }">
            <option value="0" disabled>Chọn chất liệu</option>
            <option v-for="chatLieu in chatLieuList" :key="chatLieu.id" :value="chatLieu.id">
              {{ chatLieu.ten }}
            </option>
          </select>
          <span class="error-message" v-if="errors.chatLieuId">{{ errors.chatLieuId }}</span>
        </div>
        <div class="form-group">
          <label>Đế giày *</label>
          <select v-model="form.deGiayId" :class="{ 'error': errors.deGiayId }">
            <option value="0" disabled>Chọn đế giày</option>
            <option v-for="deGiay in deGiayList" :key="deGiay.id" :value="deGiay.id">
              {{ deGiay.ten }}
            </option>
          </select>
          <span class="error-message" v-if="errors.deGiayId">{{ errors.deGiayId }}</span>
        </div>
        <div class="form-group">
          <label>Kiểu dáng *</label>
<select v-model="form.kieuDangId" :class="{ 'error': errors.kieuDangId }">
            <option value="0" disabled>Chọn kiểu dáng</option>
            <option v-for="kieuDang in kieuDangList" :key="kieuDang.id" :value="kieuDang.id">
              {{ kieuDang.ten }}
            </option>
          </select>
          <span class="error-message" v-if="errors.kieuDangId">{{ errors.kieuDangId }}</span>
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
          <label>Trạng thái *</label>
          <select v-model="form.trangThai" :class="{ 'error': errors.trangThai }">
            <option value="1">Còn hàng</option>
            <option value="0">Hết hàng</option>
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
          <i class="fa fa-times"></i> Hủy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
  name: 'ThemSanPham',
  data() {
    return {
      form: {
        tenSanPham: '',
        maCode: '',
        moTa: '',
        thuongHieuId: 0,
        chatLieuId: 0,
        deGiayId: 0,
        kieuDangId: 0,
        duongDanAnh: null,
        trangThai: 1,
        ngayCapNhat: new Date().toISOString().split('T')[0],
        daXoa: 0,
      },
      imageUrl: null,
      isSubmitting: false,
      isUploading: false,
      errors: {
        tenSanPham: '',
        maCode: '',
        moTa: '',
        thuongHieuId: '',
        chatLieuId: '',
deGiayId: '',
        kieuDangId: '',
        duongDanAnh: '',
        trangThai: '',
      },
      thuongHieuList: [],
      chatLieuList: [],
      deGiayList: [],
      kieuDangList: [],
    };
  },
  methods: {
    async fetchThuongHieu() {
      try {
        const response = await fetch('http://localhost:8080/thuong-hieu/hien-thi');
        const data = await response.json();
        this.thuongHieuList = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        toast('Không thể tải danh sách thương hiệu.');
      }
    },
    async fetchChatLieu() {
      try {
        const response = await fetch('http://localhost:8080/chat-lieu/hien-thi');
        const data = await response.json();
        this.chatLieuList = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        toast('Không thể tải danh sách chất liệu.');
      }
    },
    async fetchDeGiay() {
      try {
        const response = await fetch('http://localhost:8080/de-giay/hien-thi');
        const data = await response.json();
        this.deGiayList = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        toast('Không thể tải danh sách đế giày.');
      }
    },
    async fetchKieuDang() {
      try {
        const response = await fetch('http://localhost:8080/kieu-dang/hien-thi');
        const data = await response.json();
        this.kieuDangList = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        toast('Không thể tải danh sách kiểu dáng.');
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSize) {
        this.errors.duongDanAnh = 'Kích thước ảnh không được vượt quá 5MB.';
        return;
      }

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
      this.errors = {
        tenSanPham: '',
        maCode: '',
        moTa: '',
        thuongHieuId: '',
        chatLieuId: '',
        deGiayId: '',
        kieuDangId: '',
        duongDanAnh: '',
        trangThai: '',
      };
      let isValid = true;

      if (!this.form.tenSanPham.trim()) {
        this.errors.tenSanPham = 'Tên sản phẩm là bắt buộc.';
        isValid = false;
      }
      if (!this.form.thuongHieuId) {
        this.errors.thuongHieuId = 'Thương hiệu là bắt buộc.';
        isValid = false;
      }
      if (!this.form.chatLieuId) {
        this.errors.chatLieuId = 'Chất liệu là bắt buộc.';
        isValid = false;
      }
      if (!this.form.deGiayId) {
        this.errors.deGiayId = 'Đế giày là bắt buộc.';
        isValid = false;
      }
if (!this.form.kieuDangId) {
        this.errors.kieuDangId = 'Kiểu dáng là bắt buộc.';
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
        formData.append('maCode', this.form.maCode);
        formData.append('moTa', this.form.moTa);
        formData.append('thuongHieuId', this.form.thuongHieuId);
        formData.append('chatLieuId', this.form.chatLieuId);
        formData.append('deGiayId', this.form.deGiayId);
        formData.append('kieuDangId', this.form.kieuDangId);
        if (this.form.duongDanAnh) {
          formData.append('duongDanAnh', this.form.duongDanAnh);
        }
        formData.append('trangThai', this.form.trangThai);
        formData.append('ngayCapNhat', this.form.ngayCapNhat);
        formData.append('daXoa', this.form.daXoa);

        await fetch('http://localhost:8080/san-pham/add', {
          method: 'POST',
          body: formData,
        });
        toast.success('Thêm sản phẩm thành công!');
        this.$router.push({ name: 'SanPham' });
      } catch (err) {
        toast('Không thể thêm sản phẩm.');
      } finally {
        this.isSubmitting = false;
        this.isUploading = false;
      }
    },
  },
  mounted() {
    this.fetchThuongHieu();
    this.fetchChatLieu();
    this.fetchDeGiay();
    this.fetchKieuDang();
  },
};
</script>
<style>
.container {
  max-width: 1100px;
  margin: 30px auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header h2 {
  font-size: 26px;
  font-weight: 600;
  color: #222;
}

.btn-back {
  background: #f1f1f1;
  color: #444;
  border: 1px solid #ddd;
  padding: 8px 14px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-back:hover {
  background: #e5e5e5;
  color: #000;
}

/* Card */
.form-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 30px;
}

/* Grid layout */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* Group input */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 12px;
border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

textarea {
  resize: none;
}

/* Error */
.error {
  border-color: #e63946 !important;
}

.error-message {
  margin-top: 4px;
  font-size: 13px;
  color: #e63946;
}

/* Upload ảnh */
.image-upload-container {
  border: 2px dashed #aaa;
  border-radius: 10px;
  text-align: center;
  padding: 25px;
  cursor: pointer;
  position: relative;
  background: #fafafa;
  transition: 0.3s;
}

.image-upload-container:hover {
  border-color: #4f46e5;
  background: #f9f9ff;
}

.image-placeholder {
  color: #666;
  font-size: 15px;
}

.image-preview {
  border-radius: 10px;
  max-width: 100%;
  height: auto;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Actions */
.actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

button {
  font-size: 15px;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: 0.3s;
}

/* Primary */
.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

/* Secondary */
.btn-secondary {
  background: #f3f4f6;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    gap: 15px;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .actions button {
    width: 100%;
  }
}
</style>

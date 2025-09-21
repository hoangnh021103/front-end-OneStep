<template>
  <div class="container">
    <div v-if="!isDataLoaded && !error" class="loading">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <div class="header">
        <h2>{{ isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm' }}</h2>
        <button class="btn-back" @click="$router.push({ name: 'SanPham' })">
          <i class="fa fa-arrow-left"></i> Quay lại danh sách
        </button>
      </div>
      <div class="form-card">
        <div class="form-grid">
          <div class="form-group">
            <label>Tên sản phẩm *</label>
            <input v-model="form.tenSanPham" type="text" placeholder="Nhập tên sản phẩm"
              :class="{ 'error': errors.tenSanPham }" />
            <span class="error-message" v-if="errors.tenSanPham">{{ errors.tenSanPham }}</span>
          </div>
          <div class="form-group">
            <label>Mã code</label>
            <input v-model="form.maCode" type="text" placeholder="Nhập mã code" :class="{ 'error': errors.maCode }" />
            <span class="error-message" v-if="errors.maCode">{{ errors.maCode }}</span>
          </div>
          <div class="form-group">
            <label>Mô tả</label>
            <textarea v-model="form.moTa" rows="4" placeholder="Nhập mô tả"
              :class="{ 'error': errors.moTa }"></textarea>
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
            <label>Ảnh đại diện *</label>
            <div class="image-upload-container" @click="$refs.fileInput.click()" :class="{ 'uploading': isUploading }">
              <input ref="fileInput" type="file" accept="image/*" style="display: none;" @change="handleImageUpload" />
              <div v-if="!imageUrl" class="image-placeholder">
                Chọn ảnh đại diện
              </div>
              <img v-else :src="imageUrl" class="image-preview"
                style="width: 250px; height: 250px; object-fit: cover; border-radius: 8px;" />
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
          <button class="btn-primary" @click="handleSubmit" :disabled="isSubmitting || !isDataLoaded">
            <i class="fa fa-check"></i> {{ isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Lưu') }}
          </button>
          <button class="btn-secondary" @click="$router.push({ name: 'SanPham' })" :disabled="isSubmitting">
            <i class="fa fa-times"></i> Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from 'axios';
import { sanPhamApi } from '@/api/sanPhamApi.js';

export default {
  name: 'ThemSanPham',
  data() {
    return {
      form: {
        maSanPham: null,
        tenSanPham: '',
        maCode: '',
        moTa: '',
        thuongHieuId: 0,
        chatLieuId: 0,
        deGiayId: 0,
        duongDanAnh: null,
        trangThai: 1,
        ngayCapNhat: new Date().toISOString().split('T')[0],
        daXoa: 0,
      },
      imageUrl: null,
      originalImageUrl: null, // Lưu URL ảnh gốc khi edit
      isSubmitting: false,
      isUploading: false,
      isEditing: false,
      isDataLoaded: false,
      error: null,
      errors: {
        tenSanPham: '',
        maCode: '',
        moTa: '',
        thuongHieuId: '',
        chatLieuId: '',
        deGiayId: '',
        duongDanAnh: '',
        trangThai: '',
      },
      thuongHieuList: [],
      chatLieuList: [],
      deGiayList: [],
    };
  },
  methods: {
    async fetchThuongHieu() {
      try {
        const response = await fetch('http://localhost:8080/thuong-hieu/hien-thi');
        const data = await response.json();
        this.thuongHieuList = Array.isArray(data) ? data : data.data || [];
        if (this.thuongHieuList.length === 0) {
          throw new Error('Danh sách thương hiệu trống.');
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách thương hiệu:', err);
        this.error = 'Không thể tải danh sách thương hiệu: ' + err.message;
        toast.error(this.error);
      }
    },
    async fetchChatLieu() {
      try {
        const response = await fetch('http://localhost:8080/chat-lieu/hien-thi');
        const data = await response.json();
        this.chatLieuList = Array.isArray(data) ? data : data.data || [];
        if (this.chatLieuList.length === 0) {
          throw new Error('Danh sách chất liệu trống.');
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách chất liệu:', err);
        this.error = 'Không thể tải danh sách chất liệu: ' + err.message;
        toast.error(this.error);
      }
    },
    async fetchDeGiay() {
      try {
        const response = await fetch('http://localhost:8080/de-giay/hien-thi');
        const data = await response.json();
        this.deGiayList = Array.isArray(data) ? data : data.data || [];
        if (this.deGiayList.length === 0) {
          throw new Error('Danh sách đế giày trống.');
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách đế giày:', err);
        this.error = 'Không thể tải danh sách đế giày: ' + err.message;
        toast.error(this.error);
      }
    },
    async fetchSanPham() {
      const id = this.$route.params.id;
      if (id) {
        console.log('Chỉnh sửa sản phẩm với ID:', id);
        try {
          this.isSubmitting = true;
          const sanPham = await sanPhamApi.layChiTietSanPham(id);
          
          this.form = {
            maSanPham: sanPham.maSanPham || sanPham.id,
            tenSanPham: sanPham.tenSanPham || '',
            maCode: sanPham.maCode || '',
            moTa: sanPham.moTa || '',
            thuongHieuId: sanPham.thuongHieuId || 0,
            chatLieuId: sanPham.chatLieuId || 0,
            deGiayId: sanPham.deGiayId || 0,
            duongDanAnh: null, // Không set file vào form
            trangThai: sanPham.trangThai || 1,
            ngayCapNhat: sanPham.ngayCapNhat || new Date().toISOString().split('T')[0],
            daXoa: sanPham.daXoa || 0,
          };
          
          // Lưu URL ảnh gốc và hiển thị
          this.originalImageUrl = sanPham.duongDanAnh || null;
          this.imageUrl = this.originalImageUrl;
          this.isEditing = true;
          
          toast.info('Đã tải thông tin sản phẩm');
        } catch (err) {
          console.error('Lỗi khi tải thông tin sản phẩm:', err);
          this.error = 'Không thể tải thông tin sản phẩm: ' + err.message;
          toast.error(this.error);
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.errors.duongDanAnh = 'Vui lòng chọn file ảnh.';
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (file.size > maxSize) {
        this.errors.duongDanAnh = 'Kích thước ảnh không được vượt quá 5MB.';
        return;
      }
      this.isUploading = true;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result; // Hiển thị ảnh mới
        this.form.duongDanAnh = file; // Lưu file mới
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
        duongDanAnh: '',
        trangThai: '',
      };
      let isValid = true;

      if (!this.form.tenSanPham || !this.form.tenSanPham.trim()) {
        this.errors.tenSanPham = 'Tên sản phẩm là bắt buộc.';
        isValid = false;
      }

      if (!this.form.thuongHieuId || this.form.thuongHieuId === 0 || this.form.thuongHieuId === '0') {
        this.errors.thuongHieuId = 'Thương hiệu là bắt buộc.';
        isValid = false;
      }

      if (!this.form.chatLieuId || this.form.chatLieuId === 0 || this.form.chatLieuId === '0') {
        this.errors.chatLieuId = 'Chất liệu là bắt buộc.';
        isValid = false;
      }

      if (!this.form.deGiayId || this.form.deGiayId === 0 || this.form.deGiayId === '0') {
        this.errors.deGiayId = 'Đế giày là bắt buộc.';
        isValid = false;
      }

      // Kiểm tra ảnh
      if (!this.isEditing) {
        // Thêm mới: bắt buộc phải có ảnh
        if (!this.form.duongDanAnh) {
          this.errors.duongDanAnh = 'Ảnh đại diện là bắt buộc.';
          isValid = false;
        }
      } else {
        // Chỉnh sửa: phải có ảnh cũ hoặc ảnh mới
        if (!this.originalImageUrl && !this.form.duongDanAnh) {
          this.errors.duongDanAnh = 'Ảnh đại diện là bắt buộc.';
          isValid = false;
        }
      }

      // SỬA: Validation trạng thái - chấp nhận cả 0 và 1
      const trangThai = Number(this.form.trangThai);
      if (trangThai !== 0 && trangThai !== 1) {
        this.errors.trangThai = 'Vui lòng chọn trạng thái hợp lệ.';
        isValid = false;
      }

      return isValid;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        toast.error('Vui lòng điền đầy đủ thông tin.');
        return;
      }

      try {
        this.isSubmitting = true;
        this.isUploading = true;

        const formData = new FormData();
        
        if (this.isEditing && this.form.maSanPham) {
          formData.append('maSanPham', this.form.maSanPham.toString());
        }

        formData.append('tenSanPham', this.form.tenSanPham);
        formData.append('maCode', this.form.maCode);
        formData.append('moTa', this.form.moTa);
        formData.append('thuongHieuId', Number(this.form.thuongHieuId).toString());
        formData.append('chatLieuId', Number(this.form.chatLieuId).toString());
        formData.append('deGiayId', Number(this.form.deGiayId).toString());
        
        // SỬA: Xử lý ảnh - chỉ append khi có ảnh mới được chọn
        if (this.form.duongDanAnh && this.form.duongDanAnh instanceof File) {
          formData.append('duongDanAnh', this.form.duongDanAnh);
        }
        
        formData.append('trangThai', Number(this.form.trangThai).toString());
        formData.append('ngayCapNhat', this.form.ngayCapNhat);
        formData.append('daXoa', Number(this.form.daXoa).toString());

        console.log('FormData keys:', Array.from(formData.keys()));
        for (let [key, value] of formData.entries()) {
          if (key !== 'duongDanAnh') {
            console.log(`${key}: ${value}`);
          } else {
            console.log(`${key}: File được chọn`);
          }
        }

        let result;
        if (this.isEditing && this.form.maSanPham) {
          // Sử dụng axios để gửi FormData cho update
          const response = await axios.put(`http://localhost:8080/san-pham/update/${this.form.maSanPham}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          result = response.data;
        } else {
          // Sử dụng axios để gửi FormData cho add
          const response = await axios.post('http://localhost:8080/san-pham/add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          result = response.data;
        }
        
        toast.success(this.isEditing ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
        this.$router.push({ name: 'SanPham' });
      } catch (err) {
        const action = this.isEditing ? 'cập nhật' : 'thêm';
        console.error(`Lỗi khi ${action} sản phẩm:`, err);
        toast.error(`Không thể ${action} sản phẩm: ${err.message}`);
      } finally {
        this.isSubmitting = false;
        this.isUploading = false;
      }
    },
    async loadData() {
      try {
        await Promise.all([
          this.fetchThuongHieu(),
          this.fetchChatLieu(),
          this.fetchDeGiay(),
          this.fetchSanPham(),
        ]);
        this.isDataLoaded =
          this.thuongHieuList.length > 0 &&
          this.chatLieuList.length > 0 &&
          this.deGiayList.length > 0;
      } catch (err) {
        this.error = 'Lỗi khi tải dữ liệu: ' + err.message;
        toast.error(this.error);
      }
    },
  },
  mounted() {
    this.loadData();
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

.loading {
  text-align: center;
  padding: 20px;
  color: #555;
}

.error-message {
  text-align: center;
  padding: 20px;
  color: #e63946;
  font-size: 16px;
}

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

.form-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

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

.error {
  border-color: #e63946 !important;
}

.error-message {
  margin-top: 4px;
  font-size: 13px;
  color: #e63946;
}

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

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-secondary {
  background: #f3f4f6;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

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
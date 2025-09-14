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
        kieuDangId: 0,
        duongDanAnh: null,
        trangThai: 1,
        ngayCapNhat: new Date().toISOString().split('T')[0],
        daXoa: 0,
      },
      imageUrl: null,
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
    async fetchKieuDang() {
      try {
        const response = await fetch('http://localhost:8080/kieu-dang/hien-thi');
        const data = await response.json();
        this.kieuDangList = Array.isArray(data) ? data : data.data || [];
        if (this.kieuDangList.length === 0) {
          throw new Error('Danh sách kiểu dáng trống.');
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách kiểu dáng:', err);
        this.error = 'Không thể tải danh sách kiểu dáng: ' + err.message;
        toast.error(this.error);
      }
    },
    async fetchSanPham() {
      const id = this.$route.params.id;
      if (id) {
        console.log('Chỉnh sửa sản phẩm với ID:', id);
        try {
          this.isSubmitting = true;
          const response = await axios.get(`http://localhost:8080/san-pham/${id}`);
          const sanPham = response.data;
          this.form = {
            maSanPham: sanPham.maSanPham || sanPham.id,
            tenSanPham: sanPham.tenSanPham || '',
            maCode: sanPham.maCode || '',
            moTa: sanPham.moTa || '',
            thuongHieuId: sanPham.thuongHieuId || 0,
            chatLieuId: sanPham.chatLieuId || 0,
            deGiayId: sanPham.deGiayId || 0,
            kieuDangId: sanPham.kieuDangId || 0,
            duongDanAnh: null,
            trangThai: sanPham.trangThai || 1,
            ngayCapNhat: sanPham.ngayCapNhat || new Date().toISOString().split('T')[0],
            daXoa: sanPham.daXoa || 0,
          };
          this.imageUrl = sanPham.duongDanAnh || null;
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
      if (!file) return;

      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {
        this.errors.duongDanAnh = 'Chỉ hỗ trợ định dạng JPG, PNG, GIF.';
        return;
      }

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
      if (!this.form.thuongHieuId || this.form.thuongHieuId === 0) {
        this.errors.thuongHieuId = 'Thương hiệu là bắt buộc.';
        isValid = false;
      }
      if (!this.form.chatLieuId || this.form.chatLieuId === 0) {
        this.errors.chatLieuId = 'Chất liệu là bắt buộc.';
        isValid = false;
      }
      if (!this.form.deGiayId || this.form.deGiayId === 0) {
        this.errors.deGiayId = 'Đế giày là bắt buộc.';
        isValid = false;
      }
      if (!this.form.kieuDangId || this.form.kieuDangId === 0) {
        this.errors.kieuDangId = 'Kiểu dáng là bắt buộc.';
        isValid = false;
      }
      if (!this.form.duongDanAnh && !this.isEditing) {
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
      if (!this.validateForm()) {
        toast.error('Vui lòng điền đầy đủ thông tin.');
        return;
      }

      try {
        this.isSubmitting = true;
        this.isUploading = true;

        const formData = new FormData();
        formData.append('tenSanPham', this.form.tenSanPham);
        formData.append('maCode', this.form.maCode);
        formData.append('moTa', this.form.moTa);
        formData.append('thuongHieuId', Number(this.form.thuongHieuId));
        formData.append('chatLieuId', Number(this.form.chatLieuId));
        formData.append('deGiayId', Number(this.form.deGiayId));
        formData.append('kieuDangId', Number(this.form.kieuDangId));
        if (this.form.duongDanAnh) {
          formData.append('duongDanAnh', this.form.duongDanAnh);
        }
        formData.append('trangThai', Number(this.form.trangThai));
        formData.append('ngayCapNhat', this.form.ngayCapNhat);
        formData.append('daXoa', Number(this.form.daXoa));

        if (this.isEditing && this.form.maSanPham) {
          // Cập nhật sản phẩm
          const response = await fetch(`http://localhost:8080/san-pham/update/${this.form.maSanPham}`, {
            method: 'PUT',
            body: formData,
          });
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}, Thông báo: ${errorData}`);
          }
          toast.success('Cập nhật sản phẩm thành công!');
        } else {
          // Thêm mới sản phẩm
          const response = await fetch('http://localhost:8080/san-pham/add', {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}, Thông báo: ${errorData}`);
          }
          toast.success('Thêm sản phẩm thành công!');
        }

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
          this.fetchKieuDang(),
          this.fetchSanPham(),
        ]);
        this.isDataLoaded =
          this.thuongHieuList.length > 0 &&
          this.chatLieuList.length > 0 &&
          this.deGiayList.length > 0 &&
          this.kieuDangList.length > 0;
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
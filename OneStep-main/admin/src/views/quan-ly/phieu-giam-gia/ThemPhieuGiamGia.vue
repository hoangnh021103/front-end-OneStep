<template>
  <div class="container">
    <div class="header">
      <h2>{{ isEditing ? 'Chỉnh sửa phiếu giảm giá' : 'Thêm phiếu giảm giá' }}</h2>
      <button class="btn-back" @click="$router.push({ name: 'PhieuGiamGia' })">
        <i class="fa fa-arrow-left"></i> Quay lại danh sách
      </button>
    </div>
    <div class="form-card">
      <div class="form-grid">
        <div class="form-group">
          <label>Mã phiếu *</label>
          <input
            v-model="form.ma"
            type="text"
            placeholder="Nhập mã phiếu"
            :class="{ 'error': errors.ma }"
          />
          <span class="error-message" v-if="errors.ma">{{ errors.ma }}</span>
        </div>
        <div class="form-group">
          <label>Tên phiếu *</label>
          <input
            v-model="form.ten"
            type="text"
            placeholder="Nhập tên phiếu"
            :class="{ 'error': errors.ten }"
          />
          <span class="error-message" v-if="errors.ten">{{ errors.ten }}</span>
        </div>
        <div class="form-group">
          <label>Loại giảm *</label>
          <select v-model="form.loai" :class="{ 'error': errors.loai }">
            <option :value="0">Phần trăm</option>
            <option :value="1">Tiền mặt</option>
          </select>
          <span class="error-message" v-if="errors.loai">{{ errors.loai }}</span>
        </div>
        <div class="form-group">
          <label>Giá trị *</label>
          <input
            v-model.number="form.giaTri"
            type="number"
            min="0"
            placeholder="Nhập giá trị giảm"
            :class="{ 'error': errors.giaTri }"
          />
          <span class="error-message" v-if="errors.giaTri">{{ errors.giaTri }}</span>
        </div>
        <div class="form-group">
          <label>Điều kiện (đồng) *</label>
          <input
            v-model.number="form.dieuKien"
            type="number"
            min="0"
            placeholder="Nhập điều kiện áp dụng"
            :class="{ 'error': errors.dieuKien }"
          />
          <span class="error-message" v-if="errors.dieuKien">{{ errors.dieuKien }}</span>
        </div>
        <div class="form-group">
          <label>Số lượng *</label>
          <input
            v-model.number="form.soLuong"
            type="number"
            min="0"
            placeholder="Nhập số lượng phiếu"
            :class="{ 'error': errors.soLuong }"
          />
          <span class="error-message" v-if="errors.soLuong">{{ errors.soLuong }}</span>
        </div>
        <div class="form-group">
          <label>Ngày bắt đầu *</label>
          <input
            v-model="form.ngayBatDau"
            type="date"
            :class="{ 'error': errors.ngayBatDau }"
          />
          <span class="error-message" v-if="errors.ngayBatDau">{{ errors.ngayBatDau }}</span>
        </div>
        <div class="form-group">
          <label>Ngày kết thúc *</label>
          <input
            v-model="form.ngayKetThuc"
            type="date"
            :class="{ 'error': errors.ngayKetThuc }"
          />
          <span class="error-message" v-if="errors.ngayKetThuc">{{ errors.ngayKetThuc }}</span>
        </div>

      </div>
      <div class="actions">
        <button
          class="btn-primary"
          @click="handleSubmit"
          :disabled="isSubmitting"
        >
          <i class="fa fa-check"></i> {{ isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Lưu') }}
        </button>
        <button
          class="btn-secondary"
          @click="$router.push({ name: 'PhieuGiamGia' })"
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
import axios from 'axios';

export default {
  name: 'ThemPhieuGiamGia',
  data() {
    return {
      form: {
        id: null,
        ma: '',
        ten: '',
        loai: 0,
        giaTri: 0,
        dieuKien: 0,
        soLuong: 0,
        ngayBatDau: '',
        ngayKetThuc: '',
        ngayCapNhat: new Date().toISOString().split('T')[0],
        nguoiTao: '',
        nguoiCapNhat: ''
      },
      isSubmitting: false,
      isEditing: false,
      errors: {
        ma: '',
        ten: '',
        loai: '',
        giaTri: '',
        dieuKien: '',
        soLuong: '',
        ngayBatDau: '',
        ngayKetThuc: ''
      }
    };
  },
  methods: {
    async fetchVoucherData() {
      const id = this.$route.params.id;
      if (id) {
        try {
          this.isSubmitting = true;
          const response = await axios.get(`http://localhost:8080/voucher/${id}`);
          const voucher = response.data;
          
          this.form = {
            id: voucher.id,
            ma: voucher.ma,
            ten: voucher.ten,
            loai: voucher.loai,
            giaTri: voucher.giaTri,
            dieuKien: voucher.dieuKien,
            soLuong: voucher.soLuong,
            ngayBatDau: voucher.ngayBatDau,
            ngayKetThuc: voucher.ngayKetThuc,
            ngayCapNhat: new Date().toISOString().split('T')[0],
            nguoiTao: voucher.nguoiTao,
            nguoiCapNhat: voucher.nguoiCapNhat
          };
          
          this.isEditing = true;
          toast.info('Đã tải thông tin phiếu giảm giá');
        } catch (error) {
        console.error('Lỗi khi tải thông tin phiếu giảm giá:', error);
        toast.error('Không thể tải thông tin phiếu giảm giá');
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    validateForm() {
      this.errors = {
        ma: '',
        ten: '',
        loai: '',
        giaTri: '',
        dieuKien: '',
        soLuong: '',
        ngayBatDau: '',
        ngayKetThuc: ''
      };
      let isValid = true;

      if (!this.form.ma.trim()) {
        this.errors.ma = 'Mã phiếu là bắt buộc.';
        isValid = false;
      }
      if (!this.form.ten.trim()) {
        this.errors.ten = 'Tên phiếu là bắt buộc.';
        isValid = false;
      }
      if (this.form.giaTri <= 0) {
        this.errors.giaTri = 'Giá trị phải lớn hơn 0.';
        isValid = false;
      }
      if (this.form.dieuKien < 0) {
        this.errors.dieuKien = 'Điều kiện không được âm.';
        isValid = false;
      }
      if (this.form.soLuong <= 0) {
        this.errors.soLuong = 'Số lượng phải lớn hơn 0.';
        isValid = false;
      }
      if (!this.form.ngayBatDau) {
        this.errors.ngayBatDau = 'Ngày bắt đầu là bắt buộc.';
        isValid = false;
      }
      if (!this.form.ngayKetThuc) {
        this.errors.ngayKetThuc = 'Ngày kết thúc là bắt buộc.';
        isValid = false;
      }
      if (this.form.ngayBatDau && this.form.ngayKetThuc && new Date(this.form.ngayBatDau) > new Date(this.form.ngayKetThuc)) {
        this.errors.ngayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu.';
        isValid = false;
      }
      
      return isValid;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      try {
        this.isSubmitting = true;

        const formData = new FormData();
        formData.append('ma', this.form.ma);
        formData.append('ten', this.form.ten);
        formData.append('loai', this.form.loai);
        formData.append('giaTri', this.form.giaTri);
        formData.append('dieuKien', this.form.dieuKien);
        formData.append('soLuong', this.form.soLuong);
        formData.append('ngayBatDau', this.form.ngayBatDau);
        formData.append('ngayKetThuc', this.form.ngayKetThuc);
        formData.append('ngayCapNhat', this.form.ngayCapNhat);

        if (this.isEditing && this.form.id) {
          // Cập nhật phiếu giảm giá
          await fetch(`http://localhost:8080/voucher/update/${this.form.id}`, {
            method: 'PUT',
            body: formData,
          });
          toast.success('Cập nhật phiếu giảm giá thành công!');
        } else {
          // Thêm mới phiếu giảm giá
          await fetch('http://localhost:8080/voucher/add', {
            method: 'POST',
            body: formData,
          });
          toast.success('Thêm phiếu giảm giá thành công!');
        }
        
        this.$router.push({ name: 'PhieuGiamGia' });
      } catch (err) {
        const action = this.isEditing ? 'cập nhật' : 'thêm';
        toast(`Không thể ${action} phiếu giảm giá.`);
        console.error(`Lỗi khi ${action} phiếu giảm giá:`, err);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  mounted() {
    this.fetchVoucherData();
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
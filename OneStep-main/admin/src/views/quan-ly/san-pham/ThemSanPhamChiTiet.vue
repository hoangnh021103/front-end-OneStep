<template>
  <div class="container">
    <div v-if="!isDataLoaded && !error" class="loading">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <div class="header">
        <h2>{{ isEditing ? 'Chỉnh sửa sản phẩm chi tiết' : 'Thêm sản phẩm chi tiết' }}</h2>
        <button class="btn-back" @click="$router.push({ name: 'SanPham' })">
          <i class="fa fa-arrow-left"></i> Quay lại danh sách
        </button>
      </div>
      <div class="form-card">
        <div class="form-grid">
          <div class="form-group">
            <label>Sản phẩm *</label>
            <select
              v-model.number="form.sanPhamId"
              :class="{ 'error': errors.sanPhamId }"
              @change="onSanPhamChange"
            >
              <option value="0" disabled>Chọn sản phẩm</option>
              <option v-for="sanPham in sanPhamList" :key="sanPham.id" :value="sanPham.id">
                {{ sanPham.tenSanPham }}
              </option>
            </select>
            <span class="error-message" v-if="errors.sanPhamId">{{ errors.sanPhamId }}</span>
          </div>
          <div class="form-group">
            <label>Kích cỡ *</label>
            <select v-model.number="form.kichCoId" :class="{ 'error': errors.kichCoId }">
              <option value="0" disabled>Chọn kích cỡ</option>
              <option v-for="kichCo in kichCoList" :key="kichCo.id" :value="kichCo.id">
                {{ kichCo.ten }}
              </option>
            </select>
            <span class="error-message" v-if="errors.kichCoId">{{ errors.kichCoId }}</span>
          </div>
          <div class="form-group">
            <label>Màu sắc *</label>
            <select v-model.number="form.mauSacId" :class="{ 'error': errors.mauSacId }">
              <option value="0" disabled>Chọn màu sắc</option>
              <option v-for="mauSac in mauSacList" :key="mauSac.id" :value="mauSac.id">
                {{ mauSac.ten }}
              </option>
            </select>
            <span class="error-message" v-if="errors.mauSacId">{{ errors.mauSacId }}</span>
          </div>
          <div class="form-group">
            <label>Giá tiền *</label>
            <input
              v-model.number="form.giaTien"
              type="number"
              placeholder="Nhập giá tiền"
              :class="{ 'error': errors.giaTien }"
            />
            <span class="error-message" v-if="errors.giaTien">{{ errors.giaTien }}</span>
          </div>
          <div class="form-group">
            <label>Số lượng tồn *</label>
            <input
              v-model.number="form.soLuongTon"
              type="number"
              placeholder="Nhập số lượng tồn"
              :class="{ 'error': errors.soLuongTon }"
            />
            <span class="error-message" v-if="errors.soLuongTon">{{ errors.soLuongTon }}</span>
          </div>
          <div class="form-group">
            <label>Trạng thái *</label>
            <select v-model.number="form.trangThai" :class="{ 'error': errors.trangThai }">
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
            :disabled="isSubmitting || !isDataLoaded"
          >
            <i class="fa fa-check"></i> {{ isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Lưu') }}
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
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from 'axios';

export default {
  name: 'ThemChiTietSanPham',
  data() {
    return {
      form: {
        id: null,
        maChiTiet: 0,
        sanPhamId: 0,
        kichCoId: 0,
        mauSacId: 0,
        giaTien: 0,
        soLuongTon: 0,
        trangThai: 1,
      },
      isSubmitting: false,
      isDataLoaded: false,
      isEditing: false,
      error: null,
      errors: {
        sanPhamId: '',
        kichCoId: '',
        mauSacId: '',
        giaTien: '',
        soLuongTon: '',
        trangThai: '',
      },
      sanPhamList: [],
      kichCoList: [],
      mauSacList: [],
    };
  },
  methods: {
    async fetchSanPham() {
      try {
        const response = await fetch('http://localhost:8080/san-pham/hien-thi');
        if (!response.ok) throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        const data = await response.json();
        this.sanPhamList = Array.isArray(data)
          ? data.map(item => ({
              id: item.id || item.idSanPham || item.maSanPham,
              tenSanPham: item.tenSanPham || item.ten || item.name,
            }))
          : (data.data || []).map(item => ({
              id: item.id || item.idSanPham || item.maSanPham,
              tenSanPham: item.tenSanPham || item.ten || item.name,
            }));
        console.log('Danh sách sản phẩm:', this.sanPhamList);
        if (this.sanPhamList.length === 0) {
          throw new Error('Danh sách sản phẩm trống.');
        }
      } catch (err) {
        console.error('Lỗi lấy danh sách sản phẩm:', err);
        this.error = 'Không thể tải danh sách sản phẩm: ' + err.message;
        toast.error(this.error);
      }
    },
    async fetchKichCo() {
      try {
        const response = await fetch('http://localhost:8080/kich-co/hien-thi');
        if (!response.ok) throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        const data = await response.json();
        this.kichCoList = Array.isArray(data)
          ? data
          : data.data || [];
        console.log('Danh sách kích cỡ:', this.kichCoList);
        if (this.kichCoList.length === 0) {
          throw new Error('Danh sách kích cỡ trống.');
        }
      } catch (err) {
        console.error('Lỗi lấy danh sách kích cỡ:', err);
        this.error = 'Không thể tải danh sách kích cỡ: ' + err.message;
        toast.error(this.error);
      }
    },
    async fetchMauSac() {
      try {
        const response = await fetch('http://localhost:8080/mau-sac/hien-thi');
        if (!response.ok) throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        const data = await response.json();
        this.mauSacList = Array.isArray(data)
          ? data
          : data.data || [];
        console.log('Danh sách màu sắc:', this.mauSacList);
        if (this.mauSacList.length === 0) {
          throw new Error('Danh sách màu sắc trống.');
        }
      } catch (err) {
        console.error('Lỗi lấy danh sách màu sắc:', err);
        this.error = 'Không thể tải danh sách màu sắc: ' + err.message;
        toast.error(this.error);
      }
    },
    async fetchChiTietSanPham() {
      const id = this.$route.params.id;
      if (id) {
        try {
          this.isSubmitting = true;
          const response = await axios.get(`http://localhost:8080/chi-tiet-san-pham/${id}`);
          const chiTiet = response.data;
          this.form = {
            id: chiTiet.id,
            maChiTiet: chiTiet.maChiTiet || 0,
            sanPhamId: chiTiet.sanPhamId || 0,
            kichCoId: chiTiet.kichCoId || 0,
            mauSacId: chiTiet.mauSacId || 0,
            giaTien: chiTiet.giaTien || 0,
            soLuongTon: chiTiet.soLuongTon || 0,
            trangThai: chiTiet.trangThai || 1,
          };
          this.isEditing = true; // Đảm bảo isEditing được đặt thành true khi sửa
          console.log('Đang chỉnh sửa sản phẩm chi tiết, isEditing:', this.isEditing);
          toast.info('Đã tải thông tin sản phẩm chi tiết');
        } catch (error) {
          console.error('Lỗi khi tải thông tin sản phẩm chi tiết:', error);
          this.error = 'Không thể tải thông tin sản phẩm chi tiết: ' + error.message;
          toast.error(this.error);
        } finally {
          this.isSubmitting = false;
        }
      } else {
        this.isEditing = false; // Đảm bảo isEditing là false khi thêm mới
        console.log('Thêm sản phẩm chi tiết mới, isEditing:', this.isEditing);
      }
    },
    onSanPhamChange() {
      console.log('Đã chọn sanPhamId:', this.form.sanPhamId);
      this.errors.sanPhamId = '';
    },
    validateForm() {
      this.errors = {
        sanPhamId: '',
        kichCoId: '',
        mauSacId: '',
        giaTien: '',
        soLuongTon: '',
        trangThai: '',
      };
      let isValid = true;

      if (!this.form.sanPhamId || this.form.sanPhamId === 0) {
        this.errors.sanPhamId = 'Sản phẩm là bắt buộc.';
        isValid = false;
      }
      if (!this.form.kichCoId || this.form.kichCoId === 0) {
        this.errors.kichCoId = 'Kích cỡ là bắt buộc.';
        isValid = false;
      }
      if (!this.form.mauSacId || this.form.mauSacId === 0) {
        this.errors.mauSacId = 'Màu sắc là bắt buộc.';
        isValid = false;
      }
      if (this.form.giaTien <= 0) {
        this.errors.giaTien = 'Giá tiền phải lớn hơn 0.';
        isValid = false;
      }
      if (this.form.soLuongTon < 0) {
        this.errors.soLuongTon = 'Số lượng tồn không được âm.';
        isValid = false;
      }
      if (this.form.trangThai !== 0 && this.form.trangThai !== 1) {
        this.errors.trangThai = 'Vui lòng chọn trạng thái hợp lệ.';
        isValid = false;
      }
      console.log('Kết quả xác thực:', { isValid, errors: this.errors });
      return isValid;
    },
    async handleSubmit() {
      console.log('Biểu mẫu trước khi gửi:', this.form);
      console.log('Trạng thái isEditing:', this.isEditing);
      if (!this.validateForm()) {
        toast.error('Vui lòng điền đầy đủ thông tin.');
        return;
      }

      try {
        this.isSubmitting = true;

        const formData = new FormData();
        formData.append('maChiTiet', this.form.maChiTiet);
        formData.append('sanPhamId', Number(this.form.sanPhamId));
        formData.append('kichCoId', Number(this.form.kichCoId));
        formData.append('mauSacId', Number(this.form.mauSacId));
        formData.append('giaTien', Number(this.form.giaTien));
        formData.append('soLuongTon', Number(this.form.soLuongTon));
        formData.append('trangThai', Number(this.form.trangThai));

        for (let [key, value] of formData.entries()) {
          console.log(`FormData ${key}: ${value}`);
        }

        if (this.isEditing && this.form.id) {
          // Cập nhật sản phẩm chi tiết
          const response = await fetch(`http://localhost:8080/chi-tiet-san-pham/update/${this.form.id}`, {
            method: 'PUT',
            body: formData,
          });
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}, Thông báo: ${errorData}`);
          }
          toast.success('Chỉnh sửa sản phẩm chi tiết thành công!');
        } else {
          // Thêm mới sản phẩm chi tiết
          const response = await fetch('http://localhost:8080/chi-tiet-san-pham/add', {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}, Thông báo: ${errorData}`);
          }
          toast.success('thành công!');
        }

        // Bỏ điều hướng để tránh lỗi "No match for..."
        // Nếu muốn điều hướng, dùng route hợp lệ, ví dụ:
        // this.$router.push({ name: 'SanPham' });
      } catch (err) {
        const action = this.isEditing ? 'chỉnh sửa' : 'thêm';
        console.error(`Lỗi khi ${action} sản phẩm chi tiết:`, err);
        toast.error(`Không thể ${action} sản phẩm chi tiết: ${err.message}`);
      } finally {
        this.isSubmitting = false;
      }
    },
    async loadData() {
      try {
        await Promise.all([this.fetchSanPham(), this.fetchKichCo(), this.fetchMauSac(), this.fetchChiTietSanPham()]);
        this.isDataLoaded = this.sanPhamList.length > 0 && this.kichCoList.length > 0 && this.mauSacList.length > 0;
        console.log('Dữ liệu đã tải:', this.isDataLoaded);
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
.form-group select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.error {
  border-color: #e63946 !important;
}

.error-message {
  margin-top: 4px;
  font-size: 13px;
  color: #e63946;
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
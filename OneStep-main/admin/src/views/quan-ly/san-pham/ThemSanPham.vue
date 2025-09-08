<template>
  <div class="container">
    <div class="header">
      <h2>Thêm sản phẩm</h2>
      <button class="btn-back" @click="$router.push({ name: 'SanPham' })"><i class="fa fa-arrow-left"></i> Quay lại danh sách</button>
    </div>

    <div class="form-card">
      <div class="form-grid">
        <div class="form-group">
          <label>Tên sản phẩm *</label>
          <input v-model="form.tenSanPham" type="text" placeholder="Nhập tên sản phẩm" />
        </div>
        <div class="form-group">
          <label>Mô tả</label>
          <textarea v-model="form.moTa" rows="4" placeholder="Nhập mô tả"></textarea>
        </div>
        <div class="form-group">
          <label>Ảnh (URL)</label>
          <input v-model="form.duongDanAnh" type="text" placeholder="Dán đường dẫn ảnh" />
        </div>
        <div class="form-group">
          <label>Trạng thái</label>
          <select v-model="form.trangThai">
            <option :value="1">Còn hàng</option>
            <option :value="0">Hết hàng</option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="handleSubmit"><i class="fa fa-check"></i> Lưu</button>
        <button class="btn-secondary" @click="$router.push({ name: 'SanPham' })"><i class="fa fa-times"></i> Huỷ</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'ThemSanPham',
  data() {
    return {
      form: {
        tenSanPham: '',
        moTa: '',
        duongDanAnh: '',
        trangThai: 1
      },
      isSubmitting: false
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.form.tenSanPham) {
        alert('Vui lòng nhập tên sản phẩm.');
        return;
      }
      try {
        this.isSubmitting = true;
        await axios.post('http://localhost:8080/san-pham/add', this.form);
        alert('Thêm sản phẩm thành công!');
        this.$router.push({ name: 'SanPham' });
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'Không xác định';
        console.error('Lỗi khi thêm sản phẩm:', msg, err);
        alert(`Không thể thêm sản phẩm: ${msg}`);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.container { padding: 16px; }
.header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.form-card { background:#fff; border:1px solid #eee; border-radius:8px; padding:16px; }
.form-grid { display:grid; grid-template-columns:1fr; gap:12px; }
.form-group { display:flex; flex-direction:column; }
label { font-weight:600; margin-bottom:6px; }
input, select, textarea { border:1px solid #ddd; border-radius:6px; padding:8px 10px; }
.actions { display:flex; gap:10px; justify-content:flex-end; margin-top:8px; }
.btn-primary { background:#4f46e5; color:#fff; border:none; border-radius:6px; padding:8px 12px; cursor:pointer; }
.btn-secondary { background:#e5e7eb; color:#111827; border:none; border-radius:6px; padding:8px 12px; cursor:pointer; }
.btn-back { background:#e5e7eb; color:#111827; border:none; border-radius:6px; padding:8px 12px; cursor:pointer; }
</style>



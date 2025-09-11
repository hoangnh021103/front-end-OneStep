<template>
  <div class="container">
    <!-- Bộ lọc -->
    <div class="filter-section">
      <h2>Bộ lọc tìm kiếm</h2>
      <div class="filter-grid">
        <input v-model="search" type="text" placeholder="Tên sản phẩm" />
        <select v-model="status" class="status-select">
          <option value="">Tất cả trạng thái</option>
          <option value="1">Còn hàng</option>
          <option value="0">Hết hàng</option>
        </select>
        <button class="btn-reset" @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại</button>
      </div>
    </div>
    <!-- Danh sách sản phẩm -->
    <div class="product-section">
      <div class="header">
        <h2>Danh sách sản phẩm</h2>
        <button class="btn-add" @click="$router.push({ name: 'ThemSanPham' })"><i class="fa fa-plus"></i> Thêm sản phẩm</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên SP</th>
              <th>Mã Code</th>
              <th>Mô tả</th>
              <th>Thương hiệu</th>
              <th>Chất liệu</th>
              <th>Đế giày</th>
              <th>Ảnh</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in filteredProducts" :key="product.maSanPham">
              <td>{{ index + 1 }}</td>
              <td>{{ product.tenSanPham }}</td>
              <td>{{ product.maCode }}</td>
              <td>{{ product.moTa }}</td>
              <td>{{ getThuongHieuName(product.thuongHieuId) }}</td>
              <td>{{ getChatLieuName(product.chatLieuId) }}</td>
              <td>{{ getDeGiayName(product.deGiayId) }}</td>
              <td>
                <img :src="product.duongDanAnh" alt="Ảnh SP" class="product-thumb" v-if="product.duongDanAnh" />
              </td>
              <td>
                <span :class="['status', product.trangThai === 1 ? 'active' : 'inactive']">
                  {{ product.trangThai === 1 ? 'Còn hàng' : 'Hết hàng' }}
                </span>
              </td>
              <td class="action-cell">
                <button class="action-btn edit" title="Sửa" @click="editProduct(index)"><i class="fa fa-edit"></i></button>
                <button class="action-btn delete" title="Xóa" @click="deleteProduct(index)"><i class="fa fa-trash"></i></button>
                <button class="action-btn view" title="Xem" @click="viewProduct(product.maSanPham)"><i class="fa fa-eye"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
  name: 'SanPham',
  data() {
    return {
      products: [],
      search: '',
      status: '',
      thuongHieuList: [],
      chatLieuList: [],
deGiayList: [],
      kieuDangList: [],
      hangSanXuatList: [],
    };
  },
  computed: {
    filteredProducts() {
      const keyword = this.search.toLowerCase();
      return this.products.filter(
        p =>
          p.daXoa === 0 &&
          (p.tenSanPham && p.tenSanPham.toLowerCase().includes(keyword)) &&
          (this.status === '' || p.trangThai == this.status)
      );
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch('http://localhost:8080/san-pham/hien-thi');
        const data = await response.json();
        this.products = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', err);
        toast.error('Không thể tải danh sách sản phẩm.');
      }
    },
    async fetchThuongHieu() {
      try {
        const response = await fetch('http://localhost:8080/thuong-hieu/hien-thi');
        const data = await response.json();
        this.thuongHieuList = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        console.error('Lỗi khi lấy danh sách thương hiệu:', err);
        toast.error('Không thể tải danh sách thương hiệu.');
      }
    },
    async fetchChatLieu() {
      try {
        const response = await fetch('http://localhost:8080/chat-lieu/hien-thi');
        const data = await response.json();
        this.chatLieuList = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        console.error('Lỗi khi lấy danh sách chất liệu:', err);
        toast.error('Không thể tải danh sách chất liệu.');
      }
    },
    async fetchDeGiay() {
      try {
        const response = await fetch('http://localhost:8080/de-giay/hien-thi');
        const data = await response.json();
        this.deGiayList = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        console.error('Lỗi khi lấy danh sách đế giày:', err);
        toast.error('Không thể tải danh sách đế giày.');
      }
    },
    async fetchKieuDang() {
      try {
        const response = await fetch('http://localhost:8080/kieu-dang/hien-thi');
        const data = await response.json();
        this.kieuDangList = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        console.error('Lỗi khi lấy danh sách kiểu dáng:', err);
        toast.error('Không thể tải danh sách kiểu dáng.');
      }
    },
    async fetchHangSanXuat() {
      try {
        const response = await fetch('http://localhost:8080/hang-san-xuat/hien-thi');
        const data = await response.json();
        this.hangSanXuatList = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        console.error('Lỗi khi lấy danh sách hãng sản xuất:', err);
        toast.error('Không thể tải danh sách hãng sản xuất.');
      }
    },
    getThuongHieuName(id) {
      const thuongHieu = this.thuongHieuList.find(item => item.id === id);
      return thuongHieu ? thuongHieu.ten : '';
    },
    getChatLieuName(id) {
      const chatLieu = this.chatLieuList.find(item => item.id === id);
      return chatLieu ? chatLieu.ten : '';
    },
    getDeGiayName(id) {
      const deGiay = this.deGiayList.find(item => item.id === id);
      return deGiay ? deGiay.ten : '';
    },
    getKieuDangName(id) {
      const kieuDang = this.kieuDangList.find(item => item.id === id);
      return kieuDang ? kieuDang.ten : 'N/A';
    },
    getHangSanXuatName(id) {
      const hangSanXuat = this.hangSanXuatList.find(item => item.id === id);
      return hangSanXuat ? hangSanXuat.ten : 'N/A';
    },
    resetFilter() {
      this.search = '';
      this.status = '';
      this.fetchProducts();
    },
    editProduct(index) {
      toast.info('Chức năng chỉnh sửa đang được phát triển.');
    },
    async deleteProduct(index) {
      if (confirm('Xác nhận xóa sản phẩm này?')) {
        try {
          const product = this.products[index];
          await fetch(`http://localhost:8080/san-pham/delete/${product.maSanPham}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...product, daXoa: 1 }),
          });
          toast.success('Xóa sản phẩm thành công!');
          this.products[index].daXoa = 1;
          this.fetchProducts();
        } catch (err) {
          console.error('Lỗi khi xóa sản phẩm:', err);
          toast.error('Không thể xóa sản phẩm.');
        }
      }
    },
    viewProduct(maSanPham) {
      this.$router.push({ name: 'SanPhamChiTiet', params: { id: maSanPham } });
    },
  },
  mounted() {
    this.fetchProducts();
    this.fetchThuongHieu();
    this.fetchChatLieu();
    this.fetchDeGiay();
    this.fetchKieuDang();
    this.fetchHangSanXuat();
  },
};
</script>
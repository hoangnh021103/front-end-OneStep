```vue
<template>
  <div class="container">
    <template v-if="mode === 'SanPhamChiTiet'">
      <!-- Bộ lọc -->
      <div class="filter-section">
        <h2>Bộ lọc tìm kiếm</h2>
        <div class="filter-grid">
          <input v-model="search" type="text" placeholder="Mã chi tiết" />
          <select v-model="status" class="status-select">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Còn hàng</option>
            <option value="0">Hết hàng</option>
          </select>
          <button class="btn-reset" @click="resetFilter">
            <i class="fa fa-undo"></i> Đặt lại
          </button>
        </div>
      </div>

      <!-- Danh sách chi tiết sản phẩm -->
      <div class="product-section">
        <div class="header">
          <div class="header-left">
            <h2 v-if="sanPhamInfo">Chi tiết sản phẩm: {{ sanPhamInfo.tenSanPham }}</h2>
            <h2 v-else>Danh sách chi tiết sản phẩm</h2>
            <button class="btn-back" @click="$router.push({ name: 'SanPham' })">
              <i class="fa fa-arrow-left"></i> Quay lại danh sách
            </button>
          </div>
          <button class="btn-add" @click="$router.push({ name: 'ThemChiTietSanPham' })">
            <i class="fa fa-plus"></i> Thêm chi tiết sản phẩm
          </button>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã chi tiết</th>
                <th>Sản phẩm</th>
                <th>Kích cỡ</th>
                <th>Màu sắc</th>
                <th>Giá tiền</th>
                <th>Số lượng tồn</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detail, index) in filteredDetails" :key="detail.maChiTiet">
                <td>{{ index + 1 }}</td>
                <td>{{ detail.maChiTiet }}</td>
                <td>{{ getSanPhamName(detail.sanPhamId) }}</td>
                <td>{{ getKichCoName(detail.kichCoId) }}</td>
                <td>{{ getMauSacName(detail.mauSacId) }}</td>
                <td>{{ formatCurrency(detail.giaTien) }}</td>
                <td>{{ detail.soLuongTon }}</td>
                <td>
                  <span :class="['status', detail.trangThai === 1 ? 'active' : 'inactive']">
                    {{ detail.trangThai === 1 ? 'Còn hàng' : 'Hết hàng' }}
                  </span>
                </td>
                <td class="action-cell">
                  <button class="action-btn edit" title="Sửa" @click="editDetail(index)">
                    <i class="fa fa-edit"></i>
                  </button>
                  <button class="action-btn delete" title="Xóa" @click="deleteDetail(index)">
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template v-else-if="mode === 'XemChiTietSanPham' || mode === 'SuaChiTietSanPham'">
      <!-- Giao diện xem hoặc sửa chi tiết sản phẩm -->
      <div class="detail-section">
        <h2>{{ mode === 'SuaChiTietSanPham' ? 'Sửa chi tiết sản phẩm' : 'Xem chi tiết sản phẩm' }}</h2>
        <div v-if="details.length > 0">
          <p>Mã chi tiết: {{ details[0].maChiTiet }}</p>
          <p>Sản phẩm: {{ getSanPhamName(details[0].sanPhamId) }}</p>
          <p>Kích cỡ: {{ getKichCoName(details[0].kichCoId) }}</p>
          <p>Màu sắc: {{ getMauSacName(details[0].mauSacId) }}</p>
          <p>Giá tiền: {{ formatCurrency(details[0].giaTien) }}</p>
          <p>Số lượng tồn: {{ details[0].soLuongTon }}</p>
          <p>Trạng thái: {{ details[0].trangThai === 1 ? 'Còn hàng' : 'Hết hàng' }}</p>
        </div>
        <button class="btn-back" @click="$router.push({ name: 'SanPhamChiTiet', params: { id: details[0]?.sanPhamId } })">
          <i class="fa fa-arrow-left"></i> Quay lại
        </button>
      </div>
    </template>
    <template v-else-if="mode === 'ThemChiTietSanPham'">
      <!-- Giao diện thêm chi tiết sản phẩm -->
      <div class="form-section">
        <h2>Thêm chi tiết sản phẩm</h2>
        <!-- Thêm form để nhập dữ liệu -->
        <button class="btn-back" @click="$router.push({ name: 'SanPhamChiTiet' })">
          <i class="fa fa-arrow-left"></i> Quay lại
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'SanPhamChiTiet',
  data() {
    return {
      search: '',
      status: '',
      details: [],
      sanPhamList: [],
      kichCoList: [],
      mauSacList: [],
      sanPhamInfo: null,
      mode: '',
    };
  },
  computed: {
    filteredDetails() {
      if (this.mode !== 'SanPhamChiTiet') return [];
      const keyword = this.search.toLowerCase();
      return this.details.filter(
        d =>
          d.daXoa === 0 &&
          (d.maChiTiet && d.maChiTiet.toString().includes(keyword)) &&
          (this.status === '' || d.trangThai == this.status)
      );
    },
  },
  methods: {
    formatCurrency(value) {
      if (!value) return '0 ₫';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    },

    async fetchDetails() {
      try {
        const maSanPham = this.$route.params.id;
        console.log('Route params:', this.$route.params);
        let url = 'http://localhost:8080/chi-tiet-san-pham/hien-thi';
        if (maSanPham) {
          if (isNaN(maSanPham)) {
            toast.error('Mã sản phẩm không hợp lệ.');
            return;
          }
          url = `http://localhost:8080/chi-tiet-san-pham/hien-thi-theo-san-pham/${maSanPham}`;
        }
        console.log('Fetching from URL:', url);
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Response data:', data);
        if (Array.isArray(data)) {
          this.details = data;
        } else if (data.data && Array.isArray(data.data)) {
          this.details = data.data;
        } else if (data && typeof data === 'object') {
          this.details = [data];
        } else {
          this.details = [];
          toast.warn('Dữ liệu trả về không đúng định dạng.');
        }
        if (maSanPham && this.sanPhamList.length > 0) {
          this.sanPhamInfo = this.sanPhamList.find(sp => sp.maSanPham == maSanPham);
        }
        console.log('Chi tiết sản phẩm:', this.details);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách chi tiết sản phẩm:', err);
        toast.error(`Không thể tải danh sách chi tiết sản phẩm: ${err.message}`);
        if (err.message.includes('500')) {
          toast.error('Có lỗi từ server khi tải dữ liệu. Vui lòng thử lại sau.');
        }
      }
    },

    async fetchDetailById(id) {
      try {
        const apiUrl = `http://localhost:8080/chi-tiet-san-pham/hien-thi/${id}`;
        console.log('Gọi API chi tiết sản phẩm với URL:', apiUrl);
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Chi tiết sản phẩm data:', data);
        this.details = [data];
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
        toast.error(`Không thể tải chi tiết sản phẩm: ${err.message}`);
        if (err.message.includes('404') || err.message.includes('500')) {
          toast.error('Không tìm thấy chi tiết sản phẩm hoặc có lỗi từ server');
          setTimeout(() => {
            this.$router.push({ name: 'SanPhamChiTiet' });
          }, 2000);
        }
      }
    },

    async fetchSanPham() {
      try {
        const response = await fetch('http://localhost:8080/san-pham/hien-thi');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`);
        }
        const data = await response.json();
        this.sanPhamList = Array.isArray(data) ? data : data.data || [];
        console.log('Danh sách sản phẩm:', this.sanPhamList);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', err);
        toast.error(`Không thể tải danh sách sản phẩm: ${err.message}`);
      }
    },

    async fetchKichCo() {
      try {
        const response = await fetch('http://localhost:8080/kich-co/hien-thi');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`);
        }
        const data = await response.json();
        this.kichCoList = Array.isArray(data) ? data : data.data || [];
        console.log('Danh sách kích cỡ:', this.kichCoList);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách kích cỡ:', err);
        toast.error(`Không thể tải danh sách kích cỡ: ${err.message}`);
      }
    },

    async fetchMauSac() {
      try {
        const response = await fetch('http://localhost:8080/mau-sac/hien-thi');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`);
        }
        const data = await response.json();
        this.mauSacList = Array.isArray(data) ? data : data.data || [];
        console.log('Danh sách màu sắc:', this.mauSacList);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách màu sắc:', err);
        toast.error(`Không thể tải danh sách màu sắc: ${err.message}`);
      }
    },

    getSanPhamName(id) {
      if (!id) return 'N/A';
      const sp = this.sanPhamList.find(item => item.maSanPham === id);
      return sp ? sp.tenSanPham : 'N/A';
    },
    getKichCoName(id) {
      if (!id) return 'N/A';
      const kc = this.kichCoList.find(item => item.id === id);
      return kc ? kc.ten : 'N/A';
    },
    getMauSacName(id) {
      if (!id) return 'N/A';
      const ms = this.mauSacList.find(item => item.id === id);
      return ms ? ms.ten : 'N/A';
    },

    resetFilter() {
      this.search = '';
      this.status = '';
      this.fetchDetails();
    },

    editDetail(index) {
      const detail = this.details[index];
      this.$router.push({
        name: 'SuaChiTietSanPham',
        params: { id: detail.maChiTiet },
      });
    },

    async deleteDetail(index) {
      const detail = this.details[index];
      if (!confirm(`Xác nhận xóa chi tiết sản phẩm với mã ${detail.maChiTiet}?`)) {
        return;
      }

      try {
        console.log('Gửi yêu cầu xóa chi tiết sản phẩm với mã:', detail.maChiTiet);
        const response = await fetch(
          `http://localhost:8080/chi-tiet-san-pham/delete/${detail.maChiTiet}`,
          {
            method: 'DELETE', // Sử dụng DELETE thay vì PUT
            headers: { 'Content-Type': 'application/json' },
          }
        );

        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}, Thông báo: ${errorData}`);
        }

        toast.success('Xóa chi tiết sản phẩm thành công!');
        await this.fetchDetails(); // Làm mới danh sách sau khi xóa
      } catch (err) {
        console.error('Lỗi khi xóa chi tiết sản phẩm:', err);
        toast.error(`Không thể xóa chi tiết sản phẩm: ${err.message}`);
        if (err.message.includes('404')) {
          toast.error('Chi tiết sản phẩm không tồn tại.');
        } else if (err.message.includes('500')) {
          toast.error('Lỗi server khi xóa chi tiết sản phẩm. Vui lòng thử lại sau.');
        }
      }
    },

    viewDetail(maChiTiet) {
      this.$router.push({
        name: 'XemChiTietSanPham',
        params: { id: maChiTiet },
      });
    },
  },

  async mounted() {
    this.mode = this.$route.name;
    console.log('Route name:', this.mode);
    try {
      console.log('Bắt đầu tải dữ liệu cơ bản...');
      await Promise.all([
        this.fetchSanPham().catch(err => {
          console.error('Lỗi khi tải danh sách sản phẩm:', err);
          toast.error('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
          return [];
        }),
        this.fetchKichCo().catch(err => {
          console.error('Lỗi khi tải danh sách kích cỡ:', err);
          toast.error('Không thể tải danh sách kích cỡ. Vui lòng thử lại sau.');
          return [];
        }),
        this.fetchMauSac().catch(err => {
          console.error('Lỗi khi tải danh sách màu sắc:', err);
          toast.error('Không thể tải danh sách màu sắc. Vui lòng thử lại sau.');
          return [];
        }),
      ]);
      console.log('Tải dữ liệu chi tiết theo mode:', this.mode);
      if (this.mode === 'ThemChiTietSanPham') {
        console.log('Mode ThemChiTietSanPham - không cần tải chi tiết');
      } else if (this.mode === 'SuaChiTietSanPham' || this.mode === 'XemChiTietSanPham') {
        const id = this.$route.params.id;
        console.log('Tải chi tiết theo ID:', id);
        if (id) {
          await this.fetchDetailById(id).catch(err => {
            console.error(`Lỗi khi tải chi tiết sản phẩm ID=${id}:`, err);
            toast.error('Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.');
          });
        } else {
          toast.error('Không tìm thấy ID sản phẩm trong route params');
          this.$router.push({ name: 'SanPhamChiTiet' });
        }
      } else {
        console.log('Tải danh sách chi tiết sản phẩm');
        await this.fetchDetails().catch(err => {
          console.error('Lỗi khi tải danh sách chi tiết sản phẩm:', err);
          toast.error('Không thể tải danh sách chi tiết sản phẩm. Vui lòng thử lại sau.');
        });
      }
    } catch (err) {
      console.error('Lỗi khi khởi tạo trang:', err);
      toast.error('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    }
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
}
.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}
input,
select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}
.btn-reset {
  background: #f0f0f0;
  border: 1px solid #ddd;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.product-section,
.detail-section,
.form-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.btn-add,
.btn-back {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
.btn-back {
  background: #2196f3;
}
.table-wrapper {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  background: #f5f5f5;
}
th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}
.active {
  background: #e8f5e9;
  color: #4caf50;
}
.inactive {
  background: #ffebee;
  color: #f44336;
}
.action-cell {
  display: flex;
  gap: 5px;
}
.action-btn {
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit {
  background: #2196f3;
  color: white;
}
.delete {
  background: #f44336;
  color: white;
}
</style>

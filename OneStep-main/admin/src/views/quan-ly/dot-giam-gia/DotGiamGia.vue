<template>
  <div class="discount-container">
    <header class="header">
      <h2>Quản lý đợt giảm giá</h2>
      <div class="filters">
        <input v-model="search" type="text" class="search-input"
          placeholder="Nhập tên sản phẩm hoặc voucher để tìm kiếm.." />
        <button class="reset-btn" @click="resetFilters">Đặt lại bộ lọc</button>
      </div>
      <button class="add-btn" @click="openAddModal">
        <i class="fa fa-plus"></i> Thêm mới đợt giảm giá
      </button>
    </header>

    <div class="table-wrapper">
      <p class="table-info">{{ filteredDiscounts.length }} đợt giảm giá</p>
      <table class="data-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Sản phẩm</th>
            <th>Voucher</th>
            <th>Ngày cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredDiscounts.length === 0">
            <td colspan="5" class="no-data">
              <div class="empty-state">
                <div class="empty-icon"><i class="fa fa-percent"></i></div>
                <div class="empty-text">Chưa có đợt giảm giá nào</div>
                <div class="empty-subtext">
                  Nhấn "Thêm mới đợt giảm giá" để tạo đợt giảm giá đầu tiên
                </div>
              </div>
            </td>
          </tr>
          <tr v-for="(discount, index) in paginatedDiscounts" :key="discount.id">
            <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
            <td>{{ discount.tenSanPham || discount.sanPhamName || 'N/A' }}</td>
            <td>{{ discount.tenVoucher || discount.voucherName || 'N/A' }}</td>
            <td>{{ formatDate(discount.ngayCapNhat) }}</td>
            <td class="actions">
              <button class="action-btn edit" title="Sửa" @click="openEditModal(discount)"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" title="Xóa" @click="confirmDelete(discount)"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Phân trang -->
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">‹</button>
        <span v-for="p in totalPages" :key="p" :class="['page', { active: p === currentPage }]" @click="currentPage = p">
          {{ p }}
        </span>
        <button :disabled="currentPage === totalPages" @click="currentPage++">›</button>
        <select v-model.number="pageSize" @change="currentPage = 1">
          <option :value="5">5 / page</option>
          <option :value="10">10 / page</option>
          <option :value="20">20 / page</option>
        </select>
      </div>
    </div>

    <!-- Modal thêm/sửa -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingId ? "Sửa đợt giảm giá" : "Thêm mới đợt giảm giá" }}</h3>
        <form @submit.prevent="saveDiscount">
          <div class="form-group">
            <label>Sản phẩm:</label>
            <select v-model.number="form.sanPhamId" required>
              <option :value="0">-- Chọn sản phẩm --</option>
              <option v-for="sp in sanPhamList" :key="sp.id" :value="sp.id">
                {{ sp.tenSanPham || sp.ten || sp.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Voucher:</label>
            <select v-model.number="form.voucherId" required>
              <option :value="0">-- Chọn voucher --</option>
              <option v-for="vc in voucherList" :key="vc.id" :value="vc.id">
                {{ vc.tenVoucher || vc.ten || vc.name }}
              </option>
            </select>
            <div v-if="voucherList.length === 0" class="hint">Không tìm thấy voucher — kiểm tra API.</div>
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-btn" :disabled="isLoading">
              {{ isLoading ? 'Đang xử lý...' : 'Lưu' }}
            </button>
            <button type="button" class="cancel-btn" @click="closeModal" :disabled="isLoading">Hủy</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
  name: 'DiscountManager',
  data() {
    return {
      discounts: [],
      sanPhamList: [],
      voucherList: [],
      search: '',
      currentPage: 1,
      pageSize: 10,
      showModal: false,
      editingId: null,
      form: {
        sanPhamId: 0,
        voucherId: 0,
      },
      isLoading: false,
    };
  },
  computed: {
    filteredDiscounts() {
      const kw = this.search.trim().toLowerCase();
      if (!kw) return this.discounts;
      return this.discounts.filter(d =>
        (d.tenSanPham && d.tenSanPham.toLowerCase().includes(kw)) ||
        (d.tenVoucher && d.tenVoucher.toLowerCase().includes(kw)) ||
        (d.sanPhamName && d.sanPhamName.toLowerCase().includes(kw)) ||
        (d.voucherName && d.voucherName.toLowerCase().includes(kw))
      );
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredDiscounts.length / this.pageSize));
    },
    paginatedDiscounts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredDiscounts.slice(start, start + this.pageSize);
    }
  },
  methods: {
    formatDate(dt) {
      if (!dt) return '';
      const d = new Date(dt);
      return d.toLocaleDateString('vi-VN');
    },

    resetFilters() {
      this.search = '';
      this.currentPage = 1;
    },

    async fetchSanPham() {
      try {
        const res = await fetch('http://localhost:8080/san-pham/hien-thi');
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data || []);
        this.sanPhamList = list.map(item => ({
          id: item.maSanPham,   // 🔑 luôn lấy maSanPham
          tenSanPham: item.tenSanPham
        }));
        console.log('Danh sách sản phẩm:', this.sanPhamList); // Debug log
      } catch (err) {
        console.error('fetchSanPham error:', err);
        toast.error('Không tải được danh sách sản phẩm.');
        this.sanPhamList = [];
      }
    },

    async fetchVoucher() {
      try {
        const res = await fetch('http://localhost:8080/voucher/hien-thi');
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data || []);
        this.voucherList = list.map(item => ({
          id: item.id || item.ma || item.idVoucher,
          tenVoucher: item.ten || item.tenVoucher || item.name
        }));
        console.log('Danh sách voucher:', this.voucherList); // Debug log
      } catch (err) {
        console.error('fetchVoucher error:', err);
        toast.error('Không tải được danh sách voucher.');
        this.voucherList = [];
      }
    },

    async fetchDiscounts() {
      try {
        const res = await fetch("http://localhost:8080/san-pham-khuyen-mai/hien-thi");
        if (!res.ok) {
          console.warn("discount fetch status", res.status);
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data || []);

        this.discounts = list.map(item => ({
          id: item.id,
          // ✅ Lưu cả maSanPham và sanPhamId để xử lý đồng bộ
          maSanPham: item.maSanPham || item.sanPham?.maSanPham,
          sanPhamId: item.sanPhamId || item.maSanPham || item.sanPham?.maSanPham,
          voucherId: item.voucherId || item.voucher?.id,
          tenSanPham: item.tenSanPham 
                      || item.sanPham?.tenSanPham 
                      || item.sanPham?.ten,
          tenVoucher: item.tenVoucher 
                      || item.voucher?.tenVoucher 
                      || item.voucher?.ten,
          ngayCapNhat: item.ngayCapNhat || item.updatedAt
        }));
        
        console.log('Danh sách discounts:', this.discounts); // Debug log
      } catch (err) {
        console.error("fetchDiscounts error", err);
        toast.error("Không tải được danh sách đợt giảm giá.");
        this.discounts = [];
      }
    },

    openAddModal() {
      this.editingId = null;
      this.form = { sanPhamId: 0, voucherId: 0 };
      this.showModal = true;
    },
    
    openEditModal(discount) {
      console.log('🚀 Opening edit modal for discount:', discount); // Debug log
      console.log('📋 Current sanPhamList:', this.sanPhamList); // Debug log
      console.log('🎫 Current voucherList:', this.voucherList); // Debug log
      
      this.editingId = discount.id;
      
      // ✅ Thử nhiều cách lấy sanPhamId
      const sanPhamId = discount.sanPhamId || discount.maSanPham || 0;
      const voucherId = discount.voucherId || 0;
      
      console.log('🔧 Extracted IDs:', { sanPhamId, voucherId }); // Debug log
      
      this.form = {
        sanPhamId: Number(sanPhamId),
        voucherId: Number(voucherId)
      };
      
      console.log('📝 Final form data:', this.form); // Debug log
      
      // ✅ Kiểm tra xem ID có tồn tại trong danh sách không
      const foundSanPham = this.sanPhamList.find(sp => sp.id === Number(sanPhamId));
      const foundVoucher = this.voucherList.find(vc => vc.id === Number(voucherId));
      
      console.log('🔍 Found sanPham:', foundSanPham); // Debug log
      console.log('🔍 Found voucher:', foundVoucher); // Debug log
      
      if (!foundSanPham) {
        console.warn('⚠️ Sản phẩm không tìm thấy trong danh sách!');
      }
      if (!foundVoucher) {
        console.warn('⚠️ Voucher không tìm thấy trong danh sách!');
      }
      
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
    },

    async saveDiscount() {
      if (!this.form.sanPhamId || !this.form.voucherId) {
        toast.error('Vui lòng chọn sản phẩm và voucher.');
        return;
      }
      this.isLoading = true;
      try {
        const payload = {
          sanPhamId: Number(this.form.sanPhamId),
          voucherId: Number(this.form.voucherId),
        };

        console.log('Saving with payload:', payload); // Debug log

        let url = '';
        let method = '';

        if (this.editingId) {
          url = `http://localhost:8080/san-pham-khuyen-mai/update/${this.editingId}`;
          method = 'PUT';
        } else {
          url = 'http://localhost:8080/san-pham-khuyen-mai/add';
          method = 'POST';
        }

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || `status ${res.status}`);
        }

        toast.success(this.editingId ? 'Cập nhật thành công' : 'Thêm thành công');
        this.showModal = false;
        this.editingId = null;
        await this.fetchDiscounts();
      } catch (err) {
        console.error('saveDiscount error', err);
        toast.error('Lỗi khi lưu đợt giảm giá. ' + (err.message || ''));
      } finally {
        this.isLoading = false;
      }
    },

    confirmDelete(discount) {
      if (!confirm(`Xác nhận xóa đợt giảm giá cho "${discount.tenSanPham || 'sản phẩm'}" ?`)) return;
      this.deleteDiscount(discount.id);
    },
    
    async deleteDiscount(id) {
      try {
        const res = await fetch(`http://localhost:8080/san-pham-khuyen-mai/delete/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `status ${res.status}`);
        }
        toast.success('Xóa thành công');
        await this.fetchDiscounts();
      } catch (err) {
        console.error('deleteDiscount error', err);
        toast.error('Lỗi khi xóa đợt giảm giá.');
      }
    }
  },
  async mounted() {
    await Promise.all([this.fetchSanPham(), this.fetchVoucher(), this.fetchDiscounts()]);
  }
};
</script>

<style scoped>
.discount-container { padding: 20px; font-family: "Segoe UI", sans-serif; }
.header { display:flex; gap:12px; align-items:center; justify-content:space-between; margin-bottom:12px; }
.filters { display:flex; gap:8px; align-items:center; }
.search-input{ padding:8px; width:320px; }
.table-wrapper { background:#fff; padding:12px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
.data-table { width:100%; border-collapse:collapse; }
.data-table th, .data-table td { padding:10px; border-bottom:1px solid #eee; text-align:left; }
.actions .action-btn { margin-right:6px; }
.modal-overlay { position:fixed; left:0; right:0; top:0; bottom:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.35); }
.modal { background:#fff; padding:18px; width:420px; border-radius:8px; box-shadow:0 6px 30px rgba(0,0,0,0.15); }
.form-group { margin-bottom:10px; }
.modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:12px; }
.save-btn{ background:#4f46e5; color:#fff; padding:8px 12px; border:none; border-radius:6px; }
.cancel-btn{ background:#f3f4f6; color:#333; padding:8px 12px; border:none; border-radius:6px; }
.hint{ color:#666; font-size:13px; margin-top:6px; }
.page{ cursor:pointer; padding:6px 8px; margin:0 3px; border-radius:4px; }
.page.active{ background:#4f46e5; color:white; }
</style>
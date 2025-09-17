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
            <td>{{ discount.tenSanPham || 'N/A' }}</td>
            <td>{{ discount.tenVoucher || 'N/A' }}</td>
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
            <!-- NOTE: không dùng .number để tránh ép kiểu NaN khi id là string -->
            <select v-model="form.sanPhamId" required>
              <option value="">-- Chọn sản phẩm --</option>
              <option v-for="sp in sanPhamList" :key="sp.id" :value="sp.id">
                {{ sp.tenSanPham }}
              </option>
            </select>
            <div v-if="form.sanPhamId" class="hint-small">Đang chọn: {{ findSanPhamName(form.sanPhamId) }}</div>
          </div>
          <div class="form-group">
            <label>Voucher:</label>
            <select v-model="form.voucherId" required>
              <option value="">-- Chọn voucher --</option>
              <option v-for="vc in voucherList" :key="vc.id" :value="vc.id">
                {{ vc.tenVoucher }}
              </option>
            </select>
            <div v-if="form.voucherId" class="hint-small">Đang chọn: {{ findVoucherName(form.voucherId) }}</div>
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
      // Chú ý: dùng string để an toàn với id là number hoặc mã string
      form: {
        sanPhamId: '',
        voucherId: '',
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
        (d.tenVoucher && d.tenVoucher.toLowerCase().includes(kw))
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

    // Helper: trả về tên sản phẩm theo id (nếu có), dùng cho hiển thị "Đang chọn"
    findSanPhamName(id) {
      const sp = this.sanPhamList.find(x => String(x.id) === String(id));
      return sp ? sp.tenSanPham : `(ID: ${id})`;
    },
    findVoucherName(id) {
      const vc = this.voucherList.find(x => String(x.id) === String(id));
      return vc ? vc.tenVoucher : `(ID: ${id})`;
    },

    async fetchSanPham() {
      try {
        const res = await fetch('http://localhost:8080/san-pham/hien-thi');
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data || []);
        // chuyển id thành STRING để so sánh an toàn
        this.sanPhamList = list.map(item => ({
          id: String(item.id ?? item.maSanPham ?? item.ma ?? item.ma_san_pham ?? ''),
          tenSanPham: item.tenSanPham || item.ten || item.name || `#${item.id ?? item.maSanPham ?? ''}`
        })).filter(x => x.id !== '');
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
          id: String(item.id ?? item.ma ?? item.idVoucher ?? ''),
          tenVoucher: item.ten || item.tenVoucher || item.name || `#${item.id ?? ''}`
        })).filter(x => x.id !== '');
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
          // lưu stringify để match sanPhamList (an toàn cả numeric & string)
          sanPhamId: String(item.sanPhamId ?? item.sanPham?.id ?? item.sanPham?.maSanPham ?? item.maSanPham ?? ''),
          voucherId: String(item.voucherId ?? item.voucher?.id ?? item.voucher?.ma ?? ''),
          tenSanPham: item.tenSanPham || item.sanPham?.tenSanPham || item.sanPham?.ten || item.ten || '',
          tenVoucher: item.tenVoucher || item.voucher?.tenVoucher || item.voucher?.ten || item.ten || '',
          ngayCapNhat: item.ngayCapNhat || item.updatedAt || item.updated_at || ''
        }));
      } catch (err) {
        console.error("fetchDiscounts error", err);
        toast.error("Không tải được danh sách đợt giảm giá.");
        this.discounts = [];
      }
    },

    openAddModal() {
      this.editingId = null;
      this.form = { sanPhamId: '', voucherId: '' };
      this.showModal = true;
    },

    openEditModal(discount) {
      this.editingId = discount.id;
      const spId = String(discount.sanPhamId ?? '');
      const vcId = String(discount.voucherId ?? '');

      // Nếu sản phẩm/voucher hiện tại không nằm trong danh sách (ví dụ đã bị xóa),
      // thêm 1 option tạm để select vẫn hiển thị được giá trị
      if (spId && !this.sanPhamList.find(sp => String(sp.id) === spId)) {
        const fallbackName = discount.tenSanPham || `Sản phẩm ${spId} (không tìm thấy)`;
        // đặt fallback lên đầu danh sách
        this.sanPhamList = [{ id: spId, tenSanPham: fallbackName }, ...this.sanPhamList];
      }
      if (vcId && !this.voucherList.find(vc => String(vc.id) === vcId)) {
        const fallbackVName = discount.tenVoucher || `Voucher ${vcId} (không tìm thấy)`;
        this.voucherList = [{ id: vcId, tenVoucher: fallbackVName }, ...this.voucherList];
      }

      this.form = {
        sanPhamId: spId,
        voucherId: vcId
      };

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
        // Nếu payload là số (toàn chữ số) thì gửi Number, còn không giữ string.
        const norm = (val) => {
          if (typeof val !== 'string') val = String(val);
          return /^\d+$/.test(val) ? Number(val) : val;
        };

        const payload = {
          sanPhamId: norm(this.form.sanPhamId),
          voucherId: norm(this.form.voucherId),
        };

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
    // gọi đồng thời; nếu người dùng mở modal quá nhanh, fallback option sẽ đảm bảo hiển thị giá trị
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
.hint-small{ color:#444; font-size:13px; margin-top:6px; }
.page{ cursor:pointer; padding:6px 8px; margin:0 3px; border-radius:4px; }
.page.active{ background:#4f46e5; color:white; }
</style>

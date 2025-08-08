<template>
  <div class="customer-manager">
    <header>
      <h2>Quản lý khách hàng</h2>
    </header>
    <section class="filter-section">
      <div class="filter-row">
        <input v-model="search" placeholder="Nhập mã / tên để tìm kiếm..." />
        <select v-model="status">
          <option value="">Chọn trạng thái</option>
          <option value="active">Kích hoạt</option>
          <option value="inactive">Chưa kích hoạt</option>
        </select>
        <button @click="resetFilter">Đặt lại bộ lọc</button>
      </div>
    </section>
    <section class="customer-list-section">
      <div class="list-header">
        <span>{{ filteredCustomers.length }} khách hàng</span>
        <button class="add-btn" @click="openAddModal">Thêm mới khách hàng</button>
      </div>
      <table class="customer-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã KH</th>
            <th>Tên KH</th>
            <th>SDT</th>
            <th>Ngày tham gia</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cus, idx) in pagedCustomers" :key="cus.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
            <td>{{ cus.code }}</td>
            <td>{{ cus.name }}</td>
            <td>{{ cus.phone }}</td>
            <td>{{ cus.joinDate }}</td>
            <td>
              <span :class="['status-badge', cus.status === 'active' ? 'active' : 'inactive']">
                {{ cus.status === 'active' ? 'Kích hoạt' : 'Chưa kích hoạt' }}
              </span>
            </td>
            <td>
              <button @click="openEditModal(cus)">✏️</button>
              <button @click="deleteCustomer(cus.id)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination ở giữa cuối bảng -->
      <div class="pagination-center">
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="changePage(currentPage-1)">‹</button>
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="{active: currentPage === page}"
            @click="changePage(page)"
          >{{ page }}</button>
          <button :disabled="currentPage === totalPages" @click="changePage(currentPage+1)">›</button>
          <select v-model.number="pageSize">
            <option v-for="size in [5,10,20]" :key="size" :value="size">{{size}} / page</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Modal Thêm/Sửa -->
   <!-- Modal Thêm/Sửa -->
<div v-if="showModal" class="modal-overlay">
  <div class="modal-content">
    <h3>{{ editCustomer ? 'Sửa khách hàng' : 'Thêm khách hàng' }}</h3>
    <form @submit.prevent="saveCustomer">
      <input v-model="modalData.code" placeholder="Mã KH" required />
      <input v-model="modalData.name" placeholder="Tên KH" required />
      <input v-model="modalData.phone" placeholder="Số điện thoại" required />
      <input v-model="modalData.joinDate" placeholder="Ngày tham gia" required />
      <select v-model="modalData.status">
        <option value="active">Kích hoạt</option>
        <option value="inactive">Chưa kích hoạt</option>
      </select>
      <div class="modal-actions">
        <button type="submit">Lưu</button>
        <button type="button" @click="closeModal">Hủy</button>
      </div>
    </form>
  </div>
</div>
  </div>
</template>

<script>
export default {
  name: 'CustomerManager',
  data() {
    return {
      search: '',
      status: '',
      currentPage: 1,
      pageSize: 5,
      showModal: false,
      editCustomer: null,
      modalData: {
        code: '',
        name: '',
        phone: '',
        joinDate: '',
        status: 'active'
      },
      customers: [
        { id: 1, code: 'KH001', name: 'Nguyễn Văn A', phone: '0912345678', joinDate: '21/09/2020', status: 'active' },
        { id: 2, code: 'KH002', name: 'Trần Thị Bình', phone: '0923456789', joinDate: '21/09/2021', status: 'inactive' },
        { id: 3, code: 'KH003', name: 'Lê Thị Lan', phone: '0965432109', joinDate: '21/09/2611', status: 'active' },
        { id: 4, code: 'KH004', name: 'Phạm Văn Minh', phone: '0954321098', joinDate: '21/09/2611', status: 'active' },
        { id: 5, code: 'KH005', name: 'Vũ Thị Nga', phone: '0943210987', joinDate: '21/09/2611', status: 'active' },
        { id: 6, code: 'KH8201', name: 'a', phone: '1234567890', joinDate: '10/07/2025', status: 'active' },
      ]
    }
  },
  computed: {
    filteredCustomers() {
      return this.customers.filter(cus => {
        const matchSearch = this.search === '' || cus.name.toLowerCase().includes(this.search.toLowerCase()) || cus.code.toLowerCase().includes(this.search.toLowerCase());
        const matchStatus = this.status === '' || cus.status === this.status;
        return matchSearch && matchStatus;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredCustomers.length / this.pageSize) || 1;
    },
    pagedCustomers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredCustomers.slice(start, start + this.pageSize);
    },
    visiblePages() {
      let pages = [];
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + 4);
      if (end - start < 4) start = Math.max(1, end - 4);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    }
  },
  watch: {
    filteredCustomers() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    },
    pageSize() {
      this.currentPage = 1;
    }
  },
  methods: {
    resetFilter() {
      this.search = '';
      this.status = '';
      this.currentPage = 1;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openAddModal() {
      this.editCustomer = null;
      this.modalData = {
        code: '',
        name: '',
        phone: '',
        joinDate: '',
        status: 'active'
      };
      this.showModal = true;
    },
    openEditModal(cus) {
      this.editCustomer = cus;
      this.modalData = { ...cus };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveCustomer() {
      if (this.editCustomer) {
        Object.assign(this.editCustomer, this.modalData);
      } else {
        const newId = Math.max(...this.customers.map(c => c.id)) + 1;
        this.customers.push({ ...this.modalData, id: newId });
      }
      this.closeModal();
    },
    deleteCustomer(id) {
      this.customers = this.customers.filter(c => c.id !== id);
    }
  }
}
</script>

<style scoped>
.customer-manager {
  background: #f7f8fa;
  padding: 32px;
}
.filter-section {
  background: #fff;
  border-radius: 8px;
  padding: 18px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.filter-row {
  display: flex;
  gap: 18px;
  align-items: center;
}
.filter-row input, .filter-row select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}
.filter-row button {
  background: #444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  cursor: pointer;
  font-weight: 500;
}
.customer-list-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.add-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #1d4ed8;
}
.customer-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}
.customer-table th, .customer-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #f2f2f2;
  text-align: left;
}
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.98rem;
}
.status-badge.active {
  background: #e6f7e6;
  color: #22c55e;
}
.status-badge.inactive {
  background: #fbeaea;
  color: #e53935;
}
.pagination-center {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
.pagination {
  display: flex;
  align-items: center;
  gap: 4px;
}
.pagination button {
  border: 1px solid #2563eb;
  background: #fff;
  color: #2563eb;
  border-radius: 6px;
  padding: 4px 12px;
  font-weight: 500;
  cursor: pointer;
  margin: 0 2px;
  min-width: 32px;
  transition: background 0.2s, color 0.2s;
}

.pagination button.active,
.pagination button:hover:not(:disabled) {
  background: #2563eb;
  color: #fff;
}
.pagination button:disabled {
  background: #eee;
  color: #aaa;
  border-color: #eee;
  cursor: not-allowed;
}
.pagination select {
  margin-left: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 10px;
  padding: 28px 32px;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
}
.modal h3 {
  margin-top: 0;
  margin-bottom: 18px;
  font-size: 1.2rem;
}
.modal input, .modal select {
  display: block;
  width: 100%;
  margin-bottom: 14px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 10px;
  padding: 32px 40px;
  min-width: 420px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
}
.modal-content h3 {
  margin-top: 0;
  margin-bottom: 18px;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal-content input, .modal-content select {
  display: block;
  width: 100%;
  margin-bottom: 14px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.modal-actions button {
  padding: 7px 18px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
}
</style>

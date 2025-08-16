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

<style>
/* Styles moved to SCSS file: src/scss/pages/khach-hang.scss */
</style>

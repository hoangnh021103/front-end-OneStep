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
        <button class="add-btn">Thêm mới khách hàng</button>
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
          <tr v-for="(cus, idx) in filteredCustomers" :key="cus.id">
            <td>{{ idx + 1 }}</td>
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
              <button>✏️</button>
              <button>🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  name: 'CustomerManager',
  data() {
    return {
      search: '',
      status: '',
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
    }
  },
  methods: {
    resetFilter() {
      this.search = '';
      this.status = '';
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
</style>
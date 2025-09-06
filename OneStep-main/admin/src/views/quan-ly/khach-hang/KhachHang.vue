<template>
  <div class="customer-manager">
    <header>
      <h2>Quản lý khách hàng</h2>
    </header>
    <section class="filter-section">
      <div class="filter-row">
        <input v-model="search" placeholder="Nhập tên để tìm kiếm..." />
        <select v-model="status">
          <option value="">Chọn trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Ngừng</option>
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
            <th>Tên KH</th>
            <th>Trạng thái</th>
            <th>Ngày cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cus, idx) in pagedCustomers" :key="cus.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
            <td>{{ cus.ten }}</td>
            <td>
              <span :class="['status-badge', cus.trangThai === 1 ? 'active' : 'inactive']">
                {{ cus.trangThai === 1 ? 'Hoạt động' : 'Ngừng' }}
              </span>
            </td>
            <td>{{ cus.ngayCapNhat }}</td>
            <td>
              <button @click="editCustomer(idx)">✏️</button>
              <button @click="deleteCustomer(idx)">🗑</button>
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
    <h3>{{ editIndex !== null ? 'Sửa khách hàng' : 'Thêm khách hàng' }}</h3>
    <form @submit.prevent="saveCustomer">
      <input v-model="newCustomer.ten" placeholder="Tên khách hàng" required />
      <select v-model="newCustomer.trangThai">
        <option :value="1">Hoạt động</option>
        <option :value="0">Ngừng</option>
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

<script src="./KhachHang.js"></script>


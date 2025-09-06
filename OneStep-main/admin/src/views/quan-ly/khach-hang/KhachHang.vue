<template>
  <div class="customer-manager">
    <header>
      <h2>Quản lý khách hàng</h2>
    </header>
    <section class="filter-section">
      <div class="filter-row">
        <input v-model="search" placeholder="Nhập họ tên, email hoặc số điện thoại..." />
        <select v-model="genderFilter">
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
        <button @click="resetFilter">Đặt lại bộ lọc</button>
      </div>
    </section>
    <section class="customer-list-section">
      <div class="list-header">
        <span>{{ filteredCustomers.length }} khách hàng</span>
        <div class="header-actions">
          <button class="refresh-btn" @click="fetchCustomers" title="Tải lại dữ liệu">🔄</button>
          <button class="add-btn" @click="openAddModal">Thêm mới khách hàng</button>
        </div>
      </div>
      <table class="customer-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="customers.length === 0">
            <td colspan="9" class="no-data">
              <div class="empty-state">
                <div class="empty-icon">👥</div>
                <div class="empty-text">Chưa có khách hàng nào</div>
                <div class="empty-subtext">Nhấn "Thêm mới khách hàng" để tạo khách hàng đầu tiên</div>
              </div>
            </td>
          </tr>
          <tr v-for="(cus, idx) in pagedCustomers" :key="cus.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
            <td>{{ cus.hoTen }}</td>
            <td>{{ formatDate(cus.ngaySinh) }}</td>
            <td>{{ cus.gioiTinh }}</td>
            <td>{{ cus.email }}</td>
            <td>{{ cus.soDienThoai }}</td>
            <td>{{ formatDate(cus.ngayTao) }}</td>
            <td>{{ formatDate(cus.ngayCapNhat) }}</td>
            <td>
              <button class="action-btn edit" @click="editCustomer(cus)" title="Sửa">✏️</button>
              <button class="action-btn delete" @click="deleteCustomer(cus.id)" title="Xóa">🗑</button>
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
      <input v-model="newCustomer.hoTen" placeholder="Họ và tên" required />
      <input v-model="newCustomer.ngaySinh" type="date" placeholder="Ngày sinh" />
      <select v-model="newCustomer.gioiTinh">
        <option value="">Chọn giới tính</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
      </select>
      <input v-model="newCustomer.email" type="email" placeholder="Email" />
      <input v-model="newCustomer.soDienThoai" placeholder="Số điện thoại" />
      <input v-model="newCustomer.urlAnh" placeholder="URL ảnh (tùy chọn)" />
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


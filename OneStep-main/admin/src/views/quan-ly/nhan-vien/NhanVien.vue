<template>
  <div class="employee-manager">
    <header>
      <h2>Quản lý nhân viên</h2>
      
    </header>
    <section class="filter-section">
      <div class="filter-row">
        <input v-model="search" placeholder="Tìm kiếm họ tên, email hoặc số điện thoại..." />
        <select v-model="genderFilter">
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
        <button @click="resetFilter">Đặt lại bộ lọc</button>
      </div>
    </section>
    <section class="employee-list-section">
      <div class="list-header">
        <span>Danh sách nhân viên</span>
        <button class="add-btn" @click="openAddModal">Thêm mới nhân viên</button>
      </div>
      <table class="employee-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="employees.length === 0">
            <td colspan="11" class="no-data">
              <div class="empty-state">
                <div class="empty-icon">👥</div>
                <div class="empty-text">Chưa có nhân viên nào</div>
                <div class="empty-subtext">Nhấn "Thêm mới nhân viên" để bắt đầu</div>
              </div>
            </td>
          </tr>
          <tr v-for="(emp, idx) in pagedEmployees" :key="emp.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
            <td>{{ emp.hoTen }}</td>
            <td>{{ formatDate(emp.ngaySinh) }}</td>
            <td>{{ emp.gioiTinh }}</td>
            <td>{{ emp.email }}</td>
            <td>{{ emp.soDienThoai }}</td>
            <td>{{ emp.diaChi }}</td>
            <td>{{ getRoleName(emp.vaiTroId) }}</td>
            <td>{{ formatDate(emp.ngayTao) }}</td>
            <td>{{ formatDate(emp.ngayCapNhat) }}</td>
            <td>
              <button class="action-btn edit" @click="openEditModal(emp)" title="Sửa">✏️</button>
              <button class="action-btn delete" @click="deleteEmployee(emp.id)" title="Xóa">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
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
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ editEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên' }}</h3>
        <form @submit.prevent="saveEmployee">
          <input v-model="modalData.hoTen" placeholder="Họ và tên" required />
          <input v-model="modalData.ngaySinh" type="date" placeholder="Ngày sinh" />
          <select v-model="modalData.gioiTinh">
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          <input v-model="modalData.email" type="email" placeholder="Email" required />
          <input v-model="modalData.soDienThoai" placeholder="Số điện thoại" required />
          <input v-model="modalData.diaChi" placeholder="Địa chỉ" />
          <input v-model="modalData.urlAnh" placeholder="URL ảnh (tùy chọn)" />
          <select v-model="modalData.vaiTroId">
            <option value="0">Chọn vai trò</option>
            <option value="1">Quản lý</option>
            <option value="2">Nhân viên</option>
            <option value="3">Thực tập sinh</option>
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

<script src="./NhanVien.js"></script>

<style scoped>
/* Empty state styles */
.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
}
</style>

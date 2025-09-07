<template>
  <div class="image-manager">
    <header>
      <h2>Quản lý thư viện ảnh</h2>
    </header>
    <section class="filter-section">
      <div class="filter-row">
        <input v-model="search" placeholder="Tìm kiếm tên ảnh hoặc sản phẩm..." />
        <button @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
      </div>
    </section>
    <section class="image-list-section">
      <div class="list-header">
        <span>Danh sách ảnh</span>
        <button class="add-btn" @click="openAddModal"><i class="fa fa-plus"></i> Thêm mới ảnh</button>
      </div>
      <table class="image-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Tên ảnh</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredImages.length === 0">
            <td colspan="7" class="no-data">
              <div class="empty-state">
                <div class="empty-icon"><i class="fa fa-image"></i></div>
                <div class="empty-text">Chưa có ảnh nào</div>
                <div class="empty-subtext">Nhấn "Thêm mới ảnh" để bắt đầu</div>
              </div>
            </td>
          </tr>
          <tr v-for="(img, idx) in pagedImages" :key="img.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
            <td>
              <img 
                :src="img.duongDanAnh" 
                :alt="img.tenSanPham" 
                class="img-thumb" 
                @error="handleImageError"
                @load="handleImageLoad"
              />
              <div v-if="!img.duongDanAnh" class="no-image">Không có ảnh</div>
            </td>
            <td>{{ img.tenSanPham }}</td>
            <td>
              <button class="action-btn view" @click="viewImage(img)" title="Xem"><i class="fa fa-eye"></i></button>
              <button class="action-btn edit" @click="openEditModal(img)" title="Sửa"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" @click="deleteImage(img.id)" title="Xóa"><i class="fa fa-trash"></i></button>
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
        <h3>{{ editImage ? 'Sửa ảnh' : 'Thêm ảnh mới' }}</h3>
        <form @submit.prevent="saveImage">
          <div class="form-group">
            <label>Tên ảnh:</label>
            <input 
              v-model="modalData.tenSanPham" 
              placeholder="Nhập tên ảnh (ví dụ: puma)" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label>Đường dẫn ảnh:</label>
            <input 
              v-model="modalData.duongDanAnh" 
              placeholder="Nhập URL ảnh (ví dụ: https://example.com/image.jpg)" 
              required 
            />
          </div>
          
          <!-- Preview ảnh -->
          <div v-if="modalData.duongDanAnh && modalData.duongDanAnh.startsWith('http')" class="image-preview">
            <h4>Preview ảnh:</h4>
            <img 
              :src="modalData.duongDanAnh" 
              :alt="modalData.tenSanPham" 
              class="preview-img" 
              @error="handlePreviewError"
              @load="handlePreviewLoad"
            />
          </div>
          
          <div class="modal-actions">
            <button type="submit">
              <i class="fa fa-check"></i> {{ editImage ? 'Sửa' : 'Thêm' }}
            </button>
            <button type="button" @click="closeModal">
              <i class="fa fa-times"></i> Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script src="./ThuVienAnh.JS"></script>


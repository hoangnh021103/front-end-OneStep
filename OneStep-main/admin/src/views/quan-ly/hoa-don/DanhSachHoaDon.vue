<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <!-- Main content -->
    <div class="content">
      <!-- Header -->
      <header class="header">
        <div></div>
      </header>
      <div class="page-title">
        <h2>Quản lý hóa đơn</h2>
      </div>
      <!-- Filter -->
      <div class="filter-box">
        <div class="filter-title">Bộ lọc tìm kiếm</div>
        <div class="filter-controls">
          <input v-model="search" placeholder="Nhập tên khách hàng, sđt, mã đơn..." />
          <input type="date" v-model="fromDate" />
          <input type="date" v-model="toDate" />
          <button @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
          <button @click="manualRefresh" class="refresh-btn"><i class="fa fa-sync-alt"></i> Làm mới</button>
        </div>
      </div>
      <!-- Tabs -->
      <div class="tab-section">
        <span :class="['tab', {active: tab==='all'}]" @click="changeTab('all')">Tất cả <span class="tab-badge">{{ filteredInvoices.length }}</span></span>
        <span :class="['tab', {active: tab==='pending'}]" @click="changeTab('pending')">Chờ xác nhận <span class="tab-badge">{{ countByStatus('pending') }}</span></span>
        <span :class="['tab', {active: tab==='confirmed'}]" @click="changeTab('confirmed')">Đã xác nhận <span class="tab-badge">{{ countByStatus('confirmed') }}</span></span>
        <span :class="['tab', {active: tab==='shipping'}]" @click="changeTab('shipping')">Chờ giao <span class="tab-badge">{{ countByStatus('shipping') }}</span></span>
        <span :class="['tab', {active: tab==='delivering'}]" @click="changeTab('delivering')">Đang giao <span class="tab-badge">{{ countByStatus('delivering') }}</span></span>
        <span :class="['tab', {active: tab==='done'}]" @click="changeTab('done')">Hoàn thành <span class="tab-badge">{{ countByStatus('done') }}</span></span>
        <span :class="['tab', {active: tab==='cancel'}]" @click="changeTab('cancel')">Đã hủy <span class="tab-badge">{{ countByStatus('cancel') }}</span></span>
      </div>
      <!-- Table -->
      <div class="table-section">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã Đơn</th>
              <th>Tên Khách Hàng</th>
              <th>SĐT Khách Hàng</th>
              <th>Loại Đơn</th>
              <th>Email</th>
              <th>Sản Phẩm</th>
              <th>Tổng Tiền</th>
              <th>Ngày Tạo</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tabInvoices.length === 0">
              <td colspan="11" class="no-data">
                <div class="empty-state">
                  <div class="empty-icon"><i class="fa fa-file-invoice"></i></div>
                  <div class="empty-text">Chưa có hóa đơn nào</div>
                  <div class="empty-subtext">Dữ liệu hóa đơn sẽ hiển thị ở đây</div>
                </div>
              </td>
            </tr>
            <tr v-for="(inv, idx) in tabInvoices" :key="inv.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ inv.maDon }}</td>
              <td>{{ inv.hoTen }}</td>
              <td>{{ inv.soDienThoai }}</td>
              <td>
                <span class="type-badge">{{ formatType(inv.loaiDon) }}</span>
              </td>
              <td>{{ inv.email }}</td>
              <td>
                <div class="product-info">
                  <div class="product-count">
                    <i class="fa fa-box"></i>
                    {{ inv.soLuongSanPham || 0 }} sản phẩm
                  </div>
                  <div class="product-types">
                    <i class="fa fa-tags"></i>
                    {{ inv.soLoaiSanPham || 0 }} loại
                  </div>
                </div>
              </td>
              <td>{{ formatCurrency(inv.tongTien) }}</td>
              <td>{{ formatDateTime(inv.ngayCapNhat) }}</td>
              <td>
                <span :class="['status-badge', inv.statusClass]">{{ inv.statusLabel }}</span>
              </td>
              <td>
                <!-- Nút chỉnh sửa cho tất cả đơn hàng, nhưng có validation bên trong -->
                <button 
                  class="action-btn edit-btn" 
                  title="Chỉnh sửa" 
                  @click="editInvoice(idx)"
                >
                  <i class="fa fa-edit"></i>
                </button>
                
                <!-- Nút xem chi tiết hóa đơn -->
                <button 
                  class="action-btn detail-btn" 
                  title="Xem chi tiết hóa đơn" 
                  @click="viewInvoiceDetail(inv)"
                >
                  <i class="fa fa-eye"></i>
                </button>
                
                <button class="action-btn delete-btn" title="Xóa" @click="deleteInvoice(inv.id)"><i class="fa fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Modal for Editing Invoice -->
      <div v-if="showModal" class="modal-overlay">
        <div class="form-card">
          <div class="header">
            <h2>Chỉnh sửa hóa đơn</h2>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mã Đơn *</label>
              <input
                v-model="newInvoice.maDon"
                type="text"
                placeholder="Nhập mã đơn"
                :class="{ 'error': errors.maDon }"
              />
              <span class="error-message" v-if="errors.maDon">{{ errors.maDon }}</span>
            </div>
            <div class="form-group">
              <label>Tên Khách Hàng *</label>
              <input
                v-model="newInvoice.hoTen"
                type="text"
                placeholder="Nhập tên khách hàng"
                :class="{ 'error': errors.hoTen }"
              />
              <span class="error-message" v-if="errors.hoTen">{{ errors.hoTen }}</span>
            </div>
            <div class="form-group">
              <label>SĐT Khách Hàng *</label>
              <input
                v-model="newInvoice.soDienThoai"
                type="text"
                placeholder="Nhập số điện thoại"
                :class="{ 'error': errors.soDienThoai }"
              />
              <span class="error-message" v-if="errors.soDienThoai">{{ errors.soDienThoai }}</span>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input
                v-model="newInvoice.email"
                type="text"
                placeholder="Nhập email"
                :class="{ 'error': errors.email }"
              />
              <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
            </div>
            <div class="form-group">
              <label>Loại Đơn *</label>
              <select v-model="newInvoice.loaiDon" :class="{ 'error': errors.loaiDon }">
                <option :value="0">OFFLINE</option>
                <option :value="1">ONLINE</option>
              </select>
              <span class="error-message" v-if="errors.loaiDon">{{ errors.loaiDon }}</span>
            </div>
            <div class="form-group">
              <label>Tổng Tiền *</label>
              <input
                v-model.number="newInvoice.tongTien"
                type="number"
                min="0"
                placeholder="Nhập tổng tiền"
                :class="{ 'error': errors.tongTien }"
              />
              <span class="error-message" v-if="errors.tongTien">{{ errors.tongTien }}</span>
            </div>
            <div class="form-group">
              <label>Ngày Tạo</label>
              <input
                v-model="newInvoice.ngayCapNhat"
                type="date"
                readonly
                style="background-color: #f5f5f5; cursor: not-allowed;"
              />
            </div>
            <div class="form-group">
              <label>Ngày Xác Nhận *</label>
              <input
                v-model="newInvoice.ngayXacNhan"
                type="date"
                :class="{ 'error': errors.ngayXacNhan }"
              />
              <span class="error-message" v-if="errors.ngayXacNhan">{{ errors.ngayXacNhan }}</span>
            </div>
            <div class="form-group">
              <label>Trạng Thái *</label>
              <select v-model="newInvoice.status" :class="{ 'error': errors.status }">
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Chờ giao</option>
                <option value="delivering">Đang giao</option>
                <option value="done">Hoàn thành</option>
                <option value="cancel">Đã hủy</option>
              </select>
              <span class="error-message" v-if="errors.status">{{ errors.status }}</span>
            </div>
          </div>
          <div class="actions">
            <button
              class="btn-primary"
              @click="handleSubmit"
              :disabled="isSubmitting"
            >
              <i class="fa fa-check"></i> {{ isSubmitting ? 'Đang lưu...' : 'Cập nhật' }}
            </button>
            <button
              class="btn-secondary"
              @click="closeModal"
              :disabled="isSubmitting"
            >
              <i class="fa fa-times"></i> Hủy
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal for Invoice Detail -->
      <div v-if="showDetailModal" class="modal-overlay">
        <div class="detail-modal">
          <div class="detail-header">
            <h2><i class="fa fa-file-invoice"></i> Chi tiết hóa đơn</h2>
            <button @click="showDetailModal = false" class="close-btn">
              <i class="fa fa-times"></i>
            </button>
          </div>
          
          <div class="detail-content" v-if="selectedInvoice">
            <div class="detail-section">
              <h3><i class="fa fa-info-circle"></i> Thông tin chung</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Mã đơn:</label>
                  <span class="value">{{ selectedInvoice.maDon }}</span>
                </div>
                <div class="detail-item">
                  <label>Loại đơn:</label>
                  <span :class="['value', 'type-badge', selectedInvoice.loaiDon === 0 ? 'offline' : 'online']">
                    {{ formatType(selectedInvoice.loaiDon) }}
                  </span>
                </div>
                <div class="detail-item">
                  <label>Trạng thái:</label>
                  <span :class="['value', 'status-badge', selectedInvoice.statusClass]">
                    {{ selectedInvoice.statusLabel }}
                  </span>
                </div>
                <div class="detail-item">
                  <label>Ngày tạo:</label>
                  <span class="value">{{ formatDateTime(selectedInvoice.ngayCapNhat) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3><i class="fa fa-user"></i> Thông tin khách hàng</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Họ tên:</label>
                  <span class="value">{{ selectedInvoice.hoTen || 'Chưa có thông tin' }}</span>
                </div>
                <div class="detail-item">
                  <label>Số điện thoại:</label>
                  <span class="value">{{ selectedInvoice.soDienThoai || 'Chưa có thông tin' }}</span>
                </div>
                <div class="detail-item">
                  <label>Email:</label>
                  <span class="value">{{ selectedInvoice.email || 'Chưa có thông tin' }}</span>
                </div>
                <div class="detail-item">
                  <label>ID khách hàng:</label>
                  <span class="value">{{ selectedInvoice.khachHangId || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3><i class="fa fa-shopping-cart"></i> Thông tin sản phẩm</h3>
              
              <div v-if="isLoadingDetail" class="loading-products">
                <i class="fa fa-spinner fa-spin"></i> Đang tải thông tin sản phẩm...
              </div>
              
              <div v-else-if="selectedInvoiceProducts.length === 0" class="no-products">
                <i class="fa fa-box-open"></i> Chưa có sản phẩm nào trong đơn hàng này
              </div>
              
              <div v-else class="products-list">
                <div class="products-summary">
                  <div class="summary-item">
                    <label>Tổng số sản phẩm:</label>
                    <span class="value">{{ getTotalQuantity() }} sản phẩm</span>
                  </div>
                  <div class="summary-item">
                    <label>Số loại sản phẩm:</label>
                    <span class="value">{{ selectedInvoiceProducts.length }} loại</span>
                  </div>
                </div>
                
                <div class="product-items">
                  <div v-for="(product, index) in selectedInvoiceProducts" :key="index" class="product-item">
                    <div class="product-image">
                      <img v-if="product.chiTietSanPham?.duongDanAnh" 
                           :src="product.chiTietSanPham.duongDanAnh" 
                           :alt="product.chiTietSanPham?.sanPham?.tenSanPham || 'Sản phẩm'"
                           @error="handleImageError($event)">
                      <div v-else class="no-image">
                        <i class="fa fa-image"></i>
                      </div>
                    </div>
                    
                    <div class="product-info">
                      <div class="product-name">
                        {{ product.chiTietSanPham?.sanPham?.tenSanPham || 'Tên sản phẩm không xác định' }}
                      </div>
                      <div class="product-code">
                        Mã: {{ product.chiTietSanPham?.sanPham?.maCode || 'N/A' }}
                      </div>
                      <div class="product-details">
                        <span class="detail-tag">Size: {{ product.chiTietSanPham?.kichCo?.ten || 'N/A' }}</span>
                        <span class="detail-tag">Màu: {{ product.chiTietSanPham?.mauSac?.ten || 'N/A' }}</span>
                      </div>
                      <div class="product-brand">
                        Thương hiệu: {{ product.chiTietSanPham?.sanPham?.thuongHieu?.ten || 'N/A' }}
                      </div>
                      <div class="product-material">
                        Chất liệu: {{ product.chiTietSanPham?.sanPham?.chatLieu?.ten || 'N/A' }}
                      </div>
                    </div>
                    
                    <div class="product-pricing">
                      <div class="quantity">
                        <label>Số lượng:</label>
                        <span class="value">{{ product.soLuong }}</span>
                      </div>
                      <div class="unit-price">
                        <label>Đơn giá:</label>
                        <span class="value price">{{ formatCurrency(product.donGia) }}</span>
                      </div>
                      <div class="total-price">
                        <label>Thành tiền:</label>
                        <span class="value price total">{{ formatCurrency(product.tongTien) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3><i class="fa fa-money-bill-wave"></i> Thông tin thanh toán</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Tổng tiền gốc:</label>
                  <span class="value price">{{ formatCurrency(selectedInvoice.tongTienGoc) }}</span>
                </div>
                <div class="detail-item">
                  <label>Tiền giảm:</label>
                  <span class="value price discount">{{ formatCurrency(selectedInvoice.tienGiam) }}</span>
                </div>
                <div class="detail-item">
                  <label>Tiền ship:</label>
                  <span class="value price">{{ formatCurrency(selectedInvoice.tienShip) }}</span>
                </div>
                <div class="detail-item total">
                  <label>Tổng tiền:</label>
                  <span class="value price total-price">{{ formatCurrency(selectedInvoice.tongTien) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section" v-if="selectedInvoice.ghiChu">
              <h3><i class="fa fa-sticky-note"></i> Ghi chú</h3>
              <div class="note-content">
                {{ selectedInvoice.ghiChu }}
              </div>
            </div>
          </div>
          
          <div class="detail-actions">
            <button @click="showDetailModal = false" class="btn-secondary">
              <i class="fa fa-times"></i> Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from 'vue3-toastify';

export default {
  data() {
    return {
      invoices: [],
      search: "",
      status: "",
      fromDate: "",
      toDate: "",
      tab: "all",
      showModal: false,
      showDetailModal: false,
      selectedInvoice: null,
      selectedInvoiceProducts: [],
      isLoadingDetail: false,
      isSubmitting: false,
      editIndex: null,
      newInvoice: {
        khachHangId: 0,
        nhanVienId: 0,
        voucherId: 0,
        diaChiId: 0,
        soDienThoai: "",
        hoTen: "",
        email: "",
        tongTienGoc: 0,
        tienGiam: 0,
        tongTien: 0,
        tienShip: 0,
        ngayXacNhan: "",
        ngayDuKien: "",
        ngayNhan: "",
        loaiDon: 0,
        ghiChu: "",
        maDon: "",
        trangThai: 1, // Giá trị gốc từ database
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: "",
        daXoa: 0,
        status: "pending", // Chỉ dùng cho form UI
        originalTrangThai: 1 // Giữ lại giá trị gốc để debug
      },
      errors: {
        maDon: "",
        hoTen: "",
        soDienThoai: "",
        email: "",
        loaiDon: "",
        tongTien: "",
        ngayXacNhan: "",
        status: ""
      }
    };
  },
  computed: {
    filteredInvoices() {
      const keyword = this.search.toLowerCase();
      const filtered = this.invoices
        .filter(inv => {
          const matchSearch = this.search === '' ||
            (inv.hoTen && inv.hoTen.toLowerCase().includes(keyword)) ||
            (inv.soDienThoai && inv.soDienThoai.includes(keyword)) ||
            (inv.maDon && inv.maDon.toLowerCase().includes(keyword)) ||
            (inv.email && inv.email.toLowerCase().includes(keyword));
          const matchFrom = !this.fromDate || inv.ngayCapNhat >= this.fromDate;
          const matchTo = !this.toDate || inv.ngayCapNhat <= this.toDate;
          return matchSearch && matchFrom && matchTo;
        })
        .map(inv => {
          // ✅ LOGIC MỚI: Đơn hàng tại quầy luôn hiển thị trạng thái "hoàn thành"
          let effectiveTrangThai = inv.trangThai || 1;
          if (inv.loaiDon === 0) {
            // Đơn hàng tại quầy - force về trạng thái hoàn thành
            effectiveTrangThai = 5;
            console.log('🏪 Đơn hàng tại quầy ' + inv.maDon + ' - Force hiển thị trạng thái = 5 (Hoàn thành)');
          }
          
          const status = this.mapTrangThaiToStatus(effectiveTrangThai);
          return {
            ...inv,
            status: status, // Chuyển từ số sang string
            statusLabel: this.statusLabel(status),
            statusClass: status,
            originalTrangThai: inv.trangThai, // Giữ lại giá trị gốc từ database
            effectiveTrangThai: effectiveTrangThai // Trạng thái hiệu lực để hiển thị
          };
        })
        .sort((a, b) => {
          // Sắp xếp theo ngày cập nhật mới nhất trước, sau đó theo ID giảm dần
          if (a.ngayCapNhat && b.ngayCapNhat) {
            const dateA = new Date(a.ngayCapNhat);
            const dateB = new Date(b.ngayCapNhat);
            const dateComparison = dateB - dateA; // Mới nhất trước
            if (dateComparison !== 0) {
              return dateComparison;
            }
          }
          // Nếu ngày bằng nhau hoặc null, sắp xếp theo ID giảm dần
          return (b.id || 0) - (a.id || 0);
        });
      
      return filtered;
    },
    tabInvoices() {
      if (this.tab === 'all') {
        return this.filteredInvoices;
      } else {
        return this.filteredInvoices.filter(inv => inv.status === this.tab);
      }
    }
  },
  methods: {
    // Map từ số trạng thái API sang string cho UI
    mapTrangThaiToStatus(trangThai) {
      switch (trangThai) {
        case 1: return 'pending';    // Chờ xác nhận
        case 2: return 'confirmed';  // Đã xác nhận
        case 3: return 'shipping';   // Chờ giao
        case 4: return 'delivering'; // Đang giao
        case 5: return 'done';       // Hoàn thành
        case 6: return 'cancel';     // Đã hủy
        default: return 'pending';
      }
    },
    
    // Map từ string UI sang số cho API
    mapStatusToTrangThai(status) {
      switch (status) {
        case 'pending': return 1;    // Chờ xác nhận
        case 'confirmed': return 2;  // Đã xác nhận
        case 'shipping': return 3;   // Chờ giao
        case 'delivering': return 4; // Đang giao
        case 'done': return 5;       // Hoàn thành
        case 'cancel': return 6;     // Đã hủy
        default: return 1;
      }
    },

    async fetchInvoices(isAutoRefresh = false) {
      try {
        if (!isAutoRefresh) {
          console.log('🔄 Đang tải danh sách hóa đơn từ TẤT CẢ nguồn...');
        }
        
        const res = await axios.get("http://localhost:8080/don-hang/hien-thi", {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        let allInvoices = Array.isArray(res.data) ? res.data : res.data.data || [];
        
        // Chỉ cập nhật nếu có thay đổi thực sự để tránh jumping
        const hasChanges = this.hasSignificantChanges(this.invoices, allInvoices);
        
        if (!hasChanges && isAutoRefresh) {
          // Không có thay đổi trong auto-refresh, bỏ qua cập nhật
          if (!isAutoRefresh) {
            console.log('🔄 Không có thay đổi, bỏ qua cập nhật');
          }
          return;
        }
        
        // Đánh dấu rõ ràng loại đơn hàng
        this.invoices = allInvoices.map((inv) => {
          return {
            ...inv,
            isOnline: inv.loaiDon === 1, // Đơn hàng từ trangchu (ONLINE)
            isOffline: inv.loaiDon === 0, // Đơn hàng từ admin (OFFLINE)
            displayType: inv.loaiDon === 1 ? 'Online' : 'Tại quầy',
            displayMaDon: inv.maDon || inv.maDonHang || 'N/A'
          };
        });
        
        if (!isAutoRefresh) {
          console.log('✅ Đã tải TẤT CẢ hóa đơn:', this.invoices.length, 'hóa đơn');
          console.log(`📊 Thống kê: ${this.invoices.filter(i => i.isOnline).length} đơn online (từ trangchu), ${this.invoices.filter(i => i.isOffline).length} đơn offline (từ admin)`);
        }
        
        // Force update chỉ khi cần thiết
        if (hasChanges) {
          this.$nextTick(() => {
            this.$forceUpdate();
          });
        }
      } catch (err) {
        // Chỉ hiển thị lỗi khi không phải auto-refresh để tránh spam notification
        if (!isAutoRefresh) {
          console.error('❌ Error fetching invoices:', err);
          
          // Hiển thị thông báo lỗi chi tiết hơn
          let errorMessage = 'Không thể tải danh sách hóa đơn';
          if (err.response?.status === 500) {
            errorMessage += ' - Lỗi server backend';
          } else if (err.code === 'NETWORK_ERROR') {
            errorMessage += ' - Không thể kết nối đến server';
          } else if (err.response?.data?.message) {
            errorMessage += ': ' + err.response.data.message;
          }
          
          toast.error(errorMessage);
          
          // Đặt danh sách rỗng nếu có lỗi
          this.invoices = [];
        }
      }
    },

    async deleteInvoice(id) {
      if (confirm("Xác nhận xóa hóa đơn này?")) {
        try {
          await axios.delete(`http://localhost:8080/don-hang/delete/${id}`);
          this.invoices = this.invoices.filter(inv => inv.id !== id);
          toast.success("Xóa hóa đơn thành công!");
        } catch (err) {
          console.error('Error deleting invoice:', err);
          toast.error("Lỗi khi xóa hóa đơn!");
        }
      }
    },

    resetFilter() {
      this.search = "";
      this.status = "";
      this.fromDate = "";
      this.toDate = "";
      this.fetchInvoices();
    },

    manualRefresh() {
      console.log('🔄 Manual refresh triggered by user');
      this.fetchInvoices(false); // Force refresh không phải auto-refresh
    },

    countByStatus(status) {
      return this.filteredInvoices.filter(inv => inv.status === status).length;
    },

    // Method để debug trạng thái hóa đơn
    debugInvoiceStatus() {
      console.log('🔍 === DEBUG INVOICE STATUS ===');
      console.log('📋 Total invoices:', this.invoices.length);
      console.log('🔍 Filtered invoices:', this.filteredInvoices.length);
      console.log('📊 Tab invoices:', this.tabInvoices.length);
      console.log('🏷️ Current tab:', this.tab);
      
      const statusCounts = {};
      this.filteredInvoices.forEach(inv => {
        const status = inv.status;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      console.log('📈 Status counts:', statusCounts);
      
      // Hiển thị chi tiết từng hóa đơn
      this.filteredInvoices.forEach(inv => {
        console.log(`📄 Invoice ${inv.maDon}:`, {
          id: inv.id,
          trangThai: inv.originalTrangThai || inv.trangThai,
          status: inv.status,
          statusLabel: inv.statusLabel
        });
      });
    },

    // Method để kiểm tra có thay đổi đáng kể không
    hasSignificantChanges(currentInvoices, newInvoices) {
      // Kiểm tra số lượng đơn hàng
      if (currentInvoices.length !== newInvoices.length) {
        console.log('📊 Thay đổi số lượng đơn hàng:', currentInvoices.length, '->', newInvoices.length);
        return true;
      }
      
      // Tạo map của đơn hàng hiện tại để so sánh nhanh
      const currentMap = new Map();
      currentInvoices.forEach(inv => {
        currentMap.set(inv.id, {
          trangThai: inv.trangThai,
          ngayCapNhat: inv.ngayCapNhat,
          tongTien: inv.tongTien,
          maDon: inv.maDon
        });
      });
      
      // Kiểm tra từng đơn hàng mới
      for (const newInv of newInvoices) {
        const current = currentMap.get(newInv.id);
        
        // Đơn hàng mới
        if (!current) {
          console.log('📊 Đơn hàng mới:', newInv.maDon);
          return true;
        }
        
        // Kiểm tra thay đổi trạng thái
        if (current.trangThai !== newInv.trangThai) {
          console.log('📊 Thay đổi trạng thái đơn', newInv.maDon, ':', current.trangThai, '->', newInv.trangThai);
          return true;
        }
        
        // Kiểm tra thay đổi tổng tiền
        if (current.tongTien !== newInv.tongTien) {
          console.log('📊 Thay đổi tổng tiền đơn', newInv.maDon, ':', current.tongTien, '->', newInv.tongTien);
          return true;
        }
        
        // Kiểm tra thay đổi thời gian cập nhật (chỉ so sánh đến phút để tránh thay đổi nhỏ)
        const currentTime = new Date(current.ngayCapNhat).getTime();
        const newTime = new Date(newInv.ngayCapNhat).getTime();
        const timeDiff = Math.abs(newTime - currentTime);
        
        // Nếu chênh lệch > 1 phút thì coi như có thay đổi
        if (timeDiff > 60000) {
          console.log('📊 Thay đổi thời gian đơn', newInv.maDon, ':', new Date(currentTime), '->', new Date(newTime));
          return true;
        }
      }
      
      // Không có thay đổi đáng kể
      return false;
    },

    // Method để thay đổi tab và refresh
    changeTab(newTab) {
      this.tab = newTab;
    },

    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("vi-VN");
    },

    formatDateTime(dateTime) {
      if (!dateTime) return "";
      const d = new Date(dateTime);
      
      // Kiểm tra nếu ngày không hợp lệ
      if (isNaN(d.getTime())) {
        console.warn('⚠️ Invalid date:', dateTime);
        return "Ngày không hợp lệ";
      }
      
      // Format với độ chính xác cao hơn
      const date = d.toLocaleDateString("vi-VN", {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
      
      const time = d.toLocaleTimeString("vi-VN", { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      return `lúc ${time} ${date}`;
    },

    formatCurrency(amount) {
      if (!amount) return "0 VNĐ";
      return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
    },

    statusLabel(status) {
      switch (status) {
        case "pending": return "Chờ xác nhận";
        case "confirmed": return "Đã xác nhận";
        case "shipping": return "Chờ giao";
        case "delivering": return "Đang giao";
        case "done": return "Hoàn thành";
        case "cancel": return "Đã hủy";
        default: return "Không xác định";
      }
    },

    formatType(loaiDon) {
      // Hiển thị loại đơn hàng với style khác nhau
      if (loaiDon === 0) {
        return "Tại quầy"; // OFFLINE - Đơn hàng từ admin
      } else if (loaiDon === 1) {
        return "Online"; // ONLINE - Đơn hàng từ trangchu
      }
      return "Không xác định";
    },

    closeModal() {
      this.showModal = false;
      this.errors = {
        maDon: "",
        hoTen: "",
        soDienThoai: "",
        email: "",
        loaiDon: "",
        tongTien: "",
        ngayXacNhan: "",
        status: ""
      };
    },

    validateForm() {
      this.errors = {
        maDon: "",
        hoTen: "",
        soDienThoai: "",
        email: "",
        loaiDon: "",
        tongTien: "",
        ngayXacNhan: "",
        status: ""
      };
      let isValid = true;

      if (!this.newInvoice.maDon.trim()) {
        this.errors.maDon = "Mã đơn là bắt buộc.";
        isValid = false;
      }
      if (!this.newInvoice.hoTen.trim()) {
        this.errors.hoTen = "Tên khách hàng là bắt buộc.";
        isValid = false;
      }
      // Bỏ validation SĐT và Email
      // if (!this.newInvoice.soDienThoai.trim()) {
      //   this.errors.soDienThoai = "Số điện thoại là bắt buộc.";
      //   isValid = false;
      // }
      // if (this.newInvoice.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newInvoice.email)) {
      //   this.errors.email = "Email không hợp lệ.";
      //   isValid = false;
      // }
      if (this.newInvoice.tongTien <= 0) {
        this.errors.tongTien = "Tổng tiền phải lớn hơn 0.";
        isValid = false;
      }
      if (!this.newInvoice.ngayXacNhan) {
        this.errors.ngayXacNhan = "Ngày xác nhận là bắt buộc.";
        isValid = false;
      }
      if (!this.newInvoice.status) {
        this.errors.status = "Trạng thái là bắt buộc.";
        isValid = false;
      }

      return isValid;
    },

    async handleSubmit() {
      if (!this.validateForm()) return;

      try {
        this.isSubmitting = true;
        const updatedInvoice = { ...this.newInvoice };
        
        // Chuyển đổi status string thành trangThai number cho API
        const originalTrangThai = updatedInvoice.originalTrangThai || updatedInvoice.trangThai;
        const newTrangThai = this.mapStatusToTrangThai(updatedInvoice.status);
        
        console.log('🔄 Chuyển đổi trạng thái:');
        console.log('  - Trạng thái gốc:', originalTrangThai, 'type:', typeof originalTrangThai);
        console.log('  - Status trong form:', updatedInvoice.status, 'type:', typeof updatedInvoice.status);
        console.log('  - Trạng thái mới:', newTrangThai, 'type:', typeof newTrangThai);
        console.log('  - Mã đơn:', updatedInvoice.maDon);
        console.log('  - ID:', updatedInvoice.id);
        
        // Debug đặc biệt cho trạng thái chờ xác nhận
        if (originalTrangThai === 1) {
          console.log('🚨 DEBUG CHỜ XÁC NHẬN trong handleSubmit:', {
            'originalTrangThai': originalTrangThai,
            'newTrangThai': newTrangThai,
            'status': updatedInvoice.status,
            'maDon': updatedInvoice.maDon
          });
        }
        
        // Đảm bảo newTrangThai là Integer, không phải String
        updatedInvoice.trangThai = parseInt(newTrangThai);
        delete updatedInvoice.status; // Xóa trường status không cần thiết cho API
        delete updatedInvoice.originalTrangThai; // Xóa trường debug không cần thiết cho API
        
        // Đảm bảo các field bắt buộc có giá trị
        if (!updatedInvoice.ngayCapNhat) {
          updatedInvoice.ngayCapNhat = new Date().toISOString().slice(0, 19); // Format: yyyy-MM-ddTHH:mm:ss
        } else {
          // Đảm bảo format ngày đúng cho LocalDateTime
          const date = new Date(updatedInvoice.ngayCapNhat);
          updatedInvoice.ngayCapNhat = date.toISOString().slice(0, 19); // Format: yyyy-MM-ddTHH:mm:ss
        }
        
        // Xử lý ngayXacNhan - chỉ cần ngày, không cần time vì là LocalDate
        if (updatedInvoice.ngayXacNhan) {
          // Đảm bảo format đúng cho LocalDate: yyyy-MM-dd
          const xacNhanDate = new Date(updatedInvoice.ngayXacNhan + 'T00:00:00');
          updatedInvoice.ngayXacNhan = xacNhanDate.toISOString().slice(0, 10); // Chỉ lấy phần ngày yyyy-MM-dd
        }
        
        if (!updatedInvoice.daXoa) {
          updatedInvoice.daXoa = 0;
        }
        
        // Đảm bảo các field số là Integer hoặc Float
        updatedInvoice.id = parseInt(updatedInvoice.id);
        updatedInvoice.khachHangId = parseInt(updatedInvoice.khachHangId) || 0;
        updatedInvoice.nhanVienId = parseInt(updatedInvoice.nhanVienId) || 0;
        updatedInvoice.voucherId = parseInt(updatedInvoice.voucherId) || 0;
        updatedInvoice.diaChiId = parseInt(updatedInvoice.diaChiId) || 0;
        updatedInvoice.tongTienGoc = parseFloat(updatedInvoice.tongTienGoc) || 0.0;
        updatedInvoice.tienGiam = parseFloat(updatedInvoice.tienGiam) || 0.0;
        updatedInvoice.tongTien = parseFloat(updatedInvoice.tongTien) || 0.0;
        updatedInvoice.tienShip = parseFloat(updatedInvoice.tienShip) || 0.0;
        updatedInvoice.loaiDon = parseInt(updatedInvoice.loaiDon) || 0;
        updatedInvoice.daXoa = parseInt(updatedInvoice.daXoa) || 0;
        
        // Đảm bảo trangThai là Integer
        updatedInvoice.trangThai = parseInt(updatedInvoice.trangThai);
        
        // Validate dữ liệu trước khi gửi
        console.log('🔄 Đang cập nhật hóa đơn:', updatedInvoice);
        console.log('🔍 Trạng thái cuối cùng:', updatedInvoice.trangThai, 'type:', typeof updatedInvoice.trangThai);
        console.log('🔍 Ngày cập nhật:', updatedInvoice.ngayCapNhat);
        console.log('🔍 Ngày xác nhận:', updatedInvoice.ngayXacNhan);
        
        // Kiểm tra các field bắt buộc
        if (!updatedInvoice.trangThai || updatedInvoice.trangThai < 1 || updatedInvoice.trangThai > 6) {
          throw new Error('Trạng thái không hợp lệ');
        }
        
        const response = await axios.put(`http://localhost:8080/don-hang/update/${updatedInvoice.id}`, updatedInvoice, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Cập nhật thành công:', response.data);
        
        // Refresh danh sách sau khi update
        await this.fetchInvoices();
        
        // Đảm bảo tab hiện tại được refresh
        this.$forceUpdate();
        
        toast.success("Cập nhật hóa đơn thành công!");
        this.closeModal();
      } catch (err) {
        console.error('❌ Error updating invoice:', err);
        console.error('❌ Error response:', err.response?.data);
        console.error('❌ Error status:', err.response?.status);
        
        // Hiển thị thông báo lỗi chi tiết hơn
        let errorMessage = "Lỗi khi cập nhật hóa đơn!";
        if (err.response?.status === 400) {
          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response?.data && typeof err.response.data === 'object') {
            // Xử lý lỗi validation từ backend
            errorMessage = "Dữ liệu không hợp lệ: " + JSON.stringify(err.response.data);
          } else {
            errorMessage = "Không thể chuyển đổi trạng thái này. Vui lòng kiểm tra quy tắc chuyển đổi trạng thái.";
          }
        } else if (err.response?.status === 404) {
          errorMessage = "Không tìm thấy đơn hàng để cập nhật.";
        } else if (err.response?.status === 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = "Lỗi: " + err.message;
        }
        
        toast.error(errorMessage);
      } finally {
        this.isSubmitting = false;
      }
    },

    editInvoice(index) {
      // Validate: Không cho phép chỉnh sửa đơn hàng tại quầy
      const invoice = { ...this.tabInvoices[index] };
      if (invoice.loaiDon === 0) {
        toast.error("Không thể chỉnh sửa đơn hàng tại quầy!");
        return;
      }
      
      this.editIndex = index;
      
      console.log('✏️ Editing invoice:', invoice);
      console.log('📊 Index được truyền:', index);
      console.log('📊 Tab hiện tại:', this.tab);
      console.log('📊 Số lượng tabInvoices:', this.tabInvoices.length);
      console.log('📊 Số lượng filteredInvoices:', this.filteredInvoices.length);
      console.log('📊 Original trangThai:', invoice.originalTrangThai);
      console.log('📊 Current trangThai:', invoice.trangThai);
      
      // Sử dụng originalTrangThai để đảm bảo lấy đúng giá trị gốc từ database
      // Nếu không có originalTrangThai, sử dụng trangThai từ invoice gốc
      const originalTrangThai = invoice.originalTrangThai || invoice.trangThai || 1;
      const displayStatus = this.mapTrangThaiToStatus(originalTrangThai);
      
      console.log('🔍 Debug originalTrangThai:', {
        'invoice.originalTrangThai': invoice.originalTrangThai,
        'invoice.trangThai': invoice.trangThai,
        'final originalTrangThai': originalTrangThai,
        'displayStatus': displayStatus
      });
      
      // Debug đặc biệt cho trạng thái chờ xác nhận
      if (originalTrangThai === 1) {
        console.log('🚨 DEBUG CHỜ XÁC NHẬN:', {
          'originalTrangThai': originalTrangThai,
          'displayStatus': displayStatus,
          'statusLabel': this.statusLabel(displayStatus),
          'invoice.statusLabel': invoice.statusLabel,
          'invoice.maDon': invoice.maDon
        });
      }
      
      // Debug đặc biệt cho trạng thái đã xác nhận
      if (originalTrangThai === 2) {
        console.log('🚨 DEBUG ĐÃ XÁC NHẬN:', {
          'originalTrangThai': originalTrangThai,
          'displayStatus': displayStatus,
          'statusLabel': this.statusLabel(displayStatus),
          'invoice.statusLabel': invoice.statusLabel,
          'invoice.maDon': invoice.maDon
        });
      }
      
      console.log('🔄 Modal hiển thị trạng thái:', displayStatus, 'từ originalTrangThai:', originalTrangThai);
      console.log('🔍 Status mapping check:', {
        originalTrangThai: originalTrangThai,
        mappedStatus: displayStatus,
        statusLabel: this.statusLabel(displayStatus)
      });
      
      // Reset newInvoice về trạng thái ban đầu
      this.newInvoice = {
        khachHangId: 0,
        nhanVienId: 0,
        voucherId: 0,
        diaChiId: 0,
        soDienThoai: "",
        hoTen: "",
        email: "",
        tongTienGoc: 0,
        tienGiam: 0,
        tongTien: 0,
        tienShip: 0,
        ngayXacNhan: "",
        ngayDuKien: "",
        ngayNhan: "",
        loaiDon: 0,
        ghiChu: "",
        maDon: "",
        trangThai: originalTrangThai,
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: "",
        daXoa: 0,
        status: displayStatus, // Set đúng status từ mapping
        originalTrangThai: originalTrangThai
      };
      
      // Copy tất cả thông tin từ invoice gốc
      Object.assign(this.newInvoice, invoice);
      // Ghi đè lại status để đảm bảo đúng
      this.newInvoice.status = displayStatus;
      this.newInvoice.originalTrangThai = originalTrangThai;
      
      // Đảm bảo ngày tạo được format đúng cho input date
      if (this.newInvoice.ngayCapNhat) {
        // Chuyển đổi ngày từ format database sang format YYYY-MM-DD cho input date
        const date = new Date(this.newInvoice.ngayCapNhat);
        if (!isNaN(date.getTime())) {
          this.newInvoice.ngayCapNhat = date.toISOString().split('T')[0];
        }
      }
      
      // Đảm bảo ngày xác nhận được format đúng nếu có
      if (this.newInvoice.ngayXacNhan) {
        const date = new Date(this.newInvoice.ngayXacNhan);
        if (!isNaN(date.getTime())) {
          this.newInvoice.ngayXacNhan = date.toISOString().split('T')[0];
        }
      }
      
      console.log('📋 NewInvoice sau khi set:', {
        id: this.newInvoice.id,
        maDon: this.newInvoice.maDon,
        trangThai: this.newInvoice.trangThai,
        originalTrangThai: this.newInvoice.originalTrangThai,
        status: this.newInvoice.status
      });
      
      // Debug: So sánh trạng thái trong danh sách vs modal
      console.log('🔍 So sánh trạng thái:', {
        'Trong danh sách (statusLabel)': invoice.statusLabel,
        'Trong danh sách (status)': invoice.status,
        'Trong modal (status)': this.newInvoice.status,
        'Trong modal (statusLabel)': this.statusLabel(this.newInvoice.status)
      });
      
      // Debug: Kiểm tra xem có đúng hóa đơn không
      console.log('🔍 Kiểm tra hóa đơn:', {
        'Index được click': index,
        'Mã đơn trong danh sách': invoice.maDon,
        'ID trong danh sách': invoice.id,
        'Mã đơn trong modal': this.newInvoice.maDon,
        'ID trong modal': this.newInvoice.id
      });
      
      this.errors = {
        maDon: "",
        hoTen: "",
        soDienThoai: "",
        email: "",
        loaiDon: "",
        tongTien: "",
        ngayXacNhan: "",
        status: ""
      };
      
      // Force update để đảm bảo UI được refresh
      this.$nextTick(() => {
        this.$forceUpdate();
        console.log('🔄 Force update completed, status should be:', this.newInvoice.status);
      });
      
      this.showModal = true;
    },

    async viewInvoiceDetail(invoice) {
      console.log('🔍 Xem chi tiết hóa đơn:', invoice);
      this.selectedInvoice = { ...invoice };
      this.isLoadingDetail = true;
      
      try {
        console.log('📞 Gọi API chi tiết đơn hàng cho ID:', invoice.id);
        
        // Sử dụng API mới để lấy chi tiết sản phẩm với đầy đủ thông tin
        const response = await axios.get(`http://localhost:8080/chi-tiet-don-hang/don-hang/${invoice.id}`, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('📦 API Response:', response.data);
        
        if (response.data && response.data.success) {
          this.selectedInvoiceProducts = response.data.data || [];
          console.log('✅ Đã tải được', this.selectedInvoiceProducts.length, 'sản phẩm');
          
          if (this.selectedInvoiceProducts.length === 0) {
            console.log('⚠️ Không có sản phẩm nào trong đơn hàng này');
          }
        } else {
          console.log('❌ API trả về lỗi:', response.data);
          this.selectedInvoiceProducts = [];
          toast.error(response.data.message || 'Không thể tải chi tiết sản phẩm');
        }
        
        console.log('📋 Chi tiết sản phẩm cuối cùng:', this.selectedInvoiceProducts);
      } catch (error) {
        console.error('❌ Lỗi khi gọi API chi tiết sản phẩm:', error);
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        this.selectedInvoiceProducts = [];
        
        let errorMessage = 'Không thể tải chi tiết sản phẩm';
        if (error.response?.status === 404) {
          errorMessage = 'Không tìm thấy chi tiết đơn hàng';
        } else if (error.response?.status === 500) {
          errorMessage = 'Lỗi server khi tải chi tiết sản phẩm';
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = 'Không thể kết nối đến server';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast.error(errorMessage);
      } finally {
        this.isLoadingDetail = false;
      }
      
      this.showDetailModal = true;
    },

    getTotalQuantity() {
      return this.selectedInvoiceProducts.reduce((total, product) => {
        return total + (product.soLuong || 0);
      }, 0);
    },

    handleImageError(event) {
      event.target.style.display = 'none';
      event.target.nextElementSibling.style.display = 'flex';
    }
  },
  
  mounted() {
    this.fetchInvoices();
    // Auto-refresh để cập nhật đơn hàng mới từ trangchu - giảm tần suất để tránh jumping
    this.refreshInterval = setInterval(() => {
      // Chỉ auto-refresh khi không có modal đang mở và không có thao tác đang thực hiện
      if (!this.showModal && !this.isSubmitting) {
        console.log('🔄 Auto-refresh admin: Kiểm tra đơn hàng mới...')
        this.fetchInvoices(true) // Truyền flag isAutoRefresh = true
      } else {
        console.log('⏸️ Bỏ qua auto-refresh vì đang có modal mở hoặc đang submit')
      }
    }, 45000) // Tăng lên 45 giây để giảm tần suất hơn nữa
  },
  
  beforeUnmount() {
    // Clear interval khi component unmount
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  }
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content {
  flex: 1;
  padding: 20px;
}

.header {
  background: white;
  padding: 16px 24px;
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.page-title h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
}

.filter-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-title {
  font-weight: 600;
  font-size: 18px;
  color: #374151;
  margin-bottom: 16px;
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-controls input, .filter-controls button {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.filter-controls input {
  min-width: 200px;
}

.filter-controls button {
  background: #6366f1;
  color: white;
  border: 1px solid #6366f1;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.filter-controls button:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

.refresh-btn {
  background: #10b981 !important;
  border-color: #10b981 !important;
}

.refresh-btn:hover {
  background: #059669 !important;
  border-color: #059669 !important;
}

.tab-section {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab {
  padding: 12px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.tab.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.tab-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.tab.active .tab-badge {
  background: rgba(255, 255, 255, 0.3);
}

.table-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8fafc;
}

th, td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

tbody tr:hover {
  background: #f9fafb;
}

.no-data {
  text-align: center;
  padding: 48px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
}

.empty-subtext {
  font-size: 14px;
  opacity: 0.8;
}

.type-badge {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.confirmed {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.shipping {
  background: #e0e7ff;
  color: #3730a3;
}

.status-badge.delivering {
  background: #fce7f3;
  color: #be185d;
}

.status-badge.done {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancel {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn {
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.edit-btn {
  background: #eff6ff;
  color: #2563eb;
}

.edit-btn:hover {
  background: #dbeafe;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fee2e2;
}

.detail-btn {
  background: #f0f9ff;
  color: #0369a1;
}

.detail-btn:hover {
  background: #e0f2fe;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  min-height: 100vh;
  padding: 40px 20px;
  overflow-y: auto;
  transition: opacity 0.3s ease;
}

.form-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 32px;
  max-width: 720px;
  width: 100%;
  margin: auto;
  min-height: 400px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: translateY(0);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2a44;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 15px;
  color: #444;
}

.form-group input,
.form-group select {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  background: #fafafa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  background: #ffffff;
}

.error {
  border-color: #e63946 !important;
}

.error-message {
  margin-top: 6px;
  font-size: 14px;
  color: #e63946;
  font-weight: 500;
}

.actions {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

button {
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #333;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.btn-secondary:disabled {
  background: #f3f4f6;
  color: #999;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-controls input,
  .filter-controls button {
    min-width: 100%;
  }

  .tab-section {
    flex-direction: column;
  }

  .tab {
    justify-content: center;
  }

  .table-section {
    overflow-x: auto;
  }

  table {
    min-width: 800px;
  }

  .modal-overlay {
    padding: 20px 10px;
  }

  .form-card {
    max-width: 95%;
    padding: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .actions button {
    width: 100%;
  }
}

/* Additional utility classes */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.font-bold {
  font-weight: 700;
}

.text-sm {
  font-size: 14px;
}

.text-xs {
  font-size: 12px;
}

.opacity-50 {
  opacity: 0.5;
}

/* Loading animation */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Product info styles */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.product-count,
.product-types {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
}

.product-count i {
  color: #3b82f6;
  font-size: 11px;
}

.product-types i {
  color: #10b981;
  font-size: 11px;
}

/* ✅ STYLE MỚI: Thông báo cho đơn hàng tại quầy */
.counter-order-notice {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  cursor: not-allowed;
}

.counter-order-notice i {
  font-size: 11px;
  color: #9ca3af;
}

/* Detail Modal Styles */
.detail-modal {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 900px;
  width: 100%;
  margin: auto;
  max-height: 90vh;
  overflow-y: auto;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.detail-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.detail-content {
  padding: 32px;
}

.detail-section {
  margin-bottom: 32px;
}

.detail-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.detail-section h3 i {
  color: #6366f1;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #e5e7eb;
}

.detail-item.total {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.detail-item label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-item .value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.detail-item .value.price {
  font-weight: 600;
  color: #059669;
}

.detail-item .value.price.discount {
  color: #dc2626;
}

.detail-item .value.price.total-price {
  font-size: 16px;
  color: #10b981;
}

.detail-item .value.type-badge.offline {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}

.detail-item .value.type-badge.online {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}

.note-content {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #6366f1;
  font-style: italic;
  color: #4b5563;
  line-height: 1.6;
}

.detail-actions {
  padding: 24px 32px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
}

@media (max-width: 768px) {
  .detail-modal {
    max-width: 95%;
    margin: 20px auto;
  }
  
  .detail-header {
    padding: 20px;
  }
  
  .detail-content {
    padding: 24px 20px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-actions {
    padding: 20px;
  }
}

/* Product Display Styles */
.loading-products, .no-products {
  text-align: center;
  padding: 32px;
  color: #6b7280;
  font-style: italic;
}

.loading-products i {
  margin-right: 8px;
  color: #6366f1;
}

.no-products i {
  font-size: 24px;
  margin-bottom: 8px;
  display: block;
  color: #9ca3af;
}

.products-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #0369a1;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-item label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-item .value {
  font-size: 16px;
  font-weight: 600;
  color: #0369a1;
}

.product-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.product-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.product-image {
  position: relative;
  width: 80px;
  height: 80px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #9ca3af;
}

.no-image i {
  font-size: 24px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.product-code {
  font-size: 13px;
  color: #6b7280;
  font-family: 'Courier New', monospace;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.product-details {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.product-brand, .product-material {
  font-size: 12px;
  color: #4b5563;
}

.product-brand {
  font-weight: 500;
}

.product-pricing {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  min-width: 140px;
}

.product-pricing > div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.product-pricing label {
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
}

.product-pricing .value {
  font-size: 14px;
  font-weight: 600;
}

.product-pricing .value.price {
  color: #059669;
}

.product-pricing .value.price.total {
  color: #dc2626;
  font-size: 15px;
}

.quantity .value {
  color: #374151;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 30px;
  text-align: center;
}

@media (max-width: 768px) {
  .product-item {
    grid-template-columns: 60px 1fr;
    gap: 12px;
  }
  
  .product-pricing {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
  }
  
  .product-pricing > div {
    align-items: center;
  }
  
  .product-image {
    width: 60px;
    height: 60px;
  }
  
  .products-summary {
    grid-template-columns: 1fr;
  }
}

</style>
<template>
  <div class="order-tracking-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">
          <i class="icon-truck"></i>
          Theo dõi đơn hàng
        </h1>
        <p class="page-subtitle">Quản lý và theo dõi trạng thái đơn hàng của bạn</p>
      </div>

      <!-- Search Order Section -->
      <div class="search-section">
        <div class="search-box">
          <div class="search-input-group">
            <input 
              type="text" 
              v-model="searchOrderId" 
              placeholder="Nhập mã đơn hàng để tìm kiếm..."
              class="search-input"
              @keyup.enter="searchOrder"
            />
            <button @click="searchOrder" class="search-btn">
              <i class="icon-search"></i>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <!-- Order Status Filter -->
      <div class="filter-section">
        <div class="filter-tabs">
          <button 
            v-for="status in orderStatuses" 
            :key="status.value"
            :class="['filter-tab', { active: selectedStatus === status.value }]"
            @click="filterByStatus(status.value)"
          >
            <i :class="status.icon"></i>
            {{ status.label }}
            <span class="count">({{ getOrderCountByStatus(status.value) }})</span>
          </button>
        </div>
      </div>

      <!-- Orders List -->
      <div class="orders-section">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải danh sách đơn hàng...</p>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="icon-shopping-bag"></i>
          </div>
          <h3>Chưa có đơn hàng nào</h3>
          <p>Bạn chưa có đơn hàng nào. Hãy mua sắm để tạo đơn hàng đầu tiên!</p>
          <router-link to="/products" class="shop-btn">
            <i class="icon-shopping-cart"></i>
            Mua sắm ngay
          </router-link>
        </div>

        <div v-else class="orders-list">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id"
            class="order-card"
            @click="toggleOrderDetail(order.id)"
          >
            <div class="order-header">
              <div class="order-info">
                <h3 class="order-id">Đơn hàng #{{ order.id }}</h3>
                <p class="order-date">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="order-status">
                <span :class="['status-badge', getStatusClass(order.status)]">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
              <div class="order-amount">
                <span class="amount">{{ formatPrice(order.totalAmount) }}</span>
              </div>
            </div>

            <div class="order-summary">
              <div class="summary-item">
                <i class="icon-package"></i>
                <span>{{ order.items.length }} sản phẩm</span>
              </div>
              <div class="summary-item">
                <i class="icon-truck"></i>
                <span>{{ order.shippingMethod }}</span>
              </div>
              <div class="summary-item">
                <i class="icon-location"></i>
                <span>{{ order.shippingAddress }}</span>
              </div>
            </div>

            <!-- Order Details (Collapsible) -->
            <div v-if="expandedOrders.includes(order.id)" class="order-details">
              <div class="details-section">
                <h4>Chi tiết sản phẩm</h4>
                <div class="items-list">
                  <div v-for="item in order.items" :key="item.id" class="item-row">
                    <div class="item-image">
                      <img :src="item.image" :alt="item.name" />
                    </div>
                    <div class="item-info">
                      <h5>{{ item.name }}</h5>
                      <p>Size: {{ item.size }}, Màu: {{ item.color }}</p>
                      <p>Số lượng: {{ item.quantity }}</p>
                    </div>
                    <div class="item-price">
                      {{ formatPrice(item.price * item.quantity) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <h4>Thông tin giao hàng</h4>
                <div class="shipping-info">
                  <p><strong>Người nhận:</strong> {{ order.customerName }}</p>
                  <p><strong>Địa chỉ:</strong> {{ order.shippingAddress }}</p>
                  <p><strong>Số điện thoại:</strong> {{ order.phoneNumber }}</p>
                  <p><strong>Phương thức giao hàng:</strong> {{ order.shippingMethod }}</p>
                </div>
              </div>

              <div class="details-section">
                <h4>Tổng kết đơn hàng</h4>
                <div class="order-summary-details">
                  <div class="summary-row">
                    <span>Tạm tính:</span>
                    <span>{{ formatPrice(order.subtotal) }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>{{ formatPrice(order.shippingFee) }}</span>
                  </div>
                  <div v-if="order.discount > 0" class="summary-row discount">
                    <span>Giảm giá:</span>
                    <span>-{{ formatPrice(order.discount) }}</span>
                  </div>
                  <div class="summary-row total">
                    <span><strong>Tổng cộng:</strong></span>
                    <span><strong>{{ formatPrice(order.totalAmount) }}</strong></span>
                  </div>
                </div>
              </div>

              <!-- Order Actions -->
              <div class="order-actions">
                <button 
                  v-if="order.status === 'pending'" 
                  class="action-btn cancel-btn"
                  @click.stop="confirmCancelOrder(order)"
                >
                  <i class="icon-x"></i>
                  Hủy đơn hàng
                </button>
                <button v-if="order.status === 'delivered'" class="action-btn review-btn">
                  <i class="icon-star"></i>
                  Đánh giá sản phẩm
                </button>
              </div>
            </div>

            <!-- Expand/Collapse Button -->
            <div class="expand-button">
              <i :class="['icon', expandedOrders.includes(order.id) ? 'icon-chevron-up' : 'icon-chevron-down']"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showCancelModal" class="modal-overlay" @click="closeCancelModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận hủy đơn hàng</h3>
          <button class="close-btn" @click="closeCancelModal">
            <i class="icon-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="warning-icon">
            <i class="icon-alert-triangle"></i>
          </div>
          <p>Bạn có chắc chắn muốn hủy đơn hàng <strong>#{{ selectedOrder?.id }}</strong>?</p>
          <p class="warning-text">Hành động này không thể hoàn tác và đơn hàng sẽ được chuyển sang trạng thái "Đã hủy".</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeCancelModal">
            Hủy bỏ
          </button>
          <button class="btn btn-danger" @click="confirmCancel">
            <i class="icon-x"></i>
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'OrderTracking',
  data() {
    return {
      searchOrderId: '',
      selectedStatus: 'all',
      expandedOrders: [],
      showCancelModal: false,
      selectedOrder: null,
      orderStatuses: [
        { value: 'all', label: 'Tất cả', icon: 'icon-list' },
        { value: 'pending', label: 'Chờ xác nhận', icon: 'icon-clock' },
        { value: 'confirmed', label: 'Đã xác nhận', icon: 'icon-check-circle' },
        { value: 'shipping', label: 'Chờ giao', icon: 'icon-truck' },
        { value: 'delivering', label: 'Đang giao', icon: 'icon-truck' },
        { value: 'done', label: 'Hoàn thành', icon: 'icon-package' },
        { value: 'cancelled', label: 'Đã hủy', icon: 'icon-x-circle' }
      ]
    }
  },
  computed: {
    ...mapGetters('orders', ['orders', 'loading']),
    
    filteredOrders() {
      let filtered = this.orders

      // Filter by status
      if (this.selectedStatus !== 'all') {
        filtered = filtered.filter(order => order.status === this.selectedStatus)
      }

      // Filter by search
      if (this.searchOrderId) {
        filtered = filtered.filter(order => 
          order.id.toString().includes(this.searchOrderId)
        )
      }

      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  },
  async mounted() {
    await this.loadOrders()
  },
  methods: {
    ...mapActions('orders', ['loadOrders', 'searchOrderById', 'cancelOrderAction']),

    async searchOrder() {
      if (this.searchOrderId) {
        await this.searchOrderById(this.searchOrderId)
      } else {
        await this.loadOrders()
      }
    },

    filterByStatus(status) {
      this.selectedStatus = status
    },

    toggleOrderDetail(orderId) {
      const index = this.expandedOrders.indexOf(orderId)
      if (index > -1) {
        this.expandedOrders.splice(index, 1)
      } else {
        this.expandedOrders.push(orderId)
      }
    },

    getOrderCountByStatus(status) {
      if (status === 'all') return this.orders.length
      return this.orders.filter(order => order.status === status).length
    },

    getStatusClass(status) {
      const statusClasses = {
        'pending': 'status-pending',
        'confirmed': 'status-confirmed',
        'shipping': 'status-shipping',
        'delivering': 'status-delivering',
        'done': 'status-done',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled'
      }
      return statusClasses[status] || 'status-pending'
    },

    getStatusText(status) {
      const statusTexts = {
        'pending': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'shipping': 'Chờ giao',
        'delivering': 'Đang giao',
        'done': 'Hoàn thành',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
      }
      return statusTexts[status] || 'Chờ xác nhận'
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },

    // Xác nhận hủy đơn hàng
    confirmCancelOrder(order) {
      this.selectedOrder = order
      this.showCancelModal = true
    },

    // Đóng modal hủy đơn hàng
    closeCancelModal() {
      this.showCancelModal = false
      this.selectedOrder = null
    },

    // Xác nhận hủy đơn hàng từ modal
    async confirmCancel() {
      if (this.selectedOrder) {
        await this.cancelOrder(this.selectedOrder)
        this.closeCancelModal()
      }
    },

    // Hủy đơn hàng
    async cancelOrder(order) {
      try {
        await this.cancelOrderAction(order.id)
        alert('Đơn hàng đã được hủy thành công!')
        // Reload danh sách đơn hàng
        await this.loadOrders()
      } catch (error) {
        console.error('Error cancelling order:', error)
        alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.')
      }
    },

  }
}
</script>

<style scoped>
.order-tracking-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.page-title i {
  color: #007bff;
  font-size: 2.2rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.search-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-group {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-btn {
  padding: 15px 25px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-btn:hover {
  background: #0056b3;
}

.filter-section {
  margin-bottom: 30px;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-tab {
  padding: 12px 20px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.filter-tab:hover {
  border-color: #007bff;
  color: #007bff;
}

.filter-tab.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.count {
  font-size: 12px;
  opacity: 0.8;
}

.orders-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 30px;
}

.shop-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 30px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.shop-btn:hover {
  background: #0056b3;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.order-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 20px rgba(0,123,255,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.order-info h3 {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 5px 0;
}

.order-date {
  color: #666;
  margin: 0;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-confirmed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-shipping {
  background: #cce5ff;
  color: #004085;
}

.status-delivered {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-amount {
  font-size: 1.2rem;
  font-weight: 700;
  color: #007bff;
}

.order-summary {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.summary-item i {
  color: #007bff;
}

.expand-button {
  position: absolute;
  top: 25px;
  right: 25px;
  color: #666;
  font-size: 1.2rem;
}

.order-details {
  border-top: 1px solid #e9ecef;
  padding-top: 25px;
  margin-top: 20px;
}

.details-section {
  margin-bottom: 25px;
}

.details-section h4 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info h5 {
  margin: 0 0 5px 0;
  color: #333;
}

.item-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.item-price {
  font-weight: 600;
  color: #007bff;
}

.shipping-info p {
  margin: 0 0 8px 0;
  color: #666;
}

.order-summary-details {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-row.discount {
  color: #28a745;
}

.summary-row.total {
  border-top: 2px solid #e9ecef;
  padding-top: 10px;
  font-size: 1.1rem;
}

.order-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background: #c82333;
}

.review-btn {
  background: #ffc107;
  color: #212529;
}

.review-btn:hover {
  background: #e0a800;
}


@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }

  .search-input-group {
    flex-direction: column;
  }

  .filter-tabs {
    flex-direction: column;
    align-items: stretch;
  }

  .order-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .order-summary {
    flex-direction: column;
    gap: 15px;
  }

  .item-row {
    flex-direction: column;
    text-align: center;
  }

  .order-actions {
    justify-content: center;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-body {
  padding: 25px;
  text-align: center;
}

.warning-icon {
  font-size: 3rem;
  color: #ffc107;
  margin-bottom: 20px;
}

.modal-body p {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.5;
}

.warning-text {
  color: #dc3545 !important;
  font-size: 0.95rem !important;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  gap: 15px;
  padding: 20px 25px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
}
</style>
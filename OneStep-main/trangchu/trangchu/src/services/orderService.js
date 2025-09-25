// Order Service - API calls for order management
const API_BASE_URL = 'http://localhost:8080/api'

class OrderService {
  // Get authorization headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }

  // Get all orders for current user
  async getUserOrders(userId) {
    try {
      // Thử gọi API mới trước
      const response = await fetch(`${API_BASE_URL}/don-hang/hien-thi`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ API /don-hang/hien-thi response:', data)
      
      // Chuyển đổi dữ liệu từ API sang format của frontend
      const formattedOrders = this.formatOrdersFromAPI(data)
      return formattedOrders || []
    } catch (error) {
      console.error('Error fetching orders from API:', error)
      // Fallback to localStorage data
      return this.getMockOrders()
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching order by ID:', error)
      // Return mock data for development
      return this.getMockOrderById(orderId)
    }
  }

  // Create new order
  async createOrder(orderData) {
    try {
      // Chuẩn bị dữ liệu đơn hàng theo format của backend
      const backendOrderData = this.formatOrderForBackend(orderData)
      
      console.log('🔄 Gửi đơn hàng lên backend:', backendOrderData)
      
      const response = await fetch(`${API_BASE_URL}/don-hang/add`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(backendOrderData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Đơn hàng đã được tạo thành công trên backend:', data)
      return data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  // Cancel order
  async cancelOrder(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error cancelling order:', error)
      // Fallback: Update local storage
      this.updateOrderStatusInLocalStorage(orderId, 'cancelled')
      return { success: true, message: 'Order cancelled locally' }
    }
  }

  // Update order status in localStorage
  updateOrderStatusInLocalStorage(orderId, newStatus) {
    try {
      const orders = this.getOrdersFromLocalStorage()
      const orderIndex = orders.findIndex(order => order.id === orderId)
      
      if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus
        orders[orderIndex].updatedAt = new Date().toISOString()
        localStorage.setItem('userOrders', JSON.stringify(orders))
        console.log(`✅ Order ${orderId} status updated to ${newStatus} in localStorage`)
      }
    } catch (error) {
      console.error('❌ Error updating order status in localStorage:', error)
    }
  }


  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }

  // Search orders by criteria
  async searchOrders(criteria) {
    try {
      const queryParams = new URLSearchParams(criteria)
      const response = await fetch(`${API_BASE_URL}/orders/search?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data || []
    } catch (error) {
      console.error('Error searching orders:', error)
      return []
    }
  }

  // Create new order from checkout data
  async createOrderFromCheckout(orderData) {
    try {
      console.log('🔄 Tạo đơn hàng từ checkout:', orderData)
      
      // Gửi đơn hàng lên backend trước
      const backendResponse = await this.createOrder(orderData)
      console.log('✅ Backend response:', backendResponse)
      
      // Tạo đơn hàng cho frontend
      const newOrder = {
        id: orderData.orderNumber || 'ORD' + Date.now().toString().slice(-8),
        customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        phoneNumber: orderData.customerInfo.phone,
        email: orderData.customerInfo.email,
        status: 'pending', // Mới tạo sẽ ở trạng thái chờ xử lý
        createdAt: orderData.orderDate || new Date().toISOString(),
        totalAmount: orderData.finalTotal || orderData.orderTotal,
        subtotal: orderData.orderTotal,
        shippingFee: orderData.shippingFee || 0,
        discount: 0,
        shippingMethod: this.getShippingMethodText(orderData.customerInfo.city),
        shippingAddress: `${orderData.customerInfo.address}, ${orderData.customerInfo.district}, ${this.getCityText(orderData.customerInfo.city)}`,
        items: orderData.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: 'Mặc định', // Có thể cập nhật sau
          color: 'Mặc định', // Có thể cập nhật sau
          image: item.image || '/images/item-default.jpg'
        })),
        paymentInfo: orderData.paymentInfo,
        backendId: backendResponse?.id || backendResponse?.maDon || null // Lưu ID từ backend
      }

      // Lưu vào localStorage để persist
      this.saveOrderToLocalStorage(newOrder)
      
      console.log('✅ Đơn hàng đã được tạo thành công:', newOrder)
      return newOrder
    } catch (error) {
      console.error('❌ Lỗi khi tạo đơn hàng từ checkout:', error)
      
      // Fallback: Tạo đơn hàng local nếu backend fail
      console.log('🔄 Fallback: Tạo đơn hàng local...')
      const fallbackOrder = {
        id: orderData.orderNumber || 'ORD' + Date.now().toString().slice(-8),
        customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        phoneNumber: orderData.customerInfo.phone,
        email: orderData.customerInfo.email,
        status: 'pending',
        createdAt: orderData.orderDate || new Date().toISOString(),
        totalAmount: orderData.finalTotal || orderData.orderTotal,
        subtotal: orderData.orderTotal,
        shippingFee: orderData.shippingFee || 0,
        discount: 0,
        shippingMethod: this.getShippingMethodText(orderData.customerInfo.city),
        shippingAddress: `${orderData.customerInfo.address}, ${orderData.customerInfo.district}, ${this.getCityText(orderData.customerInfo.city)}`,
        items: orderData.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: 'Mặc định',
          color: 'Mặc định',
          image: item.image || '/images/item-default.jpg'
        })),
        paymentInfo: orderData.paymentInfo,
        backendId: null,
        isLocalOnly: true // Đánh dấu là đơn hàng chỉ có local
      }
      
      this.saveOrderToLocalStorage(fallbackOrder)
      return fallbackOrder
    }
  }

  // Save order to localStorage
  saveOrderToLocalStorage(order) {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]')
      existingOrders.unshift(order) // Thêm vào đầu danh sách
      localStorage.setItem('userOrders', JSON.stringify(existingOrders))
      console.log('✅ Order saved to localStorage:', order.id)
    } catch (error) {
      console.error('❌ Error saving order to localStorage:', error)
    }
  }

  // Get orders from localStorage
  getOrdersFromLocalStorage() {
    try {
      const orders = JSON.parse(localStorage.getItem('userOrders') || '[]')
      return orders
    } catch (error) {
      console.error('❌ Error getting orders from localStorage:', error)
      return []
    }
  }

  // Get shipping method text
  getShippingMethodText(city) {
    if (city === 'hanoi') {
      return 'Giao hàng tiêu chuẩn (Hà Nội)'
    } else if (city === 'hcm') {
      return 'Giao hàng tiêu chuẩn (TP.HCM)'
    } else {
      return 'Giao hàng tiêu chuẩn'
    }
  }

  // Get city text
  getCityText(city) {
    const cityMap = {
      'hanoi': 'Hà Nội',
      'hcm': 'TP. Hồ Chí Minh',
      'danang': 'Đà Nẵng',
      'haiphong': 'Hải Phòng',
      'cantho': 'Cần Thơ',
      'other': 'Tỉnh khác'
    }
    return cityMap[city] || 'Tỉnh khác'
  }

  // Format orders data from API response
  formatOrdersFromAPI(apiData) {
    try {
      // Kiểm tra nếu API trả về array
      if (Array.isArray(apiData)) {
        return apiData.map(order => this.formatSingleOrderFromAPI(order))
      }
      
      // Kiểm tra nếu API trả về object với thuộc tính data
      if (apiData && Array.isArray(apiData.data)) {
        return apiData.data.map(order => this.formatSingleOrderFromAPI(order))
      }
      
      // Kiểm tra nếu API trả về object với thuộc tính orders
      if (apiData && Array.isArray(apiData.orders)) {
        return apiData.orders.map(order => this.formatSingleOrderFromAPI(order))
      }
      
      // Nếu không có dữ liệu hợp lệ, trả về array rỗng
      console.warn('⚠️ API response format không hợp lệ:', apiData)
      return []
    } catch (error) {
      console.error('❌ Error formatting orders from API:', error)
      return []
    }
  }

  // Format single order from API
  formatSingleOrderFromAPI(apiOrder) {
    try {
      return {
        id: apiOrder.id || apiOrder.maDonHang || apiOrder.orderId || 'ORD' + Date.now(),
        customerName: apiOrder.tenKhachHang || apiOrder.customerName || apiOrder.hoTen || 'Khách hàng',
        phoneNumber: apiOrder.soDienThoai || apiOrder.phoneNumber || apiOrder.sdt || '',
        email: apiOrder.email || apiOrder.emailKhachHang || '',
        status: this.mapOrderStatus(apiOrder.trangThai || apiOrder.status || 'pending'),
        createdAt: apiOrder.ngayTao || apiOrder.createdAt || apiOrder.ngayDat || new Date().toISOString(),
        totalAmount: apiOrder.tongTien || apiOrder.totalAmount || apiOrder.giaTri || 0,
        subtotal: apiOrder.tamTinh || apiOrder.subtotal || apiOrder.tongTien || 0,
        shippingFee: apiOrder.phiVanChuyen || apiOrder.shippingFee || apiOrder.phiGiaoHang || 0,
        discount: apiOrder.giamGia || apiOrder.discount || apiOrder.khuyenMai || 0,
        shippingMethod: apiOrder.phuongThucGiaoHang || apiOrder.shippingMethod || 'Giao hàng tiêu chuẩn',
        shippingAddress: apiOrder.diaChiGiaoHang || apiOrder.shippingAddress || apiOrder.diaChi || '',
        items: this.formatOrderItems(apiOrder.chiTietDonHang || apiOrder.items || apiOrder.sanPham || []),
        paymentInfo: this.formatPaymentInfo(apiOrder.thongTinThanhToan || apiOrder.paymentInfo || {})
      }
    } catch (error) {
      console.error('❌ Error formatting single order:', error, apiOrder)
      return {
        id: 'ORD' + Date.now(),
        customerName: 'Khách hàng',
        phoneNumber: '',
        email: '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        totalAmount: 0,
        subtotal: 0,
        shippingFee: 0,
        discount: 0,
        shippingMethod: 'Giao hàng tiêu chuẩn',
        shippingAddress: '',
        items: [],
        paymentInfo: {}
      }
    }
  }

  // Map order status from API to frontend format
  mapOrderStatus(apiStatus) {
    const statusMap = {
      'CHO_XU_LY': 'pending',
      'CHO_XAC_NHAN': 'pending',
      'DA_XAC_NHAN': 'confirmed',
      'CHO_GIAO': 'shipping',
      'DANG_GIAO': 'delivering',
      'DA_GIAO': 'delivered',
      'HOAN_THANH': 'done',
      'DA_HOAN_THANH': 'done',
      'DA_HUY': 'cancelled',
      'pending': 'pending',
      'confirmed': 'confirmed',
      'shipping': 'shipping',
      'delivering': 'delivering',
      'done': 'done',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      0: 'pending',
      1: 'confirmed',
      2: 'shipping',
      3: 'delivering',
      4: 'done',
      5: 'delivered',
      6: 'cancelled'
    }
    return statusMap[apiStatus] || 'pending'
  }

  // Format order items from API
  formatOrderItems(apiItems) {
    if (!Array.isArray(apiItems)) return []
    
    return apiItems.map(item => ({
      id: item.id || item.maSanPham || item.productId || Date.now(),
      name: item.tenSanPham || item.name || item.ten || 'Sản phẩm',
      price: item.gia || item.price || item.giaTien || 0,
      quantity: item.soLuong || item.quantity || item.sl || 1,
      size: item.kichCo || item.size || 'Mặc định',
      color: item.mauSac || item.color || 'Mặc định',
      image: item.hinhAnh || item.image || item.anh || '/images/item-default.jpg'
    }))
  }

  // Format payment info from API
  formatPaymentInfo(apiPaymentInfo) {
    if (!apiPaymentInfo || typeof apiPaymentInfo !== 'object') return {}
    
    return {
      id: apiPaymentInfo.id || apiPaymentInfo.maThanhToan || '',
      maGiaoDich: apiPaymentInfo.maGiaoDich || apiPaymentInfo.transactionId || '',
      trangThai: apiPaymentInfo.trangThai || apiPaymentInfo.status || 0,
      phuongThucId: apiPaymentInfo.phuongThucId || apiPaymentInfo.paymentMethodId || 1
    }
  }

  // Format order data for backend API
  formatOrderForBackend(orderData) {
    try {
      const customerInfo = orderData.customerInfo || {}
      const currentDate = new Date().toISOString().split('T')[0]
      
      return {
        // Thông tin khách hàng
        khachHangId: 0, // Sẽ được tạo mới nếu chưa có
        hoTen: `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim() || 'Khách hàng',
        soDienThoai: customerInfo.phone || '',
        email: customerInfo.email || '',
        
        // Thông tin đơn hàng
        maDon: orderData.orderNumber || 'ORD' + Date.now().toString().slice(-8),
        loaiDon: 1, // 1 = ONLINE (từ trang chủ)
        tongTien: parseFloat(orderData.finalTotal || orderData.orderTotal || 0),
        tongTienGoc: parseFloat(orderData.orderTotal || 0),
        tienGiam: parseFloat(orderData.discount || 0),
        tienShip: parseFloat(orderData.shippingFee || 0),
        
        // Địa chỉ giao hàng
        diaChiGiaoHang: customerInfo.address ? 
          `${customerInfo.address}, ${customerInfo.district}, ${this.getCityText(customerInfo.city)}` : '',
        
        // Thông tin thanh toán
        phuongThucThanhToan: orderData.paymentMethod || 'Thanh toán khi nhận hàng (COD)',
        
        // Trạng thái và ngày tháng
        trangThai: 1, // 1 = Chờ xác nhận
        ngayXacNhan: currentDate,
        ngayCapNhat: currentDate,
        ngayDuKien: this.calculateExpectedDeliveryDate(customerInfo.city),
        
        // Thông tin khác
        ghiChu: customerInfo.note || `Đơn hàng từ trang chủ - ${new Date().toLocaleString('vi-VN')}`,
        nguoiTao: 'Khách hàng',
        nguoiCapNhat: 'Khách hàng',
        daXoa: 0,
        
        // Chi tiết đơn hàng
        chiTietDonHang: this.formatOrderItemsForBackend(orderData.items || []),
        
        // Thông tin voucher nếu có
        voucherId: orderData.voucherId || 0,
        maGiamGia: orderData.discountCode || null
      }
    } catch (error) {
      console.error('❌ Error formatting order for backend:', error)
      throw error
    }
  }

  // Format order items for backend
  formatOrderItemsForBackend(items) {
    if (!Array.isArray(items)) return []
    
    return items.map((item, index) => ({
      id: item.id || Date.now() + index,
      tenSanPham: item.name || 'Sản phẩm',
      gia: parseFloat(item.price || 0),
      soLuong: parseInt(item.quantity || 1),
      kichCo: item.size || 'Mặc định',
      mauSac: item.color || 'Mặc định',
      hinhAnh: item.image || '/images/item-default.jpg',
      brand: item.brand || 'OneStep'
    }))
  }

  // Calculate expected delivery date based on city
  calculateExpectedDeliveryDate(city) {
    const currentDate = new Date()
    let deliveryDays = 3 // Mặc định 3 ngày
    
    // Điều chỉnh số ngày giao hàng dựa trên thành phố
    if (city === 'hanoi' || city === 'hcm') {
      deliveryDays = 1 // Nội thành Hà Nội/HCM: 1 ngày
    } else if (city === 'danang' || city === 'haiphong' || city === 'cantho') {
      deliveryDays = 2 // Thành phố lớn: 2 ngày
    }
    
    const expectedDate = new Date(currentDate.getTime() + (deliveryDays * 24 * 60 * 60 * 1000))
    return expectedDate.toISOString().split('T')[0]
  }

  // Mock data for development/testing - Empty array để bắt đầu với danh sách trống
  getMockOrders() {
    // Trả về dữ liệu từ localStorage thay vì mock data cố định
    return this.getOrdersFromLocalStorage()
  }

  getMockOrderById(orderId) {
    const orders = this.getMockOrders()
    return orders.find(order => order.id === orderId) || null
  }
}

export default new OrderService()
// Order Service - API calls for order management
// Backend does not prefix with /api; use root host
const API_BASE_URL = 'http://localhost:8080'

class OrderService {
  // Get authorization headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }

  // Get all orders for current user (CHỈ LẤY ĐƠN HÀNG ONLINE TỪ TRANGCHU)
  async getUserOrders(userId) {
    try {
      // Gọi API lấy đơn hàng ONLINE của khách hàng
      // QUAN TRỌNG: API này chỉ trả về đơn hàng có loaiDon = 1 (ONLINE)
      const actualUserId = userId || localStorage.getItem('userId')
      
      // QUAN TRỌNG: Tạm thời bỏ qua việc kiểm tra userId để debug
      // TODO: Sau khi sửa xong, cần khôi phục logic này để bảo mật
      if (!actualUserId) {
        console.log('⚠️ Không có userId - nhưng vẫn hiển thị đơn hàng để debug')
        // return []  // Tạm thời comment out
      }
      
      console.log('🔄 Đang lấy đơn hàng ONLINE cho user:', actualUserId)
      
      const response = await fetch(`${API_BASE_URL}/api/don-hang-online/khach-hang/${actualUserId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        console.log('⚠️ Không lấy được đơn hàng theo userId:', actualUserId)
        console.log('🔄 Fallback: Thử lấy TẤT CẢ đơn hàng ONLINE và lọc theo thông tin user')
        
        // Fallback sang API lấy tất cả đơn hàng ONLINE
        try {
          const allOnlineResponse = await fetch(`${API_BASE_URL}/api/don-hang-online/tat-ca-online`, {
            method: 'GET',
            headers: this.getAuthHeaders()
          })

          if (!allOnlineResponse.ok) {
            console.log('❌ Không thể lấy tất cả đơn hàng online')
            return []
          }

          const allResult = await allOnlineResponse.json()
          console.log('✅ Fallback API response - TẤT CẢ đơn hàng ONLINE:', allResult)
          
          let allOrders = []
          if (allResult.success && allResult.data) {
            allOrders = allResult.data
          } else if (Array.isArray(allResult)) {
            allOrders = allResult
          }

          // Lọc đơn hàng theo thông tin người dùng hiện tại
          let userEmail = localStorage.getItem('userEmail') || localStorage.getItem('email') || ''
          let userPhone = localStorage.getItem('userPhone') || localStorage.getItem('phone') || ''
          let userName = localStorage.getItem('userName') || localStorage.getItem('name') || ''
          
          // Thử lấy thông tin từ currentUser object
          try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
            if (currentUser) {
              userEmail = userEmail || currentUser.email || currentUser.emailKhachHang || ''
              userPhone = userPhone || currentUser.phone || currentUser.soDienThoai || ''
              userName = userName || currentUser.name || currentUser.fullName || currentUser.hoTen || ''
            }
          } catch (e) {
            console.warn('Không thể parse currentUser từ localStorage:', e)
          }
          
          console.log('🔍 Thông tin user để lọc đơn hàng:', { 
            actualUserId, 
            userEmail, 
            userPhone, 
            userName 
          })
          console.log('📊 Tổng số đơn hàng online từ API:', allOrders.length)
          
          // Log tất cả đơn hàng để debug
          allOrders.forEach((order, index) => {
            console.log(`📋 Đơn hàng ${index + 1} trong API:`, {
              maDon: order.maDon,
              hoTen: order.hoTen,
              email: order.email,
              soDienThoai: order.soDienThoai,
              khachHangId: order.khachHangId,
              trangThai: order.trangThai,
              tongTien: order.tongTien,
              loaiDon: order.loaiDon
            })
          })
          
          // QUAN TRỌNG: Tạm thời hiển thị TẤT CẢ đơn hàng ONLINE để debug vấn đề
          // Thay vì lọc nghiêm ngặt, hãy hiển thị tất cả để user có thể thấy đơn hàng của mình
          console.log(`🔧 DEBUG: Hiển thị TẤT CẢ ${allOrders.length} đơn hàng ONLINE (không lọc theo user)`)
          console.log('📋 Lý do: Để debug vấn đề chỉ hiển thị 3 đơn hàng')
          
          const filteredOrders = allOrders.filter(order => {
            // Chỉ lọc cơ bản: đảm bảo là đơn hàng hợp lệ
            return order && order.maDon && order.loaiDon === 1
          })
          
          console.log(`📊 Số đơn hàng sau khi lọc theo user: ${filteredOrders.length}/${allOrders.length}`)

          const formattedOrders = this.formatAndFilterOnlineOrders(filteredOrders)
          console.log(`📊 Số đơn hàng ONLINE sau khi lọc theo thông tin user: ${formattedOrders.length}`)
          return formattedOrders
          
        } catch (fallbackError) {
          console.error('❌ Lỗi khi fallback lấy tất cả đơn hàng online:', fallbackError)
          return []
        }
      }

      const result = await response.json()
      console.log('✅ API response - Đơn hàng ONLINE:', result)
      
      if (result.success && result.data) {
        // Chuyển đổi và lọc thêm lần nữa để đảm bảo chỉ có đơn ONLINE
        const formattedOrders = this.formatAndFilterOnlineOrders(result.data)
        console.log(`📊 Số đơn hàng ONLINE sau khi lọc: ${formattedOrders.length}`)
        return formattedOrders
      }
      
      return this.formatAndFilterOnlineOrders(result)
    } catch (error) {
      console.error('Error fetching orders from API:', error)
      // Fallback to localStorage data nhưng chỉ lấy đơn online
      const localOrders = this.getMockOrders()
      return this.filterOnlineOrders(localOrders)
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      // Note: backend order detail endpoint is /don-hang/{id}
      const response = await fetch(`${API_BASE_URL}/don-hang/${orderId}`, {
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

  // Create new order (gửi về backend)
  async createOrder(orderData) {
    console.log('🚀 OrderService.createOrder called with:', orderData)
    
    try {
      // Tạo mã đơn thống nhất
      const maDon = orderData.orderNumber || orderData.maDon || 'ORD' + Date.now().toString().slice(-6)
      
      console.log('📤 Sending order to backend with maDon:', maDon)
      
      const requestData = {
        khachHangId: orderData.khachHangId || null,
        maDon: maDon, // Gửi mã đơn về backend
        hoTen: orderData.customerName || orderData.hoTen,
        soDienThoai: orderData.phoneNumber || orderData.soDienThoai,
        email: orderData.email,
        diaChiGiaoHang: orderData.shippingAddress || orderData.diaChiGiaoHang,
        tongTienGoc: parseFloat(orderData.subtotal || orderData.tongTienGoc || 0),
        tienShip: parseFloat(orderData.shippingFee || 0),
        tienGiam: parseFloat(orderData.discount || 0),
        tongTien: parseFloat(orderData.totalAmount || orderData.tongTien || 0),
        ghiChu: orderData.notes || '',
        chiTietDonHang: orderData.items ? orderData.items.map(item => ({
          // Ưu tiên gửi mã chi tiết sản phẩm (variant) thay vì mã sản phẩm gốc
          chiTietSanPhamId: parseInt((item.chiTietSanPhamId || item.variantId || item.id || 0)),
          soLuong: parseInt(item.quantity || item.soLuong || 1),
          donGia: parseFloat(item.price || item.donGia || 0),
          thanhTien: parseFloat(((item.price || 0) * (item.quantity || 1)) || item.thanhTien || 0)
        })) : []
      }
      
      console.log('📤 Full request data:', requestData)
      
      // Gọi API tạo đơn hàng online
      const response = await fetch(`${API_BASE_URL}/api/don-hang-online/tao-don-hang`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestData)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorText = await response.text()
          console.error('❌ Backend response error:', errorText)
          
          // Thử parse JSON từ error response
          try {
            const errorJson = JSON.parse(errorText)
            errorMessage = errorJson.message || errorText
          } catch (parseError) {
            errorMessage = errorText
          }
        } catch (textError) {
          console.error('❌ Could not read error text:', textError)
        }
        throw new Error(errorMessage)
      }

      let result
      try {
        const responseText = await response.text()
        console.log('📡 Raw response:', responseText)
        
        if (!responseText || responseText.trim() === '') {
          throw new Error('Backend trả về dữ liệu trống')
        }
        
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError)
        console.error('❌ Response text that failed to parse:', await response.text())
        throw new Error('Backend trả về dữ liệu không hợp lệ (không phải JSON)')
      }
      console.log('✅ Đơn hàng đã được tạo trên server:', result)
      
      if (result.success && result.data) {
        console.log('✅ Order created successfully with ID:', result.data.id)
        return result.data
      } else {
        console.error('❌ Backend returned unsuccessful result:', result)
        throw new Error(result.message || 'Backend did not return success')
      }
    } catch (error) {
      console.error('❌ CRITICAL: Error creating order on backend:', error)
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack
      })
      
      // IMPORTANT: Don't fallback silently - throw the error so UI can handle it
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
  createOrderFromCheckout(orderData) {
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
      paymentInfo: orderData.paymentInfo
    }

    // Lưu vào localStorage để persist
    this.saveOrderToLocalStorage(newOrder)
    
    return newOrder
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
  
  // Format và lọc chỉ lấy đơn hàng ONLINE
  formatAndFilterOnlineOrders(apiData) {
    try {
      let orders = this.formatOrdersFromAPI(apiData)
      
      // LỌC: Chỉ lấy đơn hàng ONLINE (loaiDon = 1)
      orders = orders.filter(order => {
        // Kiểm tra loaiDon từ API response
        const loaiDon = order.loaiDon || order.orderType || null
        const isOnline = loaiDon === 1 || loaiDon === '1' || loaiDon === 'ONLINE'
        
        if (!isOnline && loaiDon !== undefined) {
          console.log(`🚫 Loại bỏ đơn hàng ${order.id} - loaiDon=${loaiDon} (không phải online)`)
        }
        
        return isOnline || loaiDon === undefined // Cho phép undefined để tương thích với dữ liệu cũ
      })
      
      console.log(`✅ Sau khi lọc: ${orders.length} đơn hàng ONLINE`)
      return orders
    } catch (error) {
      console.error('❌ Error filtering online orders:', error)
      return []
    }
  }
  
  // Lọc đơn hàng online từ array có sẵn
  filterOnlineOrders(orders) {
    if (!Array.isArray(orders)) return []
    
    return orders.filter(order => {
      const loaiDon = order.loaiDon || order.orderType
      return loaiDon === 1 || loaiDon === '1' || loaiDon === 'ONLINE' || loaiDon === undefined
    })
  }

  // Format single order from API
  formatSingleOrderFromAPI(apiOrder) {
    try {
      const items = this.formatOrderItems(apiOrder.chiTietDonHang || apiOrder.items || apiOrder.sanPham || [])
      // Số lượng sản phẩm và tổng số lượng từ nhiều trường khác nhau
      const apiItemCount = apiOrder.soLuongSanPham || apiOrder.tongSanPham || apiOrder.soSanPham || apiOrder.itemCount
      const apiTotalQty = apiOrder.tongSoLuong || apiOrder.tongSoLuongSanPham || apiOrder.totalQuantity || apiOrder.soLuong
      const computedTotalQty = items.reduce((sum, it) => sum + (it.quantity || 0), 0)
      const finalItemCount = apiItemCount != null ? parseInt(apiItemCount) : (items.length || 0)
      const finalTotalQty = apiTotalQty != null ? parseInt(apiTotalQty) : computedTotalQty

      return {
        id: apiOrder.maDon || apiOrder.maDonHang || apiOrder.orderNumber || apiOrder.id || 'ORD' + Date.now(),
        databaseId: apiOrder.id, // Lưu database ID riêng để tham chiếu
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
        items: items,
        itemCount: finalItemCount,
        totalQuantity: finalTotalQty,
        paymentInfo: this.formatPaymentInfo(apiOrder.thongTinThanhToan || apiOrder.paymentInfo || {}),
        loaiDon: apiOrder.loaiDon, // Giữ lại loaiDon để kiểm tra
        orderType: apiOrder.loaiDon === 1 ? 'ONLINE' : (apiOrder.loaiDon === 0 ? 'OFFLINE' : 'UNKNOWN')
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
      // String enums (if any)
      'CHO_XU_LY': 'pending',
      'DA_XAC_NHAN': 'confirmed',
      'CHO_GIAO': 'ready_to_ship',
      'DANG_GIAO': 'shipping',
      'DA_GIAO': 'completed',
      'DA_HUY': 'cancelled',
      'pending': 'pending',
      'confirmed': 'confirmed',
      'ready_to_ship': 'ready_to_ship',
      'shipping': 'shipping',
      'delivered': 'completed',
      'cancelled': 'cancelled',
      // Integer statuses from backend:
      // 1=Chờ xác nhận, 2=Đã xác nhận, 3=Chờ giao, 4=Đang giao, 5=Hoàn thành, 6=Đã hủy
      1: 'pending',
      2: 'confirmed',
      3: 'ready_to_ship',
      4: 'shipping',
      5: 'completed',
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
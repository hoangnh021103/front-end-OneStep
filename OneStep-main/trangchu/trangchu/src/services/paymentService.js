import axios from 'axios'

class PaymentService {
  constructor() {
    this.baseURL = '/thanh-toan'
  }

  /**
   * Tạo thanh toán cho đơn hàng với khách hàng cụ thể
   * @param {number} hoaDonId - ID hóa đơn
   * @param {number} khachHangId - ID khách hàng
   * @param {Object} paymentData - Dữ liệu thanh toán
   * @returns {Promise<Object>} Kết quả thanh toán
   */
  async createPayment(hoaDonId, khachHangId, paymentData) {
    try {
      console.log(`🔄 Tạo thanh toán cho hóa đơn ${hoaDonId}, khách hàng ${khachHangId}`)
      
      const response = await axios.post(
        `${this.baseURL}/${hoaDonId}/chon-khach-hang/${khachHangId}`,
        paymentData
      )
      
      console.log('✅ Tạo thanh toán thành công:', response.data)
      return this.normalizePayment(response.data)
    } catch (error) {
      console.error('❌ Lỗi tạo thanh toán:', error)
      throw new Error('Không thể tạo thanh toán')
    }
  }

  /**
   * Lấy thông tin thanh toán theo ID
   * @param {number} paymentId - ID thanh toán
   * @returns {Promise<Object>} Thông tin thanh toán
   */
  async getPaymentById(paymentId) {
    try {
      const response = await axios.get(`${this.baseURL}/${paymentId}`)
      return this.normalizePayment(response.data)
    } catch (error) {
      console.error('Error fetching payment:', error)
      throw new Error('Không thể tải thông tin thanh toán')
    }
  }

  /**
   * Lấy danh sách thanh toán theo đơn hàng
   * @param {number} donHangId - ID đơn hàng
   * @returns {Promise<Array>} Danh sách thanh toán
   */
  async getPaymentsByOrder(donHangId) {
    try {
      const response = await axios.get(`${this.baseURL}/don-hang/${donHangId}`)
      return response.data.map(payment => this.normalizePayment(payment))
    } catch (error) {
      console.error('Error fetching payments by order:', error)
      throw new Error('Không thể tải danh sách thanh toán')
    }
  }

  /**
   * Cập nhật trạng thái thanh toán
   * @param {number} paymentId - ID thanh toán
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updatePayment(paymentId, updateData) {
    try {
      const response = await axios.put(`${this.baseURL}/${paymentId}`, updateData)
      return this.normalizePayment(response.data)
    } catch (error) {
      console.error('Error updating payment:', error)
      throw new Error('Không thể cập nhật thanh toán')
    }
  }

  /**
   * Hủy thanh toán
   * @param {number} paymentId - ID thanh toán
   * @returns {Promise<Object>} Kết quả hủy
   */
  async cancelPayment(paymentId) {
    try {
      const response = await axios.delete(`${this.baseURL}/${paymentId}`)
      return response.data
    } catch (error) {
      console.error('Error cancelling payment:', error)
      throw new Error('Không thể hủy thanh toán')
    }
  }

  /**
   * Lấy danh sách phương thức thanh toán
   * @returns {Promise<Array>} Danh sách phương thức thanh toán
   */
  async getPaymentMethods() {
    try {
      const response = await axios.get('/phuong-thuc-thanh-toan/hien-thi')
      return response.data.map(method => this.normalizePaymentMethod(method))
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      // Fallback về danh sách phương thức mặc định
      return this.getDefaultPaymentMethods()
    }
  }

  /**
   * Chuẩn hóa dữ liệu thanh toán từ API
   * @param {Object} payment - Dữ liệu thanh toán thô từ API
   * @returns {Object} Dữ liệu thanh toán đã chuẩn hóa
   */
  normalizePayment(payment) {
    return {
      id: payment.id || 0,
      donHangId: payment.donHangId || 0,
      phuongThucId: payment.phuongThucId || 0,
      maGiaoDich: payment.maGiaoDich || '',
      tongTien: payment.tongTien || 0,
      moTa: payment.moTa || '',
      trangThai: payment.trangThai || 0,
      ngayCapNhat: payment.ngayCapNhat || new Date().toISOString().split('T')[0],
      nguoiTao: payment.nguoiTao || '',
      nguoiCapNhat: payment.nguoiCapNhat || '',
      daXoa: payment.daXoa || 0,
      // Thông tin bổ sung
      trangThaiText: this.getPaymentStatusText(payment.trangThai || 0),
      phuongThucText: this.getPaymentMethodText(payment.phuongThucId || 0),
      formattedTongTien: this.formatPrice(payment.tongTien || 0),
      isActive: (payment.daXoa || 0) === 0
    }
  }

  /**
   * Chuẩn hóa dữ liệu phương thức thanh toán
   * @param {Object} method - Dữ liệu phương thức thô từ API
   * @returns {Object} Dữ liệu phương thức đã chuẩn hóa
   */
  normalizePaymentMethod(method) {
    return {
      id: method.id || 0,
      ten: method.ten || method.name || '',
      moTa: method.moTa || method.description || '',
      icon: method.icon || this.getDefaultPaymentIcon(method.id || 0),
      isActive: method.trangThai !== 0,
      phiDichVu: method.phiDichVu || 0
    }
  }

  /**
   * Lấy danh sách phương thức thanh toán mặc định
   * @returns {Array} Danh sách phương thức mặc định
   */
  getDefaultPaymentMethods() {
    return [
      {
        id: 1,
        ten: 'Thanh toán khi nhận hàng (COD)',
        moTa: 'Thanh toán bằng tiền mặt khi nhận hàng',
        icon: 'cash_icon.png',
        isActive: true,
        phiDichVu: 0
      },
      {
        id: 2,
        ten: 'VietQR',
        moTa: 'Thanh toán qua VietQR',
        icon: 'vietqr.png',
        isActive: true,
        phiDichVu: 0
      }
    ]
  }

  /**
   * Lấy icon mặc định cho phương thức thanh toán
   * @param {number} methodId - ID phương thức
   * @returns {string} Đường dẫn icon
   */
  getDefaultPaymentIcon(methodId) {
    const iconMap = {
      1: 'cash_icon.png',
      2: 'vietqr.png'
    }
    return iconMap[methodId] || 'cash_icon.png'
  }

  /**
   * Lấy text trạng thái thanh toán
   * @param {number} status - Mã trạng thái
   * @returns {string} Text trạng thái
   */
  getPaymentStatusText(status) {
    const statusMap = {
      0: 'Chờ thanh toán',
      1: 'Đã thanh toán',
      2: 'Thanh toán thất bại',
      3: 'Đã hủy',
      4: 'Hoàn tiền'
    }
    return statusMap[status] || 'Không xác định'
  }

  /**
   * Lấy text phương thức thanh toán
   * @param {number} methodId - ID phương thức
   * @returns {string} Text phương thức
   */
  getPaymentMethodText(methodId) {
    const methodMap = {
      1: 'COD',
      2: 'VietQR'
    }
    return methodMap[methodId] || 'Không xác định'
  }

  /**
   * Format giá tiền
   * @param {number} price - Giá tiền
   * @returns {string} Giá đã format
   */
  formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  /**
   * Tạo mã giao dịch duy nhất
   * @returns {string} Mã giao dịch
   */
  generateTransactionCode() {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    return `TXN_${timestamp}_${random}`.toUpperCase()
  }

  /**
   * Validate dữ liệu thanh toán trước khi gửi
   * @param {Object} paymentData - Dữ liệu thanh toán
   * @returns {Object} Kết quả validation
   */
  validatePaymentData(paymentData) {
    const errors = []

    if (!paymentData.donHangId || paymentData.donHangId <= 0) {
      errors.push('ID đơn hàng không hợp lệ')
    }

    if (!paymentData.phuongThucId || paymentData.phuongThucId <= 0) {
      errors.push('Phương thức thanh toán không hợp lệ')
    }

    if (!paymentData.tongTien || paymentData.tongTien <= 0) {
      errors.push('Tổng tiền phải lớn hơn 0')
    }

    if (!paymentData.maGiaoDich || paymentData.maGiaoDich.trim() === '') {
      errors.push('Mã giao dịch không được để trống')
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    }
  }
}

export default new PaymentService()
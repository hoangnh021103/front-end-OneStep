import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const thanhToanApi = {
  /**
   * Lấy tất cả hóa đơn
   * @returns {Promise} - Promise chứa danh sách hóa đơn
   */
  hienThi: async () => {
    try {
      const response = await axios.get(`${API_URL}/thanh-toan/hien-thi`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hóa đơn:', error);
      throw error;
    }
  },

  /**
   * Lấy hóa đơn phân trang
   * @param {number} page - Số trang (mặc định = 0)
   * @returns {Promise} - Promise chứa danh sách hóa đơn theo trang
   */
  phanTrang: async (page = 0) => {
    try {
      const response = await axios.get(`${API_URL}/thanh-toan/phan-trang`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy hóa đơn phân trang:', error);
      throw error;
    }
  },

  /**
   * Tạo hóa đơn mới
   * @param {Object} hoaDon - Thông tin hóa đơn
   * @returns {Promise} - Promise chứa hóa đơn vừa tạo
   */
  taoHoaDon: async (hoaDon) => {
    try {
      console.log('🛒 Gửi dữ liệu thanh toán:', hoaDon);
      const response = await axios.post(`${API_URL}/thanh-toan/ban-hang-tai-quay`, hoaDon);
      console.log('✅ Thanh toán thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi khi tạo hóa đơn:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      // Tạo error message chi tiết hơn
      const errorMsg = error.response?.data?.message || 
                      error.response?.data || 
                      error.message || 
                      'Lỗi không xác định';
      
      throw new Error(errorMsg);
    }
  },

  /**
   * Thêm thanh toán
   * @param {Object} thanhToan - Thông tin thanh toán
   * @returns {Promise} - Promise chứa kết quả thanh toán
   */
  themThanhToan: async (thanhToan) => {
    try {
      const response = await axios.post(`${API_URL}/thanh-toan/add`, thanhToan);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm thanh toán:', error);
      throw error;
    }
  },

  /**
   * Cập nhật thanh toán
   * @param {number} id - ID thanh toán
   * @param {Object} thanhToan - Thông tin thanh toán cần cập nhật
   * @returns {Promise} - Promise chứa kết quả cập nhật
   */
  capNhatThanhToan: async (id, thanhToan) => {
    try {
      const response = await axios.put(`${API_URL}/thanh-toan/update/${id}`, thanhToan);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật thanh toán ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa thanh toán
   * @param {number} id - ID thanh toán
   * @returns {Promise} - Promise chứa kết quả xóa
   */
  xoaThanhToan: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/thanh-toan/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa thanh toán ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thông tin thanh toán theo ID
   * @param {number} id - ID thanh toán
   * @returns {Promise} - Promise chứa thông tin thanh toán
   */
  layTheoId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/thanh-toan/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thanh toán ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Chọn khách hàng cho hóa đơn
   * @param {number} hoaDonId - ID hóa đơn
   * @param {number} khachHangId - ID khách hàng
   * @returns {Promise} - Promise chứa kết quả cập nhật
   */
  chonKhachHang: async (hoaDonId, khachHangId) => {
    try {
      const response = await axios.put(`${API_URL}/thanh-toan/${hoaDonId}/chon-khach-hang/${khachHangId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi chọn khách hàng cho hóa đơn ${hoaDonId}:`, error);
      throw error;
    }
  },

  /**
   * Hủy hóa đơn
   * @param {number} hoaDonId - ID hóa đơn
   * @returns {Promise} - Promise chứa kết quả hủy
   */
  huyHoaDon: async (hoaDonId) => {
    try {
      const response = await axios.put(`${API_URL}/thanh-toan/${hoaDonId}/huy`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi hủy hóa đơn ${hoaDonId}:`, error);
      throw error;
    }
  },

  /**
   * Áp dụng mã giảm giá
   * @param {number} hoaDonId - ID hóa đơn
   * @param {string} code - Mã giảm giá
   * @returns {Promise} - Promise chứa kết quả áp dụng
   */
  apDungGiamGia: async (hoaDonId, code) => {
    try {
      const response = await axios.put(`${API_URL}/thanh-toan/${hoaDonId}/apply-discount`, null, {
        params: { code }
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi áp dụng mã giảm giá ${code}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách sản phẩm cho bán hàng
   * @returns {Promise} - Promise chứa danh sách sản phẩm
   */
  layDanhSachSanPham: async () => {
    try {
      const response = await axios.get(`${API_URL}/thanh-toan/san-pham`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách chi tiết sản phẩm (có kích thước, màu sắc) - API mới cho bán hàng
   * @returns {Promise} - Promise chứa danh sách chi tiết sản phẩm
   */
  layChiTietSanPham: async () => {
    try {
      console.log('🚀 Gọi API:', `${API_URL}/thanh-toan/san-pham`);
      const response = await axios.get(`${API_URL}/thanh-toan/san-pham`);
      console.log('📡 Response status:', response.status);
      console.log('📡 Response data:', response.data);
      
      if (!response.data) {
        throw new Error('API trả về dữ liệu null');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi khi lấy chi tiết sản phẩm:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      // Fallback API cũ nếu API mới lỗi
      try {
        console.log('🔄 Thử fallback API...');
        const fallbackResponse = await axios.get(`${API_URL}/chi-tiet-san-pham/hien-thi`);
        console.log('📡 Fallback response:', fallbackResponse.data);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('❌ Lỗi fallback:', fallbackError);
        throw error;
      }
    }
  },

  /**
   * Lấy chi tiết sản phẩm theo ID sản phẩm
   * @param {number} sanPhamId - ID sản phẩm
   * @returns {Promise} - Promise chứa chi tiết sản phẩm
   */
  layChiTietTheoSanPham: async (sanPhamId) => {
    try {
      const response = await axios.get(`${API_URL}/chi-tiet-san-pham/hien-thi-theo-san-pham/${sanPhamId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy chi tiết sản phẩm ${sanPhamId}:`, error);
      throw error;
    }
  },

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {Object} chiTietGioHang - Thông tin chi tiết giỏ hàng
   * @returns {Promise} - Promise chứa kết quả thêm vào giỏ
   */
  themVaoGioHang: async (chiTietGioHang) => {
    try {
      const response = await axios.post(`${API_URL}/chi-tiet-gio-hang/add`, chiTietGioHang);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      throw error;
    }
  },

  /**
   * Cập nhật số lượng trong giỏ hàng
   * @param {number} id - ID chi tiết giỏ hàng
   * @param {Object} chiTiet - Thông tin cập nhật
   * @returns {Promise} - Promise chứa kết quả cập nhật
   */
  capNhatGioHang: async (id, chiTiet) => {
    try {
      const response = await axios.put(`${API_URL}/chi-tiet-gio-hang/update/${id}`, chiTiet);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật giỏ hàng ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * @param {number} id - ID chi tiết giỏ hàng
   * @returns {Promise} - Promise chứa kết quả xóa
   */
  xoaKhoiGioHang: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/chi-tiet-gio-hang/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa khỏi giỏ hàng ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy giỏ hàng theo user hoặc session
   * @param {number} userId - ID người dùng (tùy chọn)
   * @returns {Promise} - Promise chứa giỏ hàng
   */
  layGioHang: async (userId) => {
    try {
      const url = userId 
        ? `${API_URL}/gio-hang/user/${userId}`
        : `${API_URL}/gio-hang/hien-thi`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      throw error;
    }
  },

  /**
   * Tìm kiếm sản phẩm
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} - Promise chứa kết quả tìm kiếm
   */
  timKiemSanPham: async (keyword) => {
    try {
      const response = await axios.get(`${API_URL}/thanh-toan/san-pham/search`, {
        params: { keyword }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      // Fallback: tìm trong danh sách tất cả sản phẩm
      try {
        const allProducts = await thanhToanApi.layChiTietSanPham();
        return allProducts.filter(product => 
          product.tenSanPham?.toLowerCase().includes(keyword.toLowerCase()) ||
          product.maSanPham?.toLowerCase().includes(keyword.toLowerCase())
        );
      } catch (fallbackError) {
        console.error('Lỗi fallback tìm kiếm:', fallbackError);
        return [];
      }
    }
  }
};

export default thanhToanApi;

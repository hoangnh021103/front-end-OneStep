import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const donHangApi = {
  /**
   * Lấy tất cả đơn hàng
   * @returns {Promise} - Promise chứa danh sách đơn hàng
   */
  hienThi: async () => {
    try {
      const response = await axios.get(`${API_URL}/don-hang/hien-thi`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      throw error;
    }
  },

  /**
   * Lấy đơn hàng phân trang
   * @param {number} page - Số trang (mặc định = 0)
   * @returns {Promise} - Promise chứa danh sách đơn hàng theo trang
   */
  phanTrang: async (page = 0) => {
    try {
      const response = await axios.get(`${API_URL}/don-hang/phan-trang`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng phân trang:', error);
      throw error;
    }
  },

  /**
   * Tạo đơn hàng mới
   * @param {Object} donHang - Thông tin đơn hàng
   * @returns {Promise} - Promise chứa đơn hàng vừa tạo
   */
  taoDonHang: async (donHang) => {
    try {
      const response = await axios.post(`${API_URL}/don-hang/add`, donHang);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      throw error;
    }
  },

  /**
   * Cập nhật đơn hàng
   * @param {number} id - ID đơn hàng
   * @param {Object} donHang - Thông tin đơn hàng cần cập nhật
   * @returns {Promise} - Promise chứa kết quả cập nhật
   */
  capNhatDonHang: async (id, donHang) => {
    try {
      const response = await axios.put(`${API_URL}/don-hang/update/${id}`, donHang);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật đơn hàng ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng
   * @param {number} id - ID đơn hàng
   * @param {number} trangThai - Trạng thái mới
   * @returns {Promise} - Promise chứa kết quả cập nhật
   */
  capNhatTrangThai: async (id, trangThai) => {
    try {
      const response = await axios.put(`${API_URL}/don-hang/update-status/${id}`, null, {
        params: { trangThai }
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái đơn hàng ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa đơn hàng
   * @param {number} id - ID đơn hàng
   * @returns {Promise} - Promise chứa kết quả xóa
   */
  xoaDonHang: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/don-hang/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa đơn hàng ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thông tin đơn hàng theo ID
   * @param {number} id - ID đơn hàng
   * @returns {Promise} - Promise chứa thông tin đơn hàng
   */
  layTheoId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/don-hang/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy đơn hàng ID ${id}:`, error);
      throw error;
    }
  }
};

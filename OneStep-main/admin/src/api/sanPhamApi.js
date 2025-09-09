import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const sanPhamApi = {
  /**
   * Thêm sản phẩm mới
   * @param {Object} sanPham - Thông tin sản phẩm
   * @param {string} sanPham.tenSanPham - Tên sản phẩm
   * @param {string} sanPham.moTa - Mô tả sản phẩm
   * @param {string} sanPham.duongDanAnh - Đường dẫn ảnh sản phẩm
   * @param {number} sanPham.trangThai - Trạng thái sản phẩm (1: Còn hàng, 0: Hết hàng)
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  themSanPham: async (sanPham) => {
    try {
      const response = await axios.post(`${API_URL}/san-pham/add`, sanPham);
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data || error?.message || 'Không xác định';
      console.error('Lỗi khi thêm sản phẩm:', errorMsg, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách sản phẩm
   * @returns {Promise} - Promise chứa danh sách sản phẩm
   */
  layDanhSachSanPham: async () => {
    try {
      const response = await axios.get(`${API_URL}/san-pham/hien-thi`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết sản phẩm
   * @param {number} id - ID của sản phẩm
   * @returns {Promise} - Promise chứa thông tin chi tiết sản phẩm
   */
  layChiTietSanPham: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/san-pham/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin sản phẩm ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin sản phẩm
   * @param {number} id - ID của sản phẩm
   * @param {Object} sanPham - Thông tin sản phẩm cần cập nhật
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  capNhatSanPham: async (id, sanPham) => {
    try {
      const response = await axios.put(`${API_URL}/san-pham/${id}`, sanPham);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật sản phẩm ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa sản phẩm
   * @param {number} id - ID của sản phẩm
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  xoaSanPham: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/san-pham/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa sản phẩm ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tải lên ảnh sản phẩm
   * @param {File} file - File ảnh cần tải lên
   * @returns {Promise} - Promise chứa đường dẫn ảnh sau khi tải lên
   */
  taiAnhSanPham: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải ảnh sản phẩm:', error);
      throw error;
    }
  }
};

export default sanPhamApi;
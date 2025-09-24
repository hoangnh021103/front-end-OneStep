import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const voucherApi = {
  /**
   * Lấy tất cả voucher
   * @returns {Promise} - Promise chứa danh sách voucher
   */
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/voucher/hien-thi`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách voucher:', error);
      throw error;
    }
  },

  /**
   * Lấy voucher phân trang
   * @param {number} page - Số trang (mặc định = 0)
   * @returns {Promise} - Promise chứa danh sách voucher theo trang
   */
  phanTrang: async (page = 0) => {
    try {
      const response = await axios.get(`${API_URL}/voucher/phan-trang`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy voucher phân trang:', error);
      throw error;
    }
  },

  /**
   * Validate voucher theo mã
   * @param {string} ma - Mã voucher
   * @returns {Promise} - Promise chứa kết quả validation
   */
  validate: async (ma) => {
    try {
      const response = await axios.get(`${API_URL}/voucher/validate/${ma}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi validate voucher:', error);
      throw error;
    }
  },

  /**
   * Sử dụng voucher (trừ số lượng)
   * @param {string} ma - Mã voucher
   * @returns {Promise} - Promise chứa kết quả sử dụng
   */
  use: async (ma) => {
    try {
      const response = await axios.post(`${API_URL}/voucher/use/${ma}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi sử dụng voucher:', error);
      throw error;
    }
  },

  /**
   * Thêm voucher mới
   * @param {Object} voucher - Thông tin voucher
   * @returns {Promise} - Promise chứa voucher vừa tạo
   */
  add: async (voucher) => {
    try {
      const formData = new FormData();
      Object.keys(voucher).forEach(key => {
        if (voucher[key] !== null && voucher[key] !== undefined) {
          formData.append(key, voucher[key]);
        }
      });

      const response = await axios.post(`${API_URL}/voucher/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm voucher:', error);
      throw error;
    }
  },

  /**
   * Cập nhật voucher
   * @param {number} id - ID voucher
   * @param {Object} voucher - Thông tin voucher cập nhật
   * @returns {Promise} - Promise chứa voucher đã cập nhật
   */
  update: async (id, voucher) => {
    try {
      const formData = new FormData();
      Object.keys(voucher).forEach(key => {
        if (voucher[key] !== null && voucher[key] !== undefined) {
          formData.append(key, voucher[key]);
        }
      });

      const response = await axios.put(`${API_URL}/voucher/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật voucher:', error);
      throw error;
    }
  },

  /**
   * Xóa voucher
   * @param {number} id - ID voucher
   * @returns {Promise} - Promise chứa kết quả xóa
   */
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/voucher/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa voucher:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết voucher theo ID
   * @param {number} id - ID voucher
   * @returns {Promise} - Promise chứa thông tin voucher
   */
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/voucher/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết voucher:', error);
      throw error;
    }
  }
};


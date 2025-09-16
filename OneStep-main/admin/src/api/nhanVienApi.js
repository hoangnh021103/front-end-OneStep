import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const nhanVienApi = {
  /**
   * Thêm nhân viên mới
   * @param {Object} nhanVien - Thông tin nhân viên
   * @param {string} nhanVien.hoTen - Họ và tên nhân viên
   * @param {string} nhanVien.ngaySinh - Ngày sinh (YYYY-MM-DD)
   * @param {string} nhanVien.gioiTinh - Giới tính (Nam/Nữ/Khác)
   * @param {string} nhanVien.email - Email nhân viên
   * @param {string} nhanVien.soDienThoai - Số điện thoại
   * @param {string} nhanVien.diaChi - Địa chỉ
   * @param {string} nhanVien.urlAnh - URL ảnh đại diện
   * @param {number} nhanVien.vaiTroId - ID vai trò (1: Quản lý, 2: Nhân viên, 3: Thực tập sinh)
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  themNhanVien: async (nhanVien) => {
    try {
      const response = await axios.post(`${API_URL}/nhan-vien/add`, nhanVien);
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data || error?.message || 'Không xác định';
      console.error('Lỗi khi thêm nhân viên:', errorMsg, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách nhân viên
   * @returns {Promise} - Promise chứa danh sách nhân viên
   */
  layDanhSachNhanVien: async () => {
    try {
      const response = await axios.get(`${API_URL}/nhan-vien/hien-thi`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết nhân viên
   * @param {number} id - ID của nhân viên
   * @returns {Promise} - Promise chứa thông tin chi tiết nhân viên
   */
  layChiTietNhanVien: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/nhan-vien/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin nhân viên ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin nhân viên
   * @param {number} id - ID của nhân viên
   * @param {Object} nhanVien - Thông tin nhân viên cần cập nhật
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  capNhatNhanVien: async (id, nhanVien) => {
    try {
      const response = await axios.put(`${API_URL}/nhan-vien/${id}`, nhanVien);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật nhân viên ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa nhân viên
   * @param {number} id - ID của nhân viên
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  xoaNhanVien: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/nhan-vien/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa nhân viên ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tải lên ảnh nhân viên
   * @param {File} file - File ảnh cần tải lên
   * @returns {Promise} - Promise chứa đường dẫn ảnh sau khi tải lên
   */
  taiAnhNhanVien: async (file) => {
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
      console.error('Lỗi khi tải ảnh nhân viên:', error);
      throw error;
    }
  }
};

export default nhanVienApi;

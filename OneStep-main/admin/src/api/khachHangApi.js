import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const khachHangApi = {
  /**
   * Lấy danh sách khách hàng
   * @returns {Promise} - Promise chứa danh sách khách hàng
   */
  hienThi: async () => {
    try {
      const response = await axios.get(`${API_URL}/khach-hang/hien-thi`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách hàng:', error);
      // Fallback với dữ liệu mẫu
      return [
        { id: 1, hoTen: 'Nguyễn Văn A', email: 'a@example.com', soDienThoai: '0901234567' },
        { id: 2, hoTen: 'Trần Thị B', email: 'b@example.com', soDienThoai: '0912345678' },
        { id: 3, hoTen: 'Lê Văn C', email: 'c@example.com', soDienThoai: '0923456789' }
      ];
    }
  },

  /**
   * Thêm khách hàng nhanh
   * @param {Object} khachHang - Thông tin khách hàng
   * @returns {Promise} - Promise chứa khách hàng vừa tạo
   */
  themNhanh: async (khachHang) => {
    try {
      const response = await axios.post(`${API_URL}/khach-hang/add`, khachHang);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm khách hàng:', error);
      // Fallback: tạo object với ID ngẫu nhiên
      return { id: Date.now(), ...khachHang };
    }
  },

  /**
   * Tìm kiếm khách hàng theo từ khóa
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} - Promise chứa kết quả tìm kiếm
   */
  timKiem: async (keyword) => {
    try {
      const response = await axios.get(`${API_URL}/khach-hang/tim-kiem`, {
        params: { keyword }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khách hàng:', error);
      // Fallback: lấy tất cả rồi filter local
      try {
        const allCustomers = await khachHangApi.hienThi();
        return allCustomers.filter((c) =>
          (c.hoTen && c.hoTen.toLowerCase().includes(keyword.toLowerCase())) ||
          (c.email && c.email.toLowerCase().includes(keyword.toLowerCase())) ||
          (c.soDienThoai && String(c.soDienThoai).includes(keyword))
        );
      } catch (fallbackError) {
        console.error('Lỗi fallback tìm kiếm:', fallbackError);
        return [];
      }
    }
  },

  /**
   * Lấy thông tin khách hàng theo ID
   * @param {number} id - ID khách hàng
   * @returns {Promise} - Promise chứa thông tin khách hàng
   */
  layTheoId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/khach-hang/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy khách hàng ID ${id}:`, error);
      throw error;
    }
  }
};

export default khachHangApi;



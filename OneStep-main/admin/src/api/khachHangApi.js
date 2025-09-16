// Lightweight customer API with safe fallbacks
// Tries real backend via VITE_API_URL if available; otherwise returns mock data

import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const BASE_URL = import.meta?.env?.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/khach-hang` : '';

const mockCustomers = [
  { id: 1, hoTen: 'Nguyễn Văn A', email: 'a@example.com', soDienThoai: '0901234567' },
  { id: 2, hoTen: 'Trần Thị B', email: 'b@example.com', soDienThoai: '0912345678' },
  { id: 3, hoTen: 'Lê C', email: 'c@example.com', soDienThoai: '0923456789' }
];

async function hienThi() {
  try {
    if (!BASE_URL) return [...mockCustomers];
    const data = await fetchWrapper.get(`${BASE_URL}`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [...mockCustomers];
  }
}

async function themNhanh(payload) {
  try {
    if (!BASE_URL) {
      return { id: Date.now(), ...payload };
    }
    const created = await fetchWrapper.post(`${BASE_URL}`, payload);
    return created;
  } catch (e) {
    return { id: Date.now(), ...payload };
  }
}

export default { hienThi, themNhanh };



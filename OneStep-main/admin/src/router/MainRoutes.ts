const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true,
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/bang-dieu-khien/default/DefaultDashboard.vue'),
    },
    {
      name: 'Default',
      path: '/dashboard/default',
      component: () => import('@/views/bang-dieu-khien/default/DefaultDashboard.vue'),
    },
    {
      name: 'QuanLyHoaDon',
      path: '/quan-ly/hoa-don',
      component: () => import('@/views/quan-ly/hoa-don/DanhSachHoaDon.vue'),
    },
    {
      name: 'SanPham',
      path: '/quan-ly/san-pham/san-pham',
      component: () => import('@/views/quan-ly/san-pham/SanPham.vue'),
    },
    {
      name: 'ThemSanPham',
      path: '/quan-ly/san-pham/san-pham/them/',
      component: () => import('@/views/quan-ly/san-pham/ThemSanPham.vue'),
    },
    {
      name: 'SuaSanPham',
      path: '/quan-ly/san-pham/san-pham/them/:id',
      component: () => import('@/views/quan-ly/san-pham/ThemSanPham.vue'),
    },
    {
      name: 'SanPhamChiTiet',
      path: '/quan-ly/san-pham/chi-tiet/:id?',
      component: () => import('@/views/quan-ly/san-pham/SanPhamChiTiet.vue'),
    },
    {
      name: 'SuaChiTietSanPham',
      path: '/quan-ly/san-pham/chi-tiet-san-pham/sua/:id',
      component: () => import('@/views/quan-ly/san-pham/ThemSanPhamChiTiet.vue'),
    },
    {
      name: 'ThemChiTietSanPham',
      path: '/quan-ly/san-pham/chi-tiet-san-pham/them',
      component: () => import('@/views/quan-ly/san-pham/ThemSanPhamChiTiet.vue'),
    },
    {
      name: 'MauSac',
      path: '/quan-ly/san-pham/mau-sac',
      component: () => import('@/views/quan-ly/san-pham/MauSac.vue'),
    },
    {
      name: 'ChatLieu',
      path: '/quan-ly/san-pham/chat-lieu',
      component: () => import('@/views/quan-ly/san-pham/ChatLieu.vue'),
    },
    {
      name: 'LoaiDe',
      path: '/quan-ly/san-pham/loai-de',
      component: () => import('@/views/quan-ly/san-pham/LoaiDe.vue'),
    },
    {
      name: 'KichThuoc',
      path: '/quan-ly/san-pham/kich-thuoc',
      component: () => import('@/views/quan-ly/san-pham/KichThuoc.vue'),
    },
    {
      name: 'ThuongHieu',
      path: '/quan-ly/san-pham/thuong-hieu',
      component: () => import('@/views/quan-ly/san-pham/ThuongHieu.vue'),
    },
    {
      name: 'QuanLyNhanVien',
      path: '/quan-ly/nhan-vien',
      component: () => import('@/views/quan-ly/nhan-vien/NhanVien.vue'),
    },
    {
      name: 'QuanLyKhachHang',
      path: '/quan-ly/khach-hang',
      component: () => import('@/views/quan-ly/khach-hang/KhachHang.vue'),
    },
    {
      name: 'PhieuGiamGia',
      path: '/quan-ly/phieu-giam-gia',
      component: () => import('@/views/quan-ly/phieu-giam-gia/PhieuGiamGia.vue'),
    },
    {
      name: 'ThemPhieuGiamGia',
      path: '/quan-ly/phieu-giam-gia/them',
      component: () => import('@/views/quan-ly/phieu-giam-gia/ThemPhieuGiamGia.vue'),
    },
    {
      name: 'SuaPhieuGiamGia',
      path: '/quan-ly/phieu-giam-gia/sua/:id',
      component: () => import('@/views/quan-ly/phieu-giam-gia/ThemPhieuGiamGia.vue'),
    },
    {
      name: 'QuanLyDotGiamGia',
      path: '/quan-ly/dot-giam-gia',
      component: () => import('@/views/quan-ly/dot-giam-gia/DotGiamGia.vue'),
    },

  ],
};

export default MainRoutes;
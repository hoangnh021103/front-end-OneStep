const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/bang-dieu-khien/default/DefaultDashboard.vue')
    },
    {
      name: 'Default',
      path: '/dashboard/default',
      component: () => import('@/views/bang-dieu-khien/default/DefaultDashboard.vue')
    },
    
    {
      name: 'QuanLyHoaDon',
      path: '/quan-ly/hoa-don',
      component: () => import('@/views/quan-ly/hoa-don/DanhSachHoaDon.vue')
    },
    {
      name: 'SanPham',
      path: '/quan-ly/san-pham/san-pham',
      component: () => import('@/views/quan-ly/san-pham/SanPham.vue')
    },
    {
      name: 'ThemSanPham',
      path: '/quan-ly/san-pham/san-pham/them',
      component: () => import('@/views/quan-ly/san-pham/ThemSanPham.vue')
    },
    {
      name: 'MauSac',
      path: '/quan-ly/san-pham/mau-sac',
      component: () => import('@/views/quan-ly/san-pham/MauSac.vue')
    },
    {
      name: 'ChatLieu',
      path: '/quan-ly/san-pham/chat-lieu',
      component: () => import('@/views/quan-ly/san-pham/ChatLieu.vue')
    },
    {
      name: 'LoaiDe',
      path: '/quan-ly/san-pham/loai-de',
      component: () => import('@/views/quan-ly/san-pham/LoaiDe.vue')
    },
    {
      name: 'KichThuoc',
      path: '/quan-ly/san-pham/kich-thuoc',
      component: () => import('@/views/quan-ly/san-pham/KichThuoc.vue')
    },
    {
      name: 'ThuongHieu',
      path: '/quan-ly/san-pham/thuong-hieu',
      component: () => import('@/views/quan-ly/san-pham/ThuongHieu.vue')
    },
    {
      name: 'QuanLyNhanVien',
      path: '/quan-ly/nhan-vien',
      component: () => import('@/views/quan-ly/nhan-vien/NhanVien.vue')
    },
    {
      name: 'QuanLyKhachHang',
      path: '/quan-ly/khach-hang',
      component: () => import('@/views/quan-ly/khach-hang/KhachHang.vue')
    },
    {
      name: 'QuanLyPhieuGiamGia',
      path: '/quan-ly/phieu-giam-gia',
      component: () => import('@/views/quan-ly/phieu-giam-gia/PhieuGiamGia.vue')
    },
    {
      name: 'QuanLyDotGiamGia',
      path: '/quan-ly/dot-giam-gia',
      component: () => import('@/views/quan-ly/dot-giam-gia/DotGiamGia.vue')
    },
  ]
};

export default MainRoutes;

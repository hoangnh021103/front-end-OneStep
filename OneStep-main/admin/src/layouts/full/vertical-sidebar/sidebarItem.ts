// @ts-ignore
import {
  CircleIcon,
  WindmillIcon,
  TypographyIcon,
  ShadowIcon,
  PaletteIcon,
  KeyIcon,
  BugIcon,
  DashboardIcon,
  BrandChromeIcon,
  HelpIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Bảng Điều Khiển' },
  {
    title: 'Mặc Định',
    icon: DashboardIcon,
    to: '/dashboard/default'
  },
  // Nhóm Quản Lý mới thêm vào
  { header: 'Quản Lý' },
  {
    title: 'Bán Hàng',
    icon: CircleIcon,
    to: '/quan-ly/ban-hang'
  },
  {
    title: 'Quản lý Hóa đơn',
    icon: CircleIcon,
    to: '/quan-ly/hoa-don'
  },
  {
    title: 'Quản lý sản phẩm',
    icon: CircleIcon,
    children: [
      {
        title: 'Sản phẩm',
        icon: CircleIcon,
        to: '/quan-ly/san-pham/san-pham'
      },
      {
        title: 'Màu sắc',
        icon: CircleIcon,
        to: '/quan-ly/san-pham/mau-sac'
      },
      {
        title: 'Chất liệu',
        icon: CircleIcon,
        to: '/quan-ly/san-pham/chat-lieu'
      },
      {
        title: 'Loại đế',
        icon: CircleIcon,
        to: '/quan-ly/san-pham/loai-de'
      },
      {
        title: 'Danh mục',
        icon: CircleIcon,
        to: '/quan-ly/san-pham/danh-muc'
      },
      // Thêm mới
      {
        title: 'Kích thước',
        icon: CircleIcon,
        to: '/quan-ly/san-pham/kich-thuoc'
      },
      {
        title: 'Thương hiệu',
        icon: CircleIcon,
        to: '/quan-ly/san-pham/thuong-hieu'
      }
    ]
  },
  {
    title: 'Quản lý khách hàng',
    icon: CircleIcon,
    to: '/quan-ly/khach-hang'
  },
  {
    title: 'Quản lý nhân viên',
    icon: CircleIcon,
    to: '/quan-ly/nhan-vien'
  },
  {
    title: 'Quản lý đợt giảm giá',
    icon: CircleIcon,
    to: '/quan-ly/dot-giam-gia'
  },
  {
    title: 'Quản lý phiếu giảm giá',
    icon: CircleIcon,
    to: '/quan-ly/phieu-giam-gia'
  },
  { divider: true },
  { header: 'Trang' },
  {
    title: 'Xác Thực',
    icon: KeyIcon,
    to: '/auth',
    children: [
      {
        title: 'Đăng Nhập',
        icon: CircleIcon,
        to: '/login1'
      },
      {
        title: 'Đăng Ký',
        icon: CircleIcon,
        to: '/register'
      }
    ]
  },
  {
    title: 'Lỗi 404',
    icon: BugIcon,
    to: '/error'
  },
  { divider: true },
  { header: 'Tiện Ích' },
  {
    title: 'Kiểu Chữ',
    icon: TypographyIcon,
    to: '/utils/typography'
  },
  {
    title: 'Bóng Đổ',
    icon: ShadowIcon,
    to: '/utils/shadows'
  },
  {
    title: 'Màu Sắc',
    icon: PaletteIcon,
    to: '/utils/colors'
  },

  {
    title: 'Biểu Tượng',
    icon: WindmillIcon,
    to: '/forms/radio',
    children: [
      {
        title: 'Biểu Tượng Tabler',
        icon: CircleIcon,
        to: '/icons/tabler'
      },
      {
        title: 'Biểu Tượng Material',
        icon: CircleIcon,
        to: '/icons/material'
      }
    ]
  },
  { divider: true },
  {
    title: 'Trang Mẫu',
    icon: BrandChromeIcon,
    to: '/starter'
  },
  {
    title: 'Tài Liệu',
    icon: HelpIcon,
    to: 'https://codedthemes.gitbook.io/berry-vuetify/',
    type: 'external'
  }
];

export default sidebarItem;

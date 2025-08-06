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

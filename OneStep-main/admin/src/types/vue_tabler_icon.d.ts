import { VNodeChild } from 'vue';

declare module '@vue/runtime-dom' {
  export interface HTMLAttributes {
    $children?: VNodeChild;
  }
  export interface SVGAttributes {
    $children?: VNodeChild;
    strokeWidth?: string | number;
  }
}

declare module 'vue-tabler-icons' {
  import { DefineComponent } from 'vue';
  
  // Export all icon components as any to avoid listing each one
  export const CircleIcon: any;
  export const WindmillIcon: any;
  export const TypographyIcon: any;
  export const ShadowIcon: any;
  export const PaletteIcon: any;
  export const KeyIcon: any;
  export const BugIcon: any;
  export const DashboardIcon: any;
  export const BrandChromeIcon: any;
  export const HelpIcon: any;
  export const ArchiveIcon: any;
  export const CopyIcon: any;
  export const DownloadIcon: any;
  export const FileExportIcon: any;
  export const ArrowDownLeftCircleIcon: any;
  export const ShoppingCartIcon: any;
  export const CircleArrowDownLeftIcon: any;
  export const ChevronUpIcon: any;
  export const ChevronDownIcon: any;
  export const DotsIcon: any;
  export const ChevronRightIcon: any;
  export const TableIcon: any;
  export const BuildingStoreIcon: any;
  export const BellIcon: any;
  export const SettingsIcon: any;
  export const SearchIcon: any;
  export const Menu2Icon: any;
  export const CircleArrowUpRightIcon: any;
}

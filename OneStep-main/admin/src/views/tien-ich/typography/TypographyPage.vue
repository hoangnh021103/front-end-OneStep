<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import UiChildCard from '@/components/shared/UiChildCard.vue';

const page = ref({ title: 'Trang Kiểu Chữ' });
const headings = ref([
  ['Tiêu Đề 1', 'text-h1'],
  ['Tiêu Đề 2', 'text-h2'],
  ['Tiêu Đề 3', 'text-h3'],
  ['Tiêu Đề 4', 'text-h4'],
  ['Tiêu Đề 5', 'text-h5'],
  ['Tiêu Đề 6', 'text-h6'],
  ['Phụ Đề 1', 'text-subtitle-1'],
  ['Phụ Đề 2', 'text-subtitle-2'],
  ['Nội Dung 1', 'text-body-1'],
  ['Nội Dung 2', 'text-body-2'],
  ['Nút', 'text-button'],
  ['Chú Thích', 'text-caption'],
  ['Gạch Trên', 'text-overline']
]);
const breadcrumbs = ref([
  {
    title: 'Tiện Ích',
    disabled: false,
    href: '#'
  },
  {
    title: 'Kiểu Chữ',
    disabled: true,
    href: '#'
  }
]);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Kiểu Chữ Cơ Bản">
        <UiChildCard title="Tiêu Đề">
          <div class="d-flex flex-column gap-1">
            <v-card variant="outlined" v-for="[name, cls] in headings" :key="name" class="my-4">
              <div :class="[cls, 'pa-2']">{{ name }}</div>
              <div class="text-caption pa-2 bg-lightprimary">
                <div class="text-grey">Lớp</div>
                <div class="font-weight-medium">{{ cls }}</div>
              </div>
            </v-card>
          </div>
        </UiChildCard>
        <UiChildCard title="Căn Chỉnh Văn Bản" class="mt-8">
          <div>
            <p class="text-left">Căn trái trên tất cả kích thước màn hình.</p>
            <p class="text-center">Căn giữa trên tất cả kích thước màn hình.</p>
            <p class="text-right">Căn phải trên tất cả kích thước màn hình.</p>

            <p class="text-sm-left">Căn trái trên màn hình SM (nhỏ) trở lên.</p>
            <p class="text-right text-md-left">Căn trái trên màn hình MD (trung bình) trở lên.</p>
            <p class="text-right text-lg-left">Căn trái trên màn hình LG (lớn) trở lên.</p>
            <p class="text-right text-xl-left">Căn trái trên màn hình XL (cực lớn) trở lên.</p>
          </div>
        </UiChildCard>
        <UiChildCard title="Trang Trí" class="mt-8">
          <div class="d-flex justify-space-between flex-wrap">
            <a href="#" class="text-decoration-none">Liên kết không gạch chân</a>

            <div class="text-decoration-line-through">Văn bản gạch ngang</div>

            <div class="text-decoration-overline">Văn bản gạch trên</div>

            <div class="text-decoration-underline">Văn bản gạch dưới</div>
          </div>
        </UiChildCard>
        <UiChildCard title="Độ Trong Suốt" class="mt-8">
          <div>
            <p class="text-high-emphasis">Độ nhấn mạnh cao có độ trong suốt 87% trong giao diện sáng và 100% trong giao diện tối.</p>
            <p class="text-medium-emphasis">Văn bản độ nhấn mạnh trung bình và văn bản gợi ý có độ trong suốt 60% trong giao diện sáng và 70% trong giao diện tối.</p>
            <p class="text-disabled">Văn bản bị vô hiệu hóa có độ trong suốt 38% trong giao diện sáng và 50% trong giao diện tối.</p>
          </div>
        </UiChildCard>
      </UiParentCard>
    </v-col>
  </v-row>
</template>

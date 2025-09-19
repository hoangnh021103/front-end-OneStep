<template>
    <div class="chon-thuoc-tinh-container">
      <v-card elevation="3" class="pa-4 mb-4">
        <v-card-title class="text-h6 font-weight-bold d-flex align-center">
          <v-icon class="mr-2">mdi-tune</v-icon>
          Chọn kích thước và màu sắc
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey" @click="goBack">
            <v-icon class="mr-1">mdi-arrow-left</v-icon>
            Quay lại
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
  
        <div v-if="product" class="mt-4">
          <div class="d-flex align-start">
            <v-avatar size="90" class="mr-4">
              <v-img :src="product.anh"></v-img>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">{{ product.tenSanPham }}</div>
              <div class="text-caption">Mã: {{ product.maSanPham }}</div>
              <div class="text-subtitle-2 text-primary mt-1">{{ formatCurrency(product.giaBan) }}</div>
            </div>
          </div>
  
          <v-divider class="my-4"></v-divider>
  
          <div class="mt-2">
            <div class="text-subtitle-2 font-weight-bold mb-2">Chọn kích thước</div>
            <div class="chip-group">
              <v-chip
                v-for="size in sizeOptions"
                :key="size"
                class="ma-1"
                :color="selectedSize === size ? 'primary' : ''"
                :variant="selectedSize === size ? 'elevated' : 'tonal'"
                @click="selectedSize = size"
              >
                {{ size }}
              </v-chip>
            </div>
          </div>
  
          <div class="mt-4">
            <div class="text-subtitle-2 font-weight-bold mb-2">Chọn màu sắc</div>
            <div class="chip-group">
              <v-chip
                v-for="color in colorOptions"
                :key="color.value"
                class="ma-1"
                :color="selectedColor === color.value ? color.value : ''"
                :variant="selectedColor === color.value ? 'elevated' : 'tonal'"
                @click="selectedColor = color.value"
              >
                {{ color.label }}
              </v-chip>
            </div>
          </div>
  
          <v-divider class="my-4"></v-divider>
  
          <v-btn color="success" size="large" class="action-btn" @click="confirmSelection">
            <v-icon class="mr-2">mdi-check</v-icon>
            Xác nhận
          </v-btn>
        </div>
  
        <div v-else class="pa-6 text-center">
          <v-alert type="warning" variant="tonal">Không tìm thấy sản phẩm. Vui lòng quay lại.</v-alert>
          <v-btn color="primary" class="mt-3" @click="goBack">Quay lại</v-btn>
        </div>
      </v-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const product = ref<any | null>(null)
  
  const sizeOptions = ['36','37','38','39','40','41','42','43','44']
  const colorOptions = [
    { label: 'Đen', value: 'black' },
    { label: 'Trắng', value: 'white' },
    { label: 'Đỏ', value: 'red' },
    { label: 'Xanh dương', value: 'blue' },
    { label: 'Hồng', value: 'pink' }
  ]
  
  const selectedSize = ref<string>('')
  const selectedColor = ref<string>('')
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  onMounted(() => {
    const raw = sessionStorage.getItem('selectedProduct')
    product.value = raw ? JSON.parse(raw) : null
  })
  
  const goBack = () => {
    router.push('/quan-ly/ban-hang')
  }
  
  const confirmSelection = () => {
    if (!product.value) {
      goBack()
      return
    }
    if (!selectedSize.value || !selectedColor.value) {
      alert('Vui lòng chọn đầy đủ kích thước và màu sắc')
      return
    }
    const payload = { product: product.value, size: selectedSize.value, color: selectedColor.value }
    sessionStorage.setItem('cartAddItem', JSON.stringify(payload))
    sessionStorage.removeItem('selectedProduct')
    router.push('/quan-ly/ban-hang')
  }
  </script>
  
  <style scoped>
  .chon-thuoc-tinh-container { padding: 20px; }
  .chip-group { display: flex; flex-wrap: wrap; }
  .action-btn { text-transform: none; font-weight: 600; }
  </style>
  
  
  
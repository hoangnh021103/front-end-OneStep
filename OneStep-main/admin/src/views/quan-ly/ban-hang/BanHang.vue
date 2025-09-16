<template>
  <div class="ban-hang-container">
    <v-card elevation="3" class="mb-6 pa-4" color="primary" dark>
      <div class="d-flex justify-space-between align-center">
        <div>
          <h2 class="text-h4 font-weight-bold mb-2">Hệ thống bán hàng tại quầy</h2>
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-cash-register</v-icon>
            <span class="text-subtitle-1">Mã đơn hàng: #{{ orderId }}</span>
            <v-chip color="white" text-color="primary" class="ml-4">
              {{ new Date().toLocaleString('vi-VN') }}
            </v-chip>
          </div>
        </div>
        <div class="text-right d-flex align-center">
          <div class="mr-3">
            <div class="text-h5 font-weight-bold">{{ formatCurrency(totalAmount) }}</div>
            <div class="text-caption">Tổng thanh toán</div>
          </div>
          <v-btn v-if="!orderStarted" color="white" text-color="primary" variant="elevated" class="action-btn" @click="startNewOrder">
            <v-icon class="mr-1">mdi-file-plus</v-icon>
            Tạo hóa đơn
          </v-btn>
          <v-btn v-else color="error" variant="elevated" class="action-btn" @click="cancelOrder">
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Hủy hóa đơn
          </v-btn>
        </div>
      </div>
    </v-card>

    <v-row>
      <v-col cols="8">
        <v-card elevation="2" class="mb-4 pa-4">
          <v-card-title class="text-h6 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-magnify</v-icon>
            Tìm kiếm sản phẩm
          </v-card-title>
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="searchQuery"
                placeholder="Nhập tên sản phẩm, mã sản phẩm..."
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                clearable
                @input="searchProducts"
                :disabled="!orderStarted"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-btn color="primary" variant="elevated" size="large" block @click="showProductModal = true" class="action-btn" :disabled="!orderStarted">
                <v-icon class="mr-2">mdi-plus</v-icon>
                Chọn sản phẩm
              </v-btn>
            </v-col>
          </v-row>

          <div v-if="searchResults.length > 0" class="mt-4">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">Kết quả tìm kiếm:</h4>
            <v-row>
              <v-col v-for="product in searchResults" :key="product.id" cols="12" md="6" lg="4">
                <v-card elevation="1" class="product-card" @click="addToCart(product)">
                  <v-img :src="product.anh" height="120" cover></v-img>
                  <v-card-text class="pa-3">
                    <h4 class="text-subtitle-2 font-weight-bold">{{ product.tenSanPham }}</h4>
                    <p class="text-caption text-grey">{{ product.maSanPham }}</p>
                    <div class="d-flex justify-space-between align-center mt-2">
                      <span class="text-h6 font-weight-bold text-primary">{{ formatCurrency(product.giaBan) }}</span>
                      <v-chip size="small" :color="product.mauSac">{{ product.mauSac }}</v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card>

        <v-card elevation="2" class="pa-4">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-cart</v-icon>
              <span class="text-h6 font-weight-bold">Giỏ hàng</span>
              <v-chip color="primary" class="ml-2">{{ cartItems.length }} sản phẩm</v-chip>
            </div>
            <v-btn color="error" variant="elevated" size="small" @click="clearCart" :disabled="cartItems.length === 0 || !orderStarted" class="action-btn">
              <v-icon size="small" class="mr-1">mdi-delete-sweep</v-icon>
              Xóa tất cả
            </v-btn>
          </v-card-title>

          <v-data-table :headers="productHeaders" :items="cartItems" :items-per-page="10" class="elevation-0 mt-4" hide-default-footer>
            <template #item.anh="{ item }">
              <v-avatar size="50" class="mr-3">
                <v-img :src="item.anh" :alt="item.tenSanPham"></v-img>
              </v-avatar>
            </template>

            <template #item.soLuong="{ item }">
              <div class="quantity-controls">
                <v-btn size="small" variant="elevated" color="error" @click="decreaseQuantity(item)" :disabled="item.soLuong <= 1 || !orderStarted" class="quantity-btn minus-btn">
                  <span class="quantity-symbol">−</span>
                </v-btn>
                <v-text-field v-model.number="item.soLuong" type="number" min="1" variant="outlined" density="compact" hide-details class="quantity-input" @change="updateQuantity(item)" :disabled="!orderStarted"></v-text-field>
                <v-btn size="small" variant="elevated" color="success" @click="increaseQuantity(item)" class="quantity-btn plus-btn" :disabled="!orderStarted">
                  <span class="quantity-symbol">+</span>
                </v-btn>
              </div>
            </template>

            <template #item.mauSac="{ item }">
              <v-chip :color="item.mauSac" size="small" class="ma-1"></v-chip>
            </template>

            <template #item.giaBan="{ item }">
              <span class="font-weight-medium">{{ formatCurrency(item.giaBan) }}</span>
            </template>

            <template #item.tongTien="{ item }">
              <span class="font-weight-bold text-primary">{{ formatCurrency(item.tongTien) }}</span>
            </template>

            <template #item.thaoTac="{ item }">
              <v-btn color="error" variant="elevated" size="small" @click="removeFromCart(item)" class="action-btn" :disabled="!orderStarted">
                <v-icon size="small" class="mr-1">mdi-delete</v-icon>
                Xóa
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card elevation="2" class="pa-4 sticky-card">
          <v-card-title class="text-h6 font-weight-bold mb-4 d-flex align-center">
            <v-icon class="mr-2">mdi-receipt</v-icon>
            Thông tin đơn hàng
          </v-card-title>

          <div class="mb-4">
            <div class="mt-2 d-flex">
              <v-btn color="primary" variant="elevated" size="small" class="action-btn" @click="openCustomerDialog" :disabled="!orderStarted">
                <v-icon size="small" class="mr-1">mdi-account-search</v-icon>
                Chọn khách hàng
              </v-btn>
              <v-btn color="success" variant="elevated" size="small" class="action-btn ml-2" @click="openQuickAddCustomer" :disabled="!orderStarted">
                <v-icon size="small" class="mr-1">mdi-account-plus</v-icon>
                Thêm KH nhanh
              </v-btn>
            </div>
            <div v-if="selectedCustomer" class="mt-2">
              <v-chip color="primary" variant="tonal" size="small">
                {{ selectedCustomer.hoTen }} - {{ selectedCustomer.soDienThoai }}
              </v-chip>
            </div>
          </div>

          <div class="mb-4">
            <v-switch v-model="isDelivery" label="Giao hàng" color="primary" hide-details class="mb-2" :disabled="!orderStarted"></v-switch>

            <div v-if="isDelivery" class="mt-3">
              <v-label class="text-subtitle-2 font-weight-medium mb-2">Địa chỉ giao hàng</v-label>

              <v-select v-model="selectedProvince" :items="provinces" item-title="name" item-value="code" label="Tỉnh/Thành phố" variant="outlined" density="compact" class="mb-2" @update:model-value="onProvinceChange" clearable prepend-inner-icon="mdi-map-marker" :loading="isLoadingProvinces" :disabled="!orderStarted"></v-select>

              <v-select v-model="selectedDistrict" :items="districts" item-title="name" item-value="code" label="Quận/Huyện" variant="outlined" density="compact" class="mb-2" @update:model-value="onDistrictChange" :disabled="!selectedProvince || !orderStarted" clearable prepend-inner-icon="mdi-city" :loading="isLoadingDistricts"></v-select>

              <v-select v-model="selectedWard" :items="wards" item-title="name" item-value="code" label="Phường/Xã" variant="outlined" density="compact" class="mb-2" :disabled="!selectedDistrict || !orderStarted" clearable prepend-inner-icon="mdi-home" :loading="isLoadingWards"></v-select>

              <v-textarea v-model="detailAddress" label="Địa chỉ chi tiết (số nhà, tên đường...)" variant="outlined" density="compact" rows="2" :rules="detailAddressRules" placeholder="Ví dụ: Số 123, Đường ABC, Tòa nhà XYZ" :disabled="!orderStarted"></v-textarea>

              <div v-if="fullAddress" class="address-preview">
                <div class="d-flex align-center mb-1">
                  <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                  <div class="text-caption text-grey-darken-1">Địa chỉ giao hàng:</div>
                </div>
                <div class="text-body-2 font-weight-medium">{{ fullAddress }}</div>
              </div>

              <div v-if="isDelivery" class="warehouse-info mt-3">
                <v-card variant="outlined" class="pa-3">
                  <div class="d-flex align-center mb-2">
                    <v-icon size="small" class="mr-2" color="primary">mdi-warehouse</v-icon>
                    <span class="text-caption font-weight-bold">Kho hàng</span>
                  </div>
                  <div class="text-caption text-grey-darken-1">{{ warehouseLocation.name }}</div>
                  <div class="text-caption text-grey-darken-1 mt-1">Phí ship được tính theo khoảng cách thực tế</div>
                </v-card>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <v-label class="text-subtitle-2 font-weight-medium mb-2">Mã giảm giá</v-label>
            <v-row>
              <v-col cols="8">
                <v-text-field v-model="discountCode" placeholder="Nhập mã giảm giá" variant="outlined" density="compact" hide-details :disabled="!orderStarted"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-btn color="primary" variant="elevated" block @click="applyDiscount" class="action-btn" :disabled="!orderStarted">Áp dụng</v-btn>
              </v-col>
            </v-row>
            <div v-if="discountInfo" class="mt-2">
              <v-alert type="success" variant="tonal" density="compact" class="text-caption">{{ discountInfo }}</v-alert>
            </div>
          </div>

          <v-divider class="my-4"></v-divider>
          <div class="mb-2">
            <div class="d-flex justify-space-between">
              <span>Tổng tiền hàng:</span>
              <span class="font-weight-medium">{{ formatCurrency(subtotal) }}</span>
            </div>
          </div>
          <div class="mb-2">
            <div class="d-flex justify-space-between">
              <span>Phí giao hàng:</span>
              <span class="font-weight-medium">{{ formatCurrency(deliveryFee) }}</span>
            </div>
            <div v-if="shippingInfo" class="shipping-info-highlight">
              <div class="d-flex align-center mb-1">
                <v-icon size="small" class="mr-2">mdi-truck-delivery</v-icon>
                <span class="text-caption font-weight-bold">{{ shippingInfo.zone }}</span>
              </div>
              <div class="text-caption">Từ {{ shippingInfo.from }} → {{ shippingInfo.distance }}km</div>
            </div>
          </div>
          <div class="mb-2">
            <div class="d-flex justify-space-between">
              <span>Giảm giá:</span>
              <span class="font-weight-medium text-success">-{{ formatCurrency(discountAmount) }}</span>
            </div>
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="mb-4">
            <div class="d-flex justify-space-between">
              <span class="text-h6 font-weight-bold">Tổng thanh toán:</span>
              <span class="text-h6 font-weight-bold text-primary">{{ formatCurrency(totalAmount) }}</span>
            </div>
          </div>

          <div class="mb-4">
            <v-label class="text-subtitle-2 font-weight-medium mb-2">Phương thức thanh toán</v-label>
            <v-btn-toggle v-model="paymentMethod" color="primary" variant="outlined" mandatory class="d-flex">
              <v-btn value="cash" size="small" class="flex-grow-1" :disabled="!orderStarted">
                <v-icon class="mr-1">mdi-cash</v-icon>
                Tiền mặt
              </v-btn>
              <v-btn value="bank" size="small" class="flex-grow-1" :disabled="!orderStarted">
                <v-icon class="mr-1">mdi-bank</v-icon>
                Chuyển khoản
              </v-btn>
            </v-btn-toggle>
          </div>

          <div v-if="paymentMethod === 'bank'" class="mb-4 text-center">
            <v-card variant="outlined" class="pa-3">
              <div class="text-caption mb-2">Quét mã QR để chuyển khoản</div>
              <div class="qr-code-container">
                <img :src="fixedBankQrUrl" alt="Bank QR" style="max-width:100%;height:auto;" />
              </div>
              <div class="text-caption mt-2">{{ formatCurrency(totalAmount) }}</div>
            </v-card>
          </div>

          <v-btn color="primary" variant="elevated" size="large" block class="text-h6 font-weight-bold mb-2 action-btn" @click="processPayment" :disabled="cartItems.length === 0 || !orderStarted">
            <v-icon class="mr-2">mdi-check</v-icon>
            Xác nhận thanh toán
          </v-btn>

          <v-btn color="success" variant="elevated" size="large" block @click="printReceipt" :disabled="cartItems.length === 0 || !orderStarted" class="action-btn">
            <v-icon class="mr-2">mdi-printer</v-icon>
            In hóa đơn
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showProductModal" max-width="1200px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          <v-icon class="mr-2">mdi-package-variant</v-icon>
          Chọn sản phẩm
        </v-card-title>
        <v-card-text>
          <v-data-table :headers="productModalHeaders" :items="allProducts" :items-per-page="10" class="elevation-0">
            <template #item.anh="{ item }">
              <v-avatar size="40" class="mr-3">
                <v-img :src="item.anh" :alt="item.tenSanPham"></v-img>
              </v-avatar>
            </template>
            <template #item.giaBan="{ item }">
              <span class="font-weight-medium">{{ formatCurrency(item.giaBan) }}</span>
            </template>
            <template #item.thaoTac="{ item }">
              <v-btn color="success" variant="elevated" size="small" @click="addToCart(item); showProductModal = false" class="action-btn">
                <v-icon size="small" class="mr-1">mdi-plus</v-icon>
                Thêm
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showProductModal = false" color="grey" variant="elevated" class="action-btn">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog chọn khách hàng -->
    <v-dialog v-model="showCustomerModal" max-width="900px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold d-flex align-center">
          <v-icon class="mr-2">mdi-account-group</v-icon>
          Chọn khách hàng
        </v-card-title>
        <v-card-text>
          <v-row class="mb-3">
            <v-col cols="12" md="6">
              <v-text-field v-model="customerSearch" placeholder="Tìm theo tên/email/số điện thoại" density="compact" variant="outlined" prepend-inner-icon="mdi-magnify" @input="filterCustomerList"></v-text-field>
            </v-col>
          </v-row>
          <v-data-table :headers="customerHeaders" :items="filteredCustomers" :items-per-page="8" class="elevation-0">
            <template #item.hanhDong="{ item }">
              <v-btn color="success" size="small" variant="elevated" class="action-btn" @click="chooseCustomer(item)">
                <v-icon size="small" class="mr-1">mdi-check</v-icon>
                Chọn
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="elevated" class="action-btn" @click="showCustomerModal = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog thêm khách hàng nhanh -->
    <v-dialog v-model="showQuickAddModal" max-width="600px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold d-flex align-center">
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          Thêm khách hàng nhanh
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="quickCustomer.hoTen" label="Họ và tên" variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="quickCustomer.soDienThoai" label="Số điện thoại" variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="quickCustomer.email" label="Email (tuỳ chọn)" variant="outlined" density="compact"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="elevated" class="action-btn" @click="showQuickAddModal = false">Huỷ</v-btn>
          <v-btn color="success" variant="elevated" class="action-btn" @click="saveQuickCustomer">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import khachHangApi from '@/api/khachHangApi'

const generateOrderId = () => {
  return 'ORD' + Date.now().toString().slice(-6)
}

const orderId = ref(generateOrderId())
const orderStarted = ref(false)
const isDelivery = ref(false)
const discountCode = ref('')
const paymentMethod = ref<'cash' | 'bank'>('cash')
const searchQuery = ref('')
const showProductModal = ref(false)
const discountInfo = ref('')

// Đặt đường dẫn ảnh QR cố định trong thư mục public
const fixedBankQrUrl = ref<string>('/qr-vcb.png')

const isLoadingProvinces = ref(false)
const isLoadingDistricts = ref(false)
const isLoadingWards = ref(false)

const selectedProvince = ref('')
const selectedDistrict = ref('')
const selectedWard = ref('')
const detailAddress = ref('')

const customerInfo = ref({
  ten: '',
  sdt: ''
})

const cartItems = ref<any[]>([])
let cartItemId = 1

const allProducts = ref([
  { id: 1, maSanPham: 'SP001', tenSanPham: 'Giày thể thao Nike Air Max', anh: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Nike', giaBan: 2500000, mauSac: 'red', kichThuoc: '42', tonKho: 50 },
  { id: 2, maSanPham: 'SP002', tenSanPham: 'Giày chạy bộ Adidas Ultraboost', anh: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Adidas', giaBan: 3200000, mauSac: 'blue', kichThuoc: '41', tonKho: 30 },
  { id: 3, maSanPham: 'SP003', tenSanPham: 'Giày cao gót đen', anh: 'https://via.placeholder.com/200x200/45B7D1/FFFFFF?text=Heels', giaBan: 1800000, mauSac: 'black', kichThuoc: '38', tonKho: 25 },
  { id: 4, maSanPham: 'SP004', tenSanPham: 'Sandal nữ mùa hè', anh: 'https://via.placeholder.com/200x200/96CEB4/FFFFFF?text=Sandal', giaBan: 850000, mauSac: 'pink', kichThuoc: '37', tonKho: 40 }
])

const searchResults = ref<any[]>([])

// Khách hàng
const showCustomerModal = ref(false)
const customers = ref<any[]>([])
const filteredCustomers = ref<any[]>([])
const customerSearch = ref('')
const selectedCustomer = ref<any | null>(null)

// Quick add customer
const showQuickAddModal = ref(false)
const quickCustomer = ref<{ hoTen: string; soDienThoai: string; email?: string }>({ hoTen: '', soDienThoai: '', email: '' })

const provinces = ref<any[]>([])
const districts = ref<any[]>([])
const wards = ref<any[]>([])

const fetchProvinces = async () => {
  try {
    isLoadingProvinces.value = true
    const res = await fetch('https://provinces.open-api.vn/api/p/')
    const data = await res.json()
    provinces.value = data.map((p: any) => ({ code: p.code.toString(), name: p.name }))
  } catch (e) {
    provinces.value = []
  } finally {
    isLoadingProvinces.value = false
  }
}

const fetchDistricts = async (provinceCode: string) => {
  try {
    isLoadingDistricts.value = true
    districts.value = []
    wards.value = []
    const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
    const data = await res.json()
    districts.value = (data.districts || []).map((d: any) => ({ code: d.code.toString(), name: d.name }))
  } catch (e) {
    districts.value = []
  } finally {
    isLoadingDistricts.value = false
  }
}

const fetchWards = async (districtCode: string) => {
  try {
    isLoadingWards.value = true
    wards.value = []
    const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
    const data = await res.json()
    wards.value = (data.wards || []).map((w: any) => ({ code: w.code.toString(), name: w.name }))
  } catch (e) {
    wards.value = []
  } finally {
    isLoadingWards.value = false
  }
}

const productHeaders = [
  { title: 'STT', key: 'stt', sortable: false, width: '60px' },
  { title: 'Ảnh', key: 'anh', sortable: false, width: '80px' },
  { title: 'Tên sản phẩm', key: 'tenSanPham', sortable: false },
  { title: 'Số lượng', key: 'soLuong', sortable: false, width: '150px' },
  { title: 'Giá bán', key: 'giaBan', sortable: false, width: '120px' },
  { title: 'Kích thước', key: 'kichThuoc', sortable: false, width: '100px' },
  { title: 'Màu sắc', key: 'mauSac', sortable: false, width: '100px' },
  { title: 'Tổng tiền', key: 'tongTien', sortable: false, width: '120px' },
  { title: 'Thao tác', key: 'thaoTac', sortable: false, width: '100px' }
]

const productModalHeaders = [
  { title: 'Ảnh', key: 'anh', sortable: false, width: '80px' },
  { title: 'Mã SP', key: 'maSanPham', sortable: false, width: '100px' },
  { title: 'Tên sản phẩm', key: 'tenSanPham', sortable: false },
  { title: 'Giá bán', key: 'giaBan', sortable: false, width: '120px' },
  { title: 'Tồn kho', key: 'tonKho', sortable: false, width: '100px' },
  { title: 'Thao tác', key: 'thaoTac', sortable: false, width: '100px' }
]

const customerHeaders = [
  { title: 'STT', key: 'stt', sortable: false, width: '60px' },
  { title: 'Họ và tên', key: 'hoTen', sortable: false },
  { title: 'Email', key: 'email', sortable: false },
  { title: 'Số điện thoại', key: 'soDienThoai', sortable: false, width: '140px' },
  { title: 'Hành động', key: 'hanhDong', sortable: false, width: '120px' }
]

const detailAddressRules = [
  (v: string) => !!v || 'Vui lòng nhập địa chỉ chi tiết',
  (v: string) => v.length >= 10 || 'Địa chỉ chi tiết phải có ít nhất 10 ký tự'
]

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.tongTien, 0)
})

const warehouseLocation = {
  province: 'HN',
  district: 'NM',
  name: 'Nam Từ Liêm, Hà Nội'
}

const calculateDistanceFromWarehouse = (provinceCode: string) => {
  const distances: { [key: string]: number } = {
    'HN': 0,
    'HP': 70,
    'HD': 45,
    'NB': 45,
    'TH': 70,
    'NA': 120,
    'DN': 450,
    'HCM': 900
  }
  return distances[provinceCode] || 400
}

const calculateShippingFee = (distance: number) => {
  if (distance <= 5) return 0
  if (distance <= 15) return 10000
  if (distance <= 30) return 15000
  if (distance <= 50) return 20000
  if (distance <= 100) return 25000
  if (distance <= 200) return 30000
  if (distance <= 400) return 35000
  if (distance <= 600) return 40000
  if (distance <= 1000) return 45000
  return 50000
}

const getShippingZone = (distance: number) => {
  if (distance <= 5) return 'Nội thành (miễn phí)'
  if (distance <= 15) return 'Nội thành'
  if (distance <= 30) return 'Ngoại thành (gần)'
  if (distance <= 50) return 'Ngoại thành (xa)'
  if (distance <= 100) return 'Tỉnh lân cận'
  if (distance <= 200) return 'Miền (gần)'
  if (distance <= 400) return 'Miền (xa)'
  if (distance <= 600) return 'Toàn quốc (gần)'
  if (distance <= 1000) return 'Toàn quốc (xa)'
  return 'Toàn quốc (rất xa)'
}

const deliveryFee = computed(() => {
  if (!isDelivery.value || !selectedProvince.value) return 0
  const distance = calculateDistanceFromWarehouse(selectedProvince.value)
  return calculateShippingFee(distance)
})

const shippingInfo = computed(() => {
  if (!isDelivery.value || !selectedProvince.value) return null as any
  const distance = calculateDistanceFromWarehouse(selectedProvince.value)
  const fee = calculateShippingFee(distance)
  const zone = getShippingZone(distance)
  return { zone, distance, fee, from: warehouseLocation.name }
})

const discountAmount = computed(() => {
  if (discountCode.value) {
    if (discountCode.value === 'GIAM10') return subtotal.value * 0.1
    if (discountCode.value === 'GIAM20') return subtotal.value * 0.2
    if (discountCode.value === 'GIAM50K') return Math.min(50000, subtotal.value)
  }
  return 0
})

const totalAmount = computed(() => {
  return subtotal.value + deliveryFee.value - discountAmount.value
})

const fullAddress = computed(() => {
  if (!selectedProvince.value) return ''
  const province = provinces.value.find((p: any) => p.code === selectedProvince.value)
  const district = districts.value.find((d: any) => d.code === selectedDistrict.value)
  const ward = wards.value.find((w: any) => w.code === selectedWard.value)
  let address = ''
  if (ward) address += ward.name + ', '
  if (district) address += district.name + ', '
  if (province) address += province.name
  if (detailAddress.value) address = detailAddress.value + ', ' + address
  return address
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const searchProducts = () => {
  if (searchQuery.value.trim()) {
    searchResults.value = allProducts.value.filter((product: any) =>
      product.tenSanPham.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.maSanPham.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  } else {
    searchResults.value = []
  }
}

// Dialog khách hàng
const openCustomerDialog = async () => {
  showCustomerModal.value = true
  if (customers.value.length === 0) {
    await fetchCustomers()
  }
  filteredCustomers.value = [...customers.value]
}

const fetchCustomers = async () => {
  try {
    customers.value = await khachHangApi.hienThi()
  } catch (e) {
    customers.value = []
  }
}

const filterCustomerList = () => {
  const kw = customerSearch.value.trim().toLowerCase()
  if (!kw) {
    filteredCustomers.value = [...customers.value]
    return
  }
  filteredCustomers.value = customers.value.filter((c: any) =>
    (c.hoTen && c.hoTen.toLowerCase().includes(kw)) ||
    (c.email && c.email.toLowerCase().includes(kw)) ||
    (c.soDienThoai && String(c.soDienThoai).includes(kw))
  )
}

const chooseCustomer = (cus: any) => {
  selectedCustomer.value = cus
  customerInfo.value.ten = cus.hoTen || ''
  customerInfo.value.sdt = String(cus.soDienThoai || '')
  showCustomerModal.value = false
}

const openQuickAddCustomer = () => {
  quickCustomer.value = { hoTen: '', soDienThoai: '', email: '' }
  showQuickAddModal.value = true
}

const saveQuickCustomer = async () => {
  const payload: any = {
    hoTen: quickCustomer.value.hoTen?.trim(),
    soDienThoai: String(quickCustomer.value.soDienThoai || '').trim(),
    email: quickCustomer.value.email?.trim() || ''
  }
  if (!payload.hoTen || !payload.soDienThoai) {
    alert('Vui lòng nhập Họ tên và Số điện thoại')
    return
  }
  try {
    const created = await khachHangApi.themNhanh(payload)
    // thêm vào danh sách hiện tại để lần sau tìm nhanh
    customers.value.unshift(created)
    selectedCustomer.value = created
    customerInfo.value.ten = created.hoTen || ''
    customerInfo.value.sdt = String(created.soDienThoai || '')
    showQuickAddModal.value = false
  } catch (e) {
    // fallback: thêm local nếu API chưa có
    const local = { id: Date.now(), ...payload }
    customers.value.unshift(local)
    selectedCustomer.value = local
    customerInfo.value.ten = local.hoTen
    customerInfo.value.sdt = local.soDienThoai
    showQuickAddModal.value = false
  }
}

const addToCart = (product: any) => {
  const existingItem = cartItems.value.find((item) => item.maSanPham === product.maSanPham && item.kichThuoc === product.kichThuoc && item.mauSac === product.mauSac)
  if (existingItem) {
    existingItem.soLuong += 1
    existingItem.tongTien = existingItem.soLuong * existingItem.giaBan
  } else {
    const newItem = { stt: cartItemId++, id: product.id, maSanPham: product.maSanPham, tenSanPham: product.tenSanPham, anh: product.anh, soLuong: 1, giaBan: product.giaBan, kichThuoc: product.kichThuoc, mauSac: product.mauSac, tongTien: product.giaBan }
    cartItems.value.push(newItem)
  }
}

const removeFromCart = (item: any) => {
  const index = cartItems.value.findIndex((cartItem) => cartItem.stt === item.stt)
  if (index > -1) cartItems.value.splice(index, 1)
}

const increaseQuantity = (item: any) => {
  item.soLuong += 1
  updateQuantity(item)
}

const decreaseQuantity = (item: any) => {
  if (item.soLuong > 1) {
    item.soLuong -= 1
    updateQuantity(item)
  }
}

const updateQuantity = (item: any) => {
  item.tongTien = item.soLuong * item.giaBan
}

const clearCart = () => {
  cartItems.value = []
  cartItemId = 1
}

const applyDiscount = () => {
  if (discountCode.value) {
    if (discountCode.value === 'GIAM10') discountInfo.value = 'Áp dụng giảm giá 10%'
    else if (discountCode.value === 'GIAM20') discountInfo.value = 'Áp dụng giảm giá 20%'
    else if (discountCode.value === 'GIAM50K') discountInfo.value = 'Áp dụng giảm giá 50.000 VNĐ'
    else discountInfo.value = 'Mã giảm giá không hợp lệ'
  } else {
    discountInfo.value = ''
  }
}

const processPayment = () => {
  if (cartItems.value.length === 0) {
    alert('Giỏ hàng trống!')
    return
  }
  if (isDelivery.value && !fullAddress.value) {
    alert('Vui lòng chọn địa chỉ giao hàng đầy đủ!')
    return
  }
  const orderData = {
    orderId: orderId.value,
    customerInfo: customerInfo.value,
    items: cartItems.value,
    isDelivery: isDelivery.value,
    deliveryAddress: fullAddress.value,
    discountCode: discountCode.value,
    paymentMethod: paymentMethod.value,
    subtotal: subtotal.value,
    deliveryFee: deliveryFee.value,
    discountAmount: discountAmount.value,
    totalAmount: totalAmount.value,
    timestamp: new Date().toISOString()
  }
  console.log('Xử lý thanh toán:', orderData)
  alert(`Thanh toán thành công!\nMã đơn hàng: ${orderId.value}\nTổng tiền: ${formatCurrency(totalAmount.value)}`)
  resetForm()
}

const printReceipt = () => {
  if (cartItems.value.length === 0) {
    alert('Giỏ hàng trống!')
    return
  }
  const receiptContent = generateReceiptContent()
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(receiptContent)
    printWindow.document.close()
    printWindow.print()
  }
}

const generateReceiptContent = () => {
  return `
    <html>
      <head>
        <title>Hóa đơn #${orderId.value}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-weight: bold; font-size: 18px; }
          .divider { border-top: 1px solid #ccc; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>ONESTEP</h2>
          <p>Hóa đơn #${orderId.value}</p>
          <p>${new Date().toLocaleString('vi-VN')}</p>
        </div>
        <div class="divider"></div>
        ${cartItems.value.map(item => `
          <div class="item">
            <span>${item.tenSanPham} (${item.kichThuoc}) x${item.soLuong}</span>
            <span>${formatCurrency(item.tongTien)}</span>
          </div>
        `).join('')}
        <div class="divider"></div>
        <div class="item"><span>Tổng tiền hàng:</span><span>${formatCurrency(subtotal.value)}</span></div>
        ${isDelivery.value ? `
        <div class="item"><span>Phí giao hàng (${shippingInfo.value ? shippingInfo.value.zone + ' - ' + shippingInfo.value.distance + 'km' : 'Giao hàng'}):</span><span>${formatCurrency(deliveryFee.value)}</span></div>
        <div class="item"><span>Kho hàng:</span><span>${warehouseLocation.name}</span></div>
        ` : ''}
        ${discountAmount.value > 0 ? `
        <div class="item"><span>Giảm giá:</span><span>-${formatCurrency(discountAmount.value)}</span></div>
        ` : ''}
        <div class="divider"></div>
        <div class="item total"><span>Tổng thanh toán:</span><span>${formatCurrency(totalAmount.value)}</span></div>
        <div class="divider"></div>
        <p>Phương thức thanh toán: ${getPaymentMethodName()}</p>
        ${isDelivery.value ? `<p>Địa chỉ giao hàng: ${fullAddress.value}</p>` : ''}
        <div style="text-align: center; margin-top: 30px;"><p>Cảm ơn quý khách!</p></div>
      </body>
    </html>
  `
}

const getPaymentMethodName = () => {
  return paymentMethod.value === 'bank' ? 'Chuyển khoản' : 'Tiền mặt'
}

const onProvinceChange = async (value: string) => {
  selectedDistrict.value = ''
  selectedWard.value = ''
  districts.value = []
  wards.value = []
  if (value) await fetchDistricts(value)
}

const onDistrictChange = async (value: string) => {
  selectedWard.value = ''
  wards.value = []
  if (value) await fetchWards(value)
}

const resetForm = () => {
  cartItems.value = []
  customerInfo.value = { ten: '', sdt: '' }
  selectedProvince.value = ''
  selectedDistrict.value = ''
  selectedWard.value = ''
  detailAddress.value = ''
  districts.value = []
  wards.value = []
  discountCode.value = ''
  discountInfo.value = ''
  isDelivery.value = false
  paymentMethod.value = 'cash'
  orderId.value = generateOrderId()
  cartItemId = 1
  selectedCustomer.value = null
  orderStarted.value = false
}

const startNewOrder = () => {
  resetForm()
  orderStarted.value = true
}

const cancelOrder = () => {
  resetForm()
}

onMounted(async () => {
  addToCart(allProducts.value[0])
  await fetchProvinces()
})
</script>

<style scoped>
.ban-hang-container {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.sticky-card {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.v-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: box-shadow 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.action-btn {
  min-width: 90px;
  height: 36px;
  font-weight: 600;
  font-size: 13px;
  text-transform: none;
  letter-spacing: 0.5px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 4px 0;
}

.quantity-btn {
  min-width: 32px !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 50% !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.quantity-btn:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important;
}

.quantity-symbol {
  font-size: 20px !important;
  font-weight: bold;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.quantity-input {
  width: 70px !important;
  min-width: 70px !important;
}

.quantity-input .v-field__input {
  text-align: center !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  padding: 8px 4px !important;
  min-height: 32px !important;
}

@media (max-width: 1200px) {
  .ban-hang-container {
    padding: 16px;
  }
  .sticky-card {
    position: relative;
    top: 0;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .ban-hang-container {
    padding: 12px;
  }
  .v-card {
    margin-bottom: 16px;
  }
}
</style>



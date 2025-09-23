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
              <v-btn color="primary" variant="elevated" size="large" block @click="openProductModal" class="action-btn" :disabled="!orderStarted">
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
                      <span class="text-h6 font-weight-bold text-primary">
                        {{ product.giaBan ? formatCurrency(product.giaBan) : 'Chưa có giá' }}
                      </span>
                      <v-chip size="small" :color="product.mauSac || 'grey'">
                        {{ product.mauSac || 'Chưa có màu' }}
                      </v-chip>
                    </div>
                    <div class="mt-1 text-caption text-grey-darken-1">
                      Tồn kho: {{ product.tonKho !== null ? product.tonKho : 'Chưa có' }}
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
              <div class="d-flex align-center">
                <span class="color-dot" :style="{ backgroundColor: resolveColor(item.mauSac) }"></span>
                <span class="ml-2">{{ getColorLabel(item.mauSac) }}</span>
              </div>
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
              <v-alert :type="discountType" variant="tonal" density="compact" class="text-caption">{{ discountInfo }}</v-alert>
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

          <v-btn color="primary" variant="elevated" size="large" block class="text-h6 font-weight-bold action-btn" @click="confirmPayment" :disabled="cartItems.length === 0 || !orderStarted">
            <v-icon class="mr-2">mdi-check</v-icon>
            Xác nhận thanh toán
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
          <v-progress-linear v-if="isLoadingProducts" indeterminate color="primary" class="mb-4"></v-progress-linear>
          
          <v-alert v-if="!isLoadingProducts && allProducts.length === 0" type="warning" class="mb-4">
            <v-icon>mdi-alert</v-icon>
            Không có sản phẩm nào từ API. Vui lòng kiểm tra:
            <ul>
              <li>Backend đang chạy ở port 8080</li>
              <li>Database có dữ liệu sản phẩm</li>
              <li>Xem Console log để biết chi tiết lỗi</li>
            </ul>
          </v-alert>
          
          <v-data-table v-if="!isLoadingProducts" :headers="productModalHeaders" :items="allProducts" :items-per-page="10" class="elevation-0">
            <template #item.anh="{ item }">
              <v-avatar size="40" class="mr-3">
                <v-img :src="item.anh" :alt="item.tenSanPham"></v-img>
              </v-avatar>
            </template>
            <template #item.giaBan="{ item }">
              <span class="font-weight-medium">
                {{ item.giaBan ? formatCurrency(item.giaBan) : 'Chưa có giá' }}
              </span>
            </template>
            <template #item.tonKho="{ item }">
              <span class="font-weight-medium">
                {{ item.tonKho !== null ? item.tonKho : 'Chưa có' }}
              </span>
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
              <v-text-field v-model="customerSearch" placeholder="Tìm theo tên/email/số điện thoại" density="compact" variant="outlined" prepend-inner-icon="mdi-magnify" @input="filterCustomerList" clearable></v-text-field>
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

    <!-- Dialog xác nhận thanh toán -->
    <v-dialog v-model="showPaymentConfirmDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold d-flex align-center text-primary">
          <v-icon class="mr-2" color="primary">mdi-help-circle</v-icon>
          Xác nhận thanh toán
        </v-card-title>
        <v-card-text class="pb-2">
          <div class="text-body-1 mb-4">Bạn có chắc chắn muốn thực hiện thanh toán không?</div>
          
          <v-card variant="outlined" class="pa-3 mb-3">
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2">Tổng tiền hàng:</span>
              <span class="font-weight-medium">{{ formatCurrency(subtotal) }}</span>
            </div>
            <div v-if="isDelivery" class="d-flex justify-space-between mb-2">
              <span class="text-body-2">Phí giao hàng:</span>
              <span class="font-weight-medium">{{ formatCurrency(deliveryFee) }}</span>
            </div>
            <div v-if="discountAmount > 0" class="d-flex justify-space-between mb-2">
              <span class="text-body-2">
                Giảm giá{{ selectedVoucher ? ` (${selectedVoucher.ten})` : '' }}:
              </span>
              <span class="font-weight-medium text-success">-{{ formatCurrency(discountAmount) }}</span>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-space-between">
              <span class="text-h6 font-weight-bold">Tổng thanh toán:</span>
              <span class="text-h6 font-weight-bold text-primary">{{ formatCurrency(totalAmount) }}</span>
            </div>
          </v-card>

          <div class="text-body-2 text-grey-darken-1">
            <v-icon size="small" class="mr-1">mdi-information</v-icon>
            Phương thức: {{ getPaymentMethodName() }}
          </div>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="elevated" class="action-btn" @click="showPaymentConfirmDialog = false">
            <v-icon class="mr-1">mdi-close</v-icon>
            Hủy
          </v-btn>
          <v-btn color="primary" variant="elevated" class="action-btn" @click="processPayment">
            <v-icon class="mr-1">mdi-check</v-icon>
            Xác nhận
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog xác nhận in hóa đơn -->
    <v-dialog v-model="showPrintConfirmDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold d-flex align-center text-success">
          <v-icon class="mr-2" color="success">mdi-check-circle</v-icon>
          Thanh toán thành công!
        </v-card-title>
        <v-card-text class="pb-2">
          <div class="text-body-1 mb-3">
            <v-icon class="mr-2" color="success">mdi-receipt</v-icon>
            Bạn có muốn in hóa đơn không?
          </div>
          <div class="text-body-2 text-grey-darken-1">
            Mã đơn hàng: <span class="font-weight-bold">#{{ orderId }}</span>
          </div>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="elevated" class="action-btn" @click="skipPrint">
            <v-icon class="mr-1">mdi-close</v-icon>
            Không in
          </v-btn>
          <v-btn color="success" variant="elevated" class="action-btn" @click="printReceiptAndClose">
            <v-icon class="mr-1">mdi-printer</v-icon>
            In hóa đơn
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { khachHangApi } from '@/api/khachHangApi'
import thanhToanApi from '@/api/thanhToanApi'
import { voucherApi } from '@/api/voucherApi'
import { toast } from 'vue3-toastify'

const generateOrderId = () => {
  return 'ORD' + Date.now().toString().slice(-6)
}

const router = useRouter()
const orderId = ref(generateOrderId())
const orderStarted = ref(false)
const isDelivery = ref(false)
const discountCode = ref('')
const paymentMethod = ref<'cash' | 'bank'>('cash')
const searchQuery = ref('')
const showProductModal = ref(false)
const discountInfo = ref('')
const discountType = ref<'success' | 'error' | 'info' | 'warning'>('info')
const selectedVoucher = ref<any | null>(null)

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

const allProducts = ref<any[]>([])
const isLoadingProducts = ref(false)

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

// Confirm dialogs
const showPaymentConfirmDialog = ref(false)
const showPrintConfirmDialog = ref(false)

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

// Lưu/khôi phục trạng thái đơn hàng để đảm bảo điều hướng không làm mất trạng thái
const ORDER_STATE_KEY = 'posOrderState'

const saveOrderState = () => {
  const state = {
    orderId: orderId.value,
    orderStarted: orderStarted.value,
    isDelivery: isDelivery.value,
    discountCode: discountCode.value,
    paymentMethod: paymentMethod.value,
    customerInfo: customerInfo.value,
    selectedCustomer: selectedCustomer.value,
    cartItems: cartItems.value,
    cartItemId
  }
  sessionStorage.setItem(ORDER_STATE_KEY, JSON.stringify(state))
}

const loadOrderState = () => {
  const raw = sessionStorage.getItem(ORDER_STATE_KEY)
  if (!raw) return
  try {
    const s = JSON.parse(raw)
    orderId.value = s.orderId || orderId.value
    orderStarted.value = !!s.orderStarted
    isDelivery.value = !!s.isDelivery
    discountCode.value = s.discountCode || ''
    paymentMethod.value = s.paymentMethod || 'cash'
    customerInfo.value = s.customerInfo || { ten: '', sdt: '' }
    selectedCustomer.value = s.selectedCustomer || null
    cartItems.value = Array.isArray(s.cartItems) ? s.cartItems : []
    cartItemId = s.cartItemId || 1
  } catch (e) {
    // ignore parse errors
  }
}

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
  // Hệ thống tính phí ship theo khoảng cách giống Shopee
  if (distance <= 3) return 0        // Miễn phí nội thành gần
  if (distance <= 5) return 8000     // Nội thành (3-5km)
  if (distance <= 10) return 12000   // Nội thành xa (5-10km)
  if (distance <= 15) return 15000   // Ngoại thành gần (10-15km)
  if (distance <= 20) return 18000   // Ngoại thành (15-20km)
  if (distance <= 30) return 22000   // Ngoại thành xa (20-30km)
  if (distance <= 50) return 25000   // Tỉnh lân cận gần (30-50km)
  if (distance <= 80) return 28000   // Tỉnh lân cận (50-80km)
  if (distance <= 120) return 32000  // Tỉnh lân cận xa (80-120km)
  if (distance <= 200) return 35000  // Miền gần (120-200km)
  if (distance <= 300) return 38000  // Miền trung bình (200-300km)
  if (distance <= 500) return 42000  // Miền xa (300-500km)
  if (distance <= 700) return 45000  // Toàn quốc gần (500-700km)
  if (distance <= 1000) return 48000 // Toàn quốc xa (700-1000km)
  return 52000                       // Toàn quốc rất xa (>1000km)
}

const getShippingZone = (distance: number) => {
  // Cập nhật zones theo hệ thống phí ship mới
  if (distance <= 3) return 'Nội thành (miễn phí)'
  if (distance <= 5) return 'Nội thành gần'
  if (distance <= 10) return 'Nội thành xa'
  if (distance <= 15) return 'Ngoại thành gần'
  if (distance <= 20) return 'Ngoại thành'
  if (distance <= 30) return 'Ngoại thành xa'
  if (distance <= 50) return 'Tỉnh lân cận gần'
  if (distance <= 80) return 'Tỉnh lân cận'
  if (distance <= 120) return 'Tỉnh lân cận xa'
  if (distance <= 200) return 'Miền gần'
  if (distance <= 300) return 'Miền trung bình'
  if (distance <= 500) return 'Miền xa'
  if (distance <= 700) return 'Toàn quốc gần'
  if (distance <= 1000) return 'Toàn quốc xa'
  return 'Toàn quốc rất xa'
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
  if (selectedVoucher.value) {
    const voucher = selectedVoucher.value
    
    // Theo database: loai = 0 là phần trăm, loai = 1 là tiền mặt
    if (voucher.loai === 0) {
      // Giảm theo phần trăm
      return subtotal.value * (voucher.giaTri / 100)
    } else if (voucher.loai === 1) {
      // Giảm theo số tiền cố định
      return Math.min(voucher.giaTri, subtotal.value)
    } else {
      // Fallback - nếu không rõ loại, thử đoán từ giá trị
      if (voucher.giaTri <= 100) {
        // Có thể là phần trăm
        return subtotal.value * (voucher.giaTri / 100)
      } else {
        // Có thể là số tiền cố định
        return Math.min(voucher.giaTri, subtotal.value)
      }
    }
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

// Function hiển thị toast notification
const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  switch (type) {
    case 'success':
      toast.success(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      })
      break
    case 'error':
      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      })
      break
    case 'warning':
      toast.warning(message, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      })
      break
    default:
      toast.info(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      })
  }
}

const searchProducts = async () => {
  if (searchQuery.value.trim()) {
    try {
      searchResults.value = await thanhToanApi.timKiemSanPham(searchQuery.value)
    } catch (error) {
      console.error('Lỗi tìm kiếm sản phẩm:', error)
      searchResults.value = []
    }
  } else {
    searchResults.value = []
  }
}

// Dialog khách hàng
// Dialog sản phẩm
const openProductModal = async () => {
  console.log('🔵 MỞ MODAL CHỌN SẢN PHẨM')
  
  showProductModal.value = true
  
  // Luôn gọi API mới khi mở modal
  await fetchProducts()
}

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

const filterCustomerList = async () => {
  const kw = customerSearch.value.trim()
  if (!kw) {
    filteredCustomers.value = [...customers.value]
    return
  }
  
  try {
    // Sử dụng API tìm kiếm
    filteredCustomers.value = await khachHangApi.timKiem(kw)
  } catch (error) {
    console.error('Lỗi tìm kiếm khách hàng:', error)
    // Fallback tìm kiếm local
    filteredCustomers.value = customers.value.filter((c: any) =>
      (c.hoTen && c.hoTen.toLowerCase().includes(kw.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(kw.toLowerCase())) ||
      (c.soDienThoai && String(c.soDienThoai).includes(kw))
    )
  }
}

const chooseCustomer = (cus: any) => {
  selectedCustomer.value = cus
  customerInfo.value.ten = cus.hoTen || ''
  customerInfo.value.sdt = String(cus.soDienThoai || '')
  showCustomerModal.value = false
  
  // Hiển thị thông báo chọn khách hàng thành công
  showToast(`Đã chọn khách hàng: ${cus.hoTen}`, 'success')
}

const openQuickAddCustomer = () => {
  quickCustomer.value = { hoTen: '', soDienThoai: '', email: '' }
  showQuickAddModal.value = true
}

const saveQuickCustomer = async () => {
  const payload = {
    hoTen: quickCustomer.value.hoTen?.trim(),
    soDienThoai: String(quickCustomer.value.soDienThoai || '').trim(),
    email: quickCustomer.value.email?.trim() || ''
  }
  if (!payload.hoTen || !payload.soDienThoai) {
    showToast('Vui lòng nhập Họ tên và Số điện thoại', 'error')
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
    
    // Hiển thị thông báo thành công
    showToast('Thêm khách hàng thành công!', 'success')
  } catch (e) {
    console.error('Lỗi khi thêm khách hàng:', e)
    showToast('Có lỗi xảy ra khi thêm khách hàng', 'error')
  }
}

const addToCart = (product: any) => {
  // Điều hướng sang trang chọn size/màu
  sessionStorage.setItem('selectedProduct', JSON.stringify(product))
  showToast(`Đã chọn sản phẩm: ${product.tenSanPham}`, 'info')
  router.push('/quan-ly/ban-hang/chon-thuoc-tinh')
}

const removeFromCart = (item: any) => {
  const index = cartItems.value.findIndex((cartItem) => cartItem.stt === item.stt)
  if (index > -1) {
    cartItems.value.splice(index, 1)
    showToast(`Đã xóa sản phẩm: ${item.tenSanPham}`, 'warning')
  }
  saveOrderState()
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
  saveOrderState()
}

const clearCart = () => {
  if (cartItems.value.length > 0) {
    cartItems.value = []
    cartItemId = 1
    saveOrderState()
    showToast('Đã xóa tất cả sản phẩm khỏi giỏ hàng', 'warning')
  }
}


const applyDiscount = async () => {
  const code = (discountCode.value || '').trim()
  if (!code) {
    discountInfo.value = ''
    discountType.value = 'info'
    selectedVoucher.value = null
    saveOrderState()
    showToast('Đã xóa mã giảm giá', 'info')
    return
  }
  
  try {
    showToast('Đang kiểm tra mã giảm giá...', 'info')
    
    // Gọi API validate voucher
    const result = await voucherApi.validate(code)
    
    if (result.success && result.voucher) {
      const voucher = result.voucher
      
      // Kiểm tra điều kiện đơn hàng tối thiểu
      const totalOrderAmount = cartItems.value.reduce((sum, item) => sum + item.tongTien, 0)
      if (voucher.dieuKien && voucher.dieuKien > totalOrderAmount) {
        discountInfo.value = `Đơn hàng tối thiểu ${formatCurrency(voucher.dieuKien)}`
        discountType.value = 'warning'
        showToast(`❌ Đơn hàng chưa đạt điều kiện tối thiểu ${formatCurrency(voucher.dieuKien)}!`, 'warning')
        selectedVoucher.value = null
        saveOrderState()
        return
      }
      
      // Validation bổ sung cho voucher
      if (!voucher.giaTri || voucher.giaTri <= 0) {
        discountInfo.value = 'Voucher có giá trị không hợp lệ'
        discountType.value = 'error'
        selectedVoucher.value = null
        showToast('❌ Voucher có giá trị không hợp lệ!', 'error')
        saveOrderState()
        return
      }
      
      // Lưu thông tin voucher
      selectedVoucher.value = voucher
      
      // Hiển thị thông tin voucher chi tiết
      let discountText = ''
      if (voucher.loai === 0) {
        // Giảm theo phần trăm
        discountText = `${voucher.giaTri}%`
      } else if (voucher.loai === 1) {
        // Giảm theo số tiền cố định
        discountText = formatCurrency(voucher.giaTri)
      } else {
        // Fallback - nếu không rõ loại, thử đoán từ giá trị
        if (voucher.giaTri <= 100) {
          discountText = `${voucher.giaTri}%`
        } else {
          discountText = formatCurrency(voucher.giaTri)
        }
      }
      discountInfo.value = `✅ ${voucher.ten} - Giảm ${discountText} (Còn ${voucher.soLuong} lượt)`
      discountType.value = 'success'
      showToast(`✅ Áp dụng mã giảm giá "${voucher.ten}" thành công!`, 'success')
      
    } else {
      discountInfo.value = 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
      discountType.value = 'error'
      selectedVoucher.value = null
      showToast('❌ Mã giảm giá không hợp lệ hoặc đã hết hạn!', 'error')
    }
    
  } catch (error) {
    console.error('Lỗi khi validate voucher:', error)
    discountInfo.value = 'Lỗi khi kiểm tra mã giảm giá'
    discountType.value = 'error'
    selectedVoucher.value = null
    showToast('❌ Lỗi khi kiểm tra mã giảm giá!', 'error')
  }
  
  saveOrderState()
}

const confirmPayment = () => {
  // Validation trước khi hiển thị dialog confirm
  if (cartItems.value.length === 0) {
    showToast('Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán', 'warning')
    return
  }
  
  if (isDelivery.value && !fullAddress.value) {
    showToast('Vui lòng chọn địa chỉ giao hàng đầy đủ!', 'warning')
    return
  }

  // Hiển thị dialog confirm thanh toán
  showPaymentConfirmDialog.value = true
}

const processPayment = async () => {
  // Đóng dialog confirm
  showPaymentConfirmDialog.value = false

  // Hiển thị loading
  showToast('Đang xử lý thanh toán...', 'info')

  try {
    // Validation chi tiết trước khi gửi
    if (cartItems.value.length === 0) {
      throw new Error('Chi tiết đơn hàng không được trống')
    }
    
    // Đảm bảo tất cả sản phẩm có ID hợp lệ
    const invalidItems = cartItems.value.filter(item => 
      !item.chiTietSanPhamId && !item.id
    )
    if (invalidItems.length > 0) {
      throw new Error('Có sản phẩm không có ID hợp lệ')
    }
    
    const orderData = {
      maHoaDon: orderId.value,
      khachHangId: selectedCustomer.value?.id || null,
      diaChiGiaoHang: isDelivery.value ? fullAddress.value : null,
      phiGiaoHang: parseFloat(String(deliveryFee.value)) || 0.0,
      maGiamGia: discountCode.value || null,
      phuongThucThanhToan: paymentMethod.value,
      tongTien: parseFloat(String(totalAmount.value)),
      trangThai: 1,
      ghiChu: `Bán hàng tại quầy - ${new Date().toLocaleDateString('vi-VN')}`,
      nguoiTao: 'Admin',
      chiTietDonHang: cartItems.value.map(item => {
        console.log('🔍 Item để gửi:', item)
        
        // Lấy chiTietSanPhamId từ item (đã được set khi thêm vào giỏ)
        const sanPhamId = item.chiTietSanPhamId || item.id
        
        console.log('🔍 sanPhamId được chọn:', sanPhamId)
        console.log('🔍 Item data:', {
          chiTietSanPhamId: item.chiTietSanPhamId,
          id: item.id,
          maSanPham: item.maSanPham
        })
        
        const finalSanPhamId = parseInt(String(sanPhamId))
        
        if (!finalSanPhamId || isNaN(finalSanPhamId)) {
          throw new Error(`Sản phẩm "${item.tenSanPham}" không có ID hợp lệ`)
        }
        
        return {
          sanPhamId: finalSanPhamId,
          soLuong: parseInt(String(item.soLuong)) || 1,
          donGia: parseFloat(String(item.giaBan)) || 0.0,
          thanhTien: parseFloat(String(item.tongTien)) || 0.0,
          kichThuoc: item.kichThuoc || 'Không xác định',
          mauSac: item.mauSac || 'Không xác định'
        }
      })
    }

    console.log('Dữ liệu gửi lên server:', orderData)
    
    // Gửi lên server
    const result = await thanhToanApi.taoHoaDon(orderData)
    console.log('Kết quả từ server:', result)
    
    // Nếu có voucher được sử dụng, trừ số lượng voucher
    if (selectedVoucher.value && discountCode.value) {
      try {
        await voucherApi.use(discountCode.value)
        console.log('✅ Đã trừ số lượng voucher:', discountCode.value)
      } catch (voucherError) {
        console.error('Lỗi khi trừ số lượng voucher:', voucherError)
        // Không throw error vì đơn hàng đã thành công, chỉ log lỗi
      }
    }
    
    // Thông báo thành công và hiển thị dialog hỏi in hóa đơn
    showToast(`✅ Thanh toán thành công! Mã đơn hàng: ${orderId.value}`, 'success')
    
    // Hiển thị dialog hỏi có muốn in hóa đơn không
    setTimeout(() => {
      showPrintConfirmDialog.value = true
    }, 1000) // Delay 1s để hiển thị toast trước
    
  } catch (error: any) {
    console.error('Lỗi xử lý thanh toán:', error)
    
    // Xử lý các loại lỗi khác nhau
    let errorMessage = 'Có lỗi xảy ra khi xử lý thanh toán!'
    
    if (error.response?.status === 400) {
      errorMessage = 'Dữ liệu thanh toán không hợp lệ!'
    } else if (error.response?.status === 500) {
      errorMessage = 'Lỗi server! Vui lòng thử lại sau!'
    } else if (error.message?.includes('Network')) {
      errorMessage = 'Lỗi kết nối! Kiểm tra internet và thử lại!'
    }
    
    showToast(errorMessage, 'error')
  }
}

const printReceiptAndClose = () => {
  try {
    const receiptContent = generateReceiptContent()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(receiptContent)
      printWindow.document.close()
      printWindow.print()
      showToast('Đã gửi hóa đơn đến máy in!', 'success')
    } else {
      showToast('Không thể mở cửa sổ in! Vui lòng kiểm tra popup blocker', 'error')
    }
  } catch (error) {
    console.error('Lỗi khi in hóa đơn:', error)
    showToast('Có lỗi khi in hóa đơn!', 'error')
  } finally {
    // Đóng dialog và reset form
    showPrintConfirmDialog.value = false
    setTimeout(() => {
      resetForm()
    }, 1000)
  }
}

const skipPrint = () => {
  showPrintConfirmDialog.value = false
  showToast('Đã bỏ qua in hóa đơn', 'info')
  setTimeout(() => {
    resetForm()
  }, 1000)
}

const generateReceiptContent = () => {
  return `
    <html>
      <head>
        <title>Hóa đơn #${orderId.value}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 20px; }
          .customer-info { margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; }
          .customer-info h4 { margin: 0 0 8px 0; color: #2c3e50; }
          .customer-info p { margin: 3px 0; font-size: 14px; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-weight: bold; font-size: 18px; }
          .divider { border-top: 1px solid #ccc; margin: 10px 0; }
          .shipping-detail { background-color: #e8f4f8; padding: 8px; border-radius: 5px; margin: 5px 0; }
          .shipping-detail p { margin: 2px 0; font-size: 12px; color: #2c3e50; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>ONESTEP</h2>
          <p>Hóa đơn #${orderId.value}</p>
          <p>${new Date().toLocaleString('vi-VN')}</p>
        </div>
        
        ${selectedCustomer.value ? `
        <div class="customer-info">
          <h4>Thông tin khách hàng:</h4>
          <p><strong>Tên:</strong> ${selectedCustomer.value.hoTen || 'Khách lẻ'}</p>
          <p><strong>Số điện thoại:</strong> ${selectedCustomer.value.soDienThoai || 'Không có'}</p>
          ${selectedCustomer.value.email ? `<p><strong>Email:</strong> ${selectedCustomer.value.email}</p>` : ''}
        </div>
        ` : `
        <div class="customer-info">
          <h4>Thông tin khách hàng:</h4>
          <p><strong>Khách hàng:</strong> Khách lẻ</p>
        </div>
        `}
        
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
        <div class="shipping-detail">
          <div class="item"><span>Phí giao hàng:</span><span>${formatCurrency(deliveryFee.value)}</span></div>
          ${shippingInfo.value ? `
          <p><strong>Khu vực:</strong> ${shippingInfo.value.zone}</p>
          <p><strong>Khoảng cách:</strong> Từ ${shippingInfo.value.from} → ${shippingInfo.value.distance}km</p>
          <p><strong>Phí ship được tính theo khoảng cách thực tế</strong></p>
          ` : ''}
        </div>
        ` : ''}
        ${discountAmount.value > 0 ? `
        <div class="item"><span>Giảm giá:</span><span>-${formatCurrency(discountAmount.value)}</span></div>
        ` : ''}
        <div class="divider"></div>
        <div class="item total"><span>Tổng thanh toán:</span><span>${formatCurrency(totalAmount.value)}</span></div>
        <div class="divider"></div>
        <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethodName()}</p>
        ${isDelivery.value ? `<p><strong>Địa chỉ giao hàng:</strong> ${fullAddress.value}</p>` : ''}
        <div style="text-align: center; margin-top: 30px;"><p>Cảm ơn quý khách!</p></div>
      </body>
    </html>
  `
}

const getPaymentMethodName = () => {
  return paymentMethod.value === 'bank' ? 'Chuyển khoản' : 'Tiền mặt'
}

// Chuẩn hóa hiển thị màu sắc: nhận giá trị ('red' | '#f00' | 'Đỏ' ...) -> trả về mã màu & nhãn
const colorMap: Record<string, { label: string; hex: string }> = {
  red: { label: 'Đỏ', hex: '#ff0000' },
  blue: { label: 'Xanh dương', hex: '#1e88e5' },
  black: { label: 'Đen', hex: '#000000' },
  white: { label: 'Trắng', hex: '#ffffff' },
  pink: { label: 'Hồng', hex: '#e91e63' }
}

const normalizeKey = (val: string) => (val || '').toString().trim().toLowerCase()

const resolveColor = (val: string) => {
  const key = normalizeKey(val)
  if (colorMap[key]) return colorMap[key].hex
  // nếu người dùng truyền sẵn mã màu hợp lệ (#abc, #aabbcc, rgb(...)) thì trả về trực tiếp
  if (/^#([0-9a-f]{3}){1,2}$/i.test(val)) return val
  return '#9e9e9e' // mặc định xám khi không map được
}

const getColorLabel = (val: string) => {
  const key = normalizeKey(val)
  if (colorMap[key]) return colorMap[key].label
  return val || 'Không rõ'
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
  discountType.value = 'info'
  selectedVoucher.value = null
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
  saveOrderState()
  showToast('Đã tạo hóa đơn mới!', 'success')
}

const cancelOrder = () => {
  resetForm()
  sessionStorage.removeItem(ORDER_STATE_KEY)
  showToast('Đã hủy hóa đơn', 'warning')
}

// Hàm tải danh sách sản phẩm từ API
const fetchProducts = async () => {
  console.log('🚀 BẮT ĐẦU GỌI API SẢN PHẨM')
  isLoadingProducts.value = true
  allProducts.value = [] // Reset dữ liệu cũ
  
  try {
    // Gọi API sản phẩm chung với đầy đủ thông tin từ database
    console.log('📞 Gọi API SẢN PHẨM: http://localhost:8080/san-pham/hien-thi')
    
    const response = await fetch('http://localhost:8080/san-pham/hien-thi', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    console.log('📡 Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const products = await response.json()
    console.log('🔥 RAW API DATA:', products)
    console.log('🔥 Type:', typeof products)
    console.log('🔥 Is Array:', Array.isArray(products))
    console.log('🔥 Length:', products?.length)
    
    if (!Array.isArray(products)) {
      throw new Error('API không trả về array')
    }
    
    if (products.length === 0) {
      console.warn('⚠️ API trả về 0 sản phẩm')
      allProducts.value = []
      return
    }
    
    // Map dữ liệu từ API san-pham/hien-thi (đã bổ sung thông tin chi tiết)
    const mappedProducts = products.map((item, index) => {
      console.log(`🔄 Mapping SAN PHAM ${index + 1}:`, item)
      return {
        id: item.maSanPham, // Sử dụng maSanPham làm ID
        maSanPham: item.maCode,
        tenSanPham: item.tenSanPham,
        anh: item.duongDanAnh,
        giaBan: item.giaBan, // Từ chi tiết sản phẩm
        mauSac: item.tenMauSac, // Từ chi tiết sản phẩm
        kichThuoc: item.tenKichThuoc, // Từ chi tiết sản phẩm
        tonKho: item.soLuongTon, // Từ chi tiết sản phẩm
        trangThai: item.trangThai
      }
    })
    
    console.log('✅ MAPPED PRODUCTS:', mappedProducts)
    allProducts.value = mappedProducts
    console.log('✅ allProducts.value updated:', allProducts.value.length, 'items')
    
  } catch (error: any) {
    console.error('❌ LỖI KHI GỌI API:', error)
    showToast(`Không thể tải danh sách sản phẩm: ${error.message}`, 'error')
    allProducts.value = []
  } finally {
    isLoadingProducts.value = false
    console.log('🏁 HOÀN THÀNH fetchProducts')
  }
}

onMounted(async () => {
  console.log('🟢 COMPONENT MOUNTED')
  
  // Khôi phục trạng thái đơn nếu có
  loadOrderState()
  
  // KHÔNG gọi fetchProducts ở đây - chỉ gọi khi mở modal
  
  // Khi quay lại từ trang chọn thuộc tính, nhận dữ liệu và thêm vào giỏ
  const pending = sessionStorage.getItem('cartAddItem')
  if (pending) {
    try {
      const parsed = JSON.parse(pending)
      const chosen = { ...parsed.product, kichThuoc: parsed.size, mauSac: parsed.color }
      const existingItem = cartItems.value.find((item) => item.maSanPham === chosen.maSanPham && item.kichThuoc === chosen.kichThuoc && item.mauSac === chosen.mauSac)
      if (existingItem) {
        existingItem.soLuong += 1
        existingItem.tongTien = existingItem.soLuong * existingItem.giaBan
      } else {
        const newItem = { 
          stt: cartItemId++, 
          id: chosen.id, 
          chiTietSanPhamId: chosen.chiTietSanPhamId || chosen.id,
          maSanPham: chosen.maSanPham, 
          tenSanPham: chosen.tenSanPham, 
          anh: chosen.anh, 
          soLuong: 1, 
          giaBan: chosen.giaBan, 
          kichThuoc: chosen.kichThuoc, 
          mauSac: chosen.mauSac, 
          tongTien: chosen.giaBan 
        }
        cartItems.value.push(newItem)
      }
    } catch (e) {}
    sessionStorage.removeItem('cartAddItem')
  }
  // Bất kỳ thay đổi nào ở giỏ hoặc trạng thái chính sẽ được lưu định kỳ
  saveOrderState()
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

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.2);
  display: inline-block;
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



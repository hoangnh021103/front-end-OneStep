<template>
    <div class="discount-container">
        <header class="header">
            <h2>Quản lý đợt giảm giá</h2>
            <div class="filters">
                <input v-model="filters.code" type="text" class="search-input"
                    placeholder="Nhập mã / tên đợt để tìm kiếm.." />
                <select v-model="filters.status" class="status-select">
                    <option value="">Chọn trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="expired">Hết hạn</option>
                </select>
                <button class="reset-btn" @click="resetFilters"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
            </div>
            <button class="add-btn" @click="openAddModal"><i class="fa fa-plus"></i> Thêm mới đợt giảm giá</button>
        </header>

        <div class="table-wrapper">
            <p class="table-info">{{ filteredDiscounts.length }} đợt giảm giá</p>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã</th>
                        <th>Tên Đợt</th>
                        <th>Giá trị giảm</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(discount, index) in paginatedDiscounts" :key="discount.id">
                        <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
                        <td>{{ discount.code }}</td>
                        <td>{{ discount.name }}</td>
                        <td>{{ discount.value }}</td>
                        <td>{{ discount.startDate }}</td>
                        <td>{{ discount.endDate }}</td>
                        <td>
                            <span :class="['status', discount.status === 'active' ? 'active' : 'inactive']">
                                {{ discount.status === 'active' ? 'Đang hoạt động' : 'Hết hạn' }}
                            </span>
                        </td>
                        <td class="action-buttons">
                            <button class="edit-btn" title="Sửa" @click="openEditModal(discount)"><i class="fa fa-edit"></i></button>
                            <button class="delete-btn" title="Xóa" @click="deleteDiscount(discount.id)"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr v-if="filteredDiscounts.length === 0">
                        <td colspan="8" class="no-data">
                            <div class="empty-state">
                                <div class="empty-icon"><i class="fa fa-percent"></i></div>
                                <div class="empty-text">Chưa có đợt giảm giá nào</div>
                                <div class="empty-subtext">Nhấn "Thêm mới đợt giảm giá" để tạo đợt giảm giá đầu tiên</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Phân trang -->
            <div class="pagination">
                <button :disabled="currentPage === 1" @click="currentPage--">‹</button>
                <span v-for="p in totalPages" :key="p" :class="['page', { active: p === currentPage }]"
                    @click="currentPage = p">
                    {{ p }}
                </span>
                <button :disabled="currentPage === totalPages" @click="currentPage++">›</button>
                <select v-model.number="pageSize" @change="currentPage = 1">
                    <option :value="5">5 / page</option>
                    <option :value="10">10 / page</option>
                    <option :value="20">20 / page</option>
                </select>
            </div>
        </div>

        <!-- Modal thêm/sửa -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal">
                <h3>{{ editingId ? "Sửa đợt giảm giá" : "Thêm mới đợt giảm giá" }}</h3>
                <form @submit.prevent="saveDiscount">
                    <label>Mã:</label>
                    <input v-model="form.code" required />
                    <label>Tên đợt:</label>
                    <input v-model="form.name" required />
                    <label>Giá trị giảm:</label>
                    <input v-model="form.value" required />
                    <label>Ngày bắt đầu:</label>
                    <input type="date" v-model="form.startDate" required />
                    <label>Ngày kết thúc:</label>
                    <input type="date" v-model="form.endDate" required />
                    <label>Trạng thái:</label>
                    <select v-model="form.status" required>
                        <option value="active">Đang hoạt động</option>
                        <option value="expired">Hết hạn</option>
                    </select>
                    <div class="modal-actions">
                        <button type="submit" class="save-btn"><i class="fa fa-check"></i> Lưu</button>
                        <button type="button" class="cancel-btn" @click="closeModal"><i class="fa fa-times"></i> Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import '@/scss/pages/dot-giam-gia.scss'
import { reactive, ref, computed } from "vue";

const filters = reactive({ code: "", status: "" });

const discounts = ref([]);

const currentPage = ref(1);
const pageSize = ref(5);
const showModal = ref(false);
const editingId = ref(null);
const form = reactive({ code: "", name: "", value: "", startDate: "", endDate: "", status: "active" });

const filteredDiscounts = computed(() => {
    return discounts.value.filter(d => {
        const matchCodeName =
            !filters.code ||
            (d.code && d.code.toLowerCase().includes(filters.code.toLowerCase())) ||
            (d.name && d.name.toLowerCase().includes(filters.code.toLowerCase()));
        const matchStatus = !filters.status || d.status === filters.status;
        return matchCodeName && matchStatus;
    });
});
const totalPages = computed(() => Math.ceil(filteredDiscounts.value.length / pageSize.value) || 1);
const paginatedDiscounts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredDiscounts.value.slice(start, start + pageSize.value);
});

const resetFilters = () => { filters.code = ""; filters.status = ""; currentPage.value = 1; };

const openAddModal = () => { editingId.value = null; Object.assign(form, { code: "", name: "", value: "", startDate: "", endDate: "", status: "active" }); showModal.value = true; };
const openEditModal = (discount) => { editingId.value = discount.id; Object.assign(form, { ...discount }); showModal.value = true; };
const closeModal = () => { showModal.value = false; };

const saveDiscount = () => {
    if (editingId.value) {
        const index = discounts.value.findIndex(d => d.id === editingId.value);
        if (index !== -1) discounts.value[index] = { ...form, id: editingId.value };
    } else {
        const newId = Math.max(0, ...discounts.value.map(d => d.id)) + 1;
        discounts.value.push({ ...form, id: newId });
    }
    closeModal();
};

const deleteDiscount = (id) => {
    if (confirm("Bạn có chắc muốn xóa đợt giảm giá này?")) {
        discounts.value = discounts.value.filter(d => d.id !== id);
    }
};
</script>

<style scoped>
/* Empty state styles */
.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
}
</style>


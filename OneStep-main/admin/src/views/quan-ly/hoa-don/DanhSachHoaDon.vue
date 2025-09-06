<template>
    <div class="main-layout">
        <!-- Sidebar -->
       
        <!-- Main content -->
        <div class="content">
            <!-- Header -->
            <header class="header">
                <div></div>
            </header>
            <div class="page-title">
                <h2>Quản lý hóa đơn</h2>
            </div>
            <!-- Filter -->
            <div class="filter-box">
                <div class="filter-title">Bộ lọc tìm kiếm</div>
                <div class="filter-controls">
                    <input v-model="search" placeholder="Nhập tên khách hàng, sđt, tên nhân viên..." />
                    <input type="date" v-model="fromDate" />
                    <input type="date" v-model="toDate" />
                    <button @click="resetFilter">Đặt lại bộ lọc</button>
                </div>
            </div>
            <!-- Tabs -->
            <div class="tab-section">
                <span :class="['tab', {active: tab==='all'}]" @click="tab='all'">Tất cả <span class="tab-badge">{{ filteredInvoices.length }}</span></span>
                <span :class="['tab', {active: tab==='pending'}]" @click="tab='pending'">Chờ xác nhận <span class="tab-badge">{{ countByStatus('pending') }}</span></span>
                <span :class="['tab', {active: tab==='confirmed'}]" @click="tab='confirmed'">Đã xác nhận <span class="tab-badge">{{ countByStatus('confirmed') }}</span></span>
                <span :class="['tab', {active: tab==='shipping'}]" @click="tab='shipping'">Chờ giao <span class="tab-badge">{{ countByStatus('shipping') }}</span></span>
                <span :class="['tab', {active: tab==='delivering'}]" @click="tab='delivering'">Đang giao <span class="tab-badge">{{ countByStatus('delivering') }}</span></span>
                <span :class="['tab', {active: tab==='done'}]" @click="tab='done'">Hoàn thành <span class="tab-badge">{{ countByStatus('done') }}</span></span>
                <span :class="['tab', {active: tab==='cancel'}]" @click="tab='cancel'">Đã hủy <span class="tab-badge">{{ countByStatus('cancel') }}</span></span>
            </div>
            <!-- Table -->
            <div class="table-section">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã Hóa Đơn</th>
                            <th>Tên Khách Hàng</th>
                            <th>SDT Khách Hàng</th>
                            <th>Loại Hóa Đơn</th>
                            <th>Mã Nhân Viên</th>
                            <th>Tên Nhân Viên</th>
                            <th>Tổng Tiền</th>
                            <th>Ngày Tạo</th>
                            <th>Trạng thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="tabInvoices.length === 0">
                            <td colspan="11" class="no-data">
                                <div class="empty-state">
                                    <div class="empty-icon">🧾</div>
                                    <div class="empty-text">Chưa có hóa đơn nào</div>
                                    <div class="empty-subtext">Dữ liệu hóa đơn sẽ hiển thị ở đây</div>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="(inv, idx) in tabInvoices" :key="inv.id">
                            <td>{{ idx + 1 }}</td>
                            <td>{{ inv.code }}</td>
                            <td>{{ inv.customerName }}</td>
                            <td>{{ inv.customerPhone }}</td>
                            <td>
                                <span class="type-badge">{{ inv.type }}</span>
                            </td>
                            <td>{{ inv.staffCode }}</td>
                            <td>{{ inv.staffName }}</td>
                            <td>{{ inv.total }}</td>
                            <td>{{ formatDate(inv.createdAt) }}</td>
                            <td>
                                <span :class="['status-badge', inv.statusClass]">{{ inv.statusLabel }}</span>
                            </td>
                            <td>
                                <button class="action-btn" title="Xem chi tiết">
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5c-7 0-9 7-9 7s2 7 9 7 9-7 9-7-2-7-9-7zm0 12c-4.418 0-7.364-3.134-8.484-5C4.636 8.134 7.582 5 12 5s7.364 3.134 8.484 5C19.364 13.866 16.418 17 12 17zm0-10a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z" fill="#444"/></svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import '@/scss/pages/hoa-don.scss'
export default {
    name: 'HoaDon',
    data() {
        return {
            search: '',
            fromDate: '',
            toDate: '',
            tab: 'all',
            invoices: []
        }
    },
    computed: {
        filteredInvoices() {
            return this.invoices
                .filter(inv => {
                    const matchSearch = this.search === '' ||
                        inv.customerName.toLowerCase().includes(this.search.toLowerCase()) ||
                        inv.customerPhone.includes(this.search) ||
                        inv.staffName.toLowerCase().includes(this.search.toLowerCase());
                    const matchFrom = !this.fromDate || inv.createdAt >= this.fromDate;
                    const matchTo = !this.toDate || inv.createdAt <= this.toDate;
                    return matchSearch && matchFrom && matchTo;
                })
                .map(inv => ({
                    ...inv,
                    statusLabel: this.statusLabel(inv.status),
                    statusClass: inv.status
                }));
        },
        tabInvoices() {
            if (this.tab === 'all') return this.filteredInvoices;
            return this.filteredInvoices.filter(inv => inv.status === this.tab);
        }
    },
    methods: {
        resetFilter() {
            this.search = '';
            this.fromDate = '';
            this.toDate = '';
        },
        countByStatus(status) {
            return this.filteredInvoices.filter(inv => inv.status === status).length;
        },
        formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString('vi-VN');
        },
        statusLabel(status) {
            switch (status) {
                case 'pending': return 'Chờ xác nhận';
                case 'confirmed': return 'Đã xác nhận';
                case 'shipping': return 'Chờ giao';
                case 'delivering': return 'Đang giao';
                case 'done': return 'Hoàn thành';
                case 'cancel': return 'Đã hủy';
                default: return '';
            }
        }
    }
}
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

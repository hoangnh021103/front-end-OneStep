<template>
    <div class="main-layout">
        <!-- Sidebar -->
       
        <!-- Main content -->
        <div class="content">
            <!-- Header -->
            <header class="header">
                <div></div>
                <div class="user-info"> 
                    <span>Dường Phúc Hình</span>
                    <img class="avatar" src="https://ui-avatars.com/api/?name=Nguyen+Trung+Hieu" alt="avatar" />
                </div>
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
export default {
    name: 'HoaDon',
    data() {
        return {
            search: '',
            fromDate: '',
            toDate: '',
            tab: 'all',
            invoices: [
                {
                    id: 1, code: 'HD3420', customerName: 'Nguyễn Trung Hiếu', customerPhone: '0123456789',
                    type: 'OFFLINE', staffCode: 'hieu123', staffName: 'Nguyễn Trung Hiếu',
                    total: '0 đ', createdAt: '2025-07-24', status: 'pending'
                },
                {
                   id: 1, code: 'HD3420', customerName: 'Nguyễn Trung Hiếu', customerPhone: '0123456789',
                    type: 'OFFLINE', staffCode: 'hieu123', staffName: 'Nguyễn Trung Hiếu',
                    total: '0 đ', createdAt: '2025-07-24', status: 'pending'
                },
                {
                    id: 3, code: 'HD6662', customerName: 'Nguyễn Trung Hiếu', customerPhone: '0123456789',
                    type: 'OFFLINE', staffCode: 'hieu123', staffName: 'Nguyễn Trung Hiếu',
                    total: '2.500.000 đ', createdAt: '2025-07-24', status: 'done'
                },
                {
                    id: 4, code: 'HD1472', customerName: 'Nguyễn Trung Hiếu', customerPhone: '0123456789',
                    type: 'OFFLINE', staffCode: 'Duy8726', staffName: 'Nguyễn Trung Hiếu',
                    total: '0 đ', createdAt: '2025-07-24', status: 'pending'
                }
            ]
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
.main-layout {
    display: flex;
    min-height: 100vh;
    background: #f7f8fa;
}
.sidebar {
    width: 220px;
    background: #fff;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    padding: 0;
}
.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 18px 12px 18px;
    font-weight: bold;
    font-size: 1.2rem;
    color: #222;
}
.logo img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
}
.sidebar nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.sidebar nav li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    color: #444;
    cursor: pointer;
    border-radius: 8px;
    margin: 2px 8px;
    transition: background 0.2s;
}
.sidebar nav li.active, .sidebar nav li:hover {
    background: #e6f7e6;
    color: #22c55e;
}
.sidebar .icon {
    font-size: 1.2em;
}
.content {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 18px 32px 0 32px;
    background: #f7f8fa;
}
.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 500;
}
.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #eee;
}
.page-title {
    padding: 0 32px 0 32px;
    margin-top: 8px;
}
.page-title h2 {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0;
}
.filter-box {
    background: #fff;
    border-radius: 8px;
    margin: 18px 32px 0 32px;
    padding: 18px 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.filter-title {
    font-weight: 600;
    margin-bottom: 12px;
    font-size: 1.1rem;
}
.filter-controls {
    display: flex;
    gap: 18px;
    align-items: center;
}
.filter-controls input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
}
.filter-controls button {
    background: #444;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 18px;
    cursor: pointer;
    font-weight: 500;
}
.tab-section {
    display: flex;
    gap: 18px;
    margin: 18px 32px 0 32px;
    align-items: center;
}
.tab {
    background: #f5f5f5;
    border-radius: 18px;
    padding: 6px 18px;
    font-weight: 500;
    cursor: pointer;
    color: #444;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s;
}
.tab.active {
    background: #e6f7e6;
    color: #22c55e;
}
.tab-badge {
    background: #ff4d4f;
    color: #fff;
    border-radius: 50%;
    font-size: 0.95em;
    padding: 2px 8px;
    margin-left: 2px;
    font-weight: 600;
}
.table-section {
    background: #fff;
    border-radius: 8px;
    margin: 18px 32px 0 32px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    overflow-x: auto;
}
table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1rem;
    background: #fff;
}
th, td {
    padding: 10px 8px;
    border-bottom: 1px solid #f2f2f2;
    text-align: left;
    vertical-align: middle;
}
.type-badge {
    background: #e6f7ff;
    color: #1890ff;
    border-radius: 8px;
    padding: 2px 10px;
    font-size: 0.98rem;
    font-weight: 600;
    display: inline-block;
}
.status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.98rem;
}
.status-badge.pending {
    background: #fffbe6;
    color: #f59e42;
}
.status-badge.confirmed {
    background: #e6f7ff;
    color: #1890ff;
}
.status-badge.shipping {
    background: #fffbe6;
    color: #f59e42;
}
.status-badge.delivering {
    background: #e6f7ff;
    color: #1890ff;
}
.status-badge.done {
    background: #e6f7e6;
    color: #22c55e;
}
.status-badge.cancel {
    background: #ffe6e6;
    color: #ff4d4f;
}
.action-btn {
    background: #f5f5f5;
    border: none;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    transition: background 0.2s;
}
.action-btn:hover {
    background: #e6f7e6;
}
@media (max-width: 900px) {
    .sidebar {
        display: none;
    }
    .header, .filter-box, .tab-section, .table-section, .page-title {
        margin-left: 8px;
        margin-right: 8px;
        padding-left: 8px;
        padding-right: 8px;
    }
    .table-section {
        padding: 8px;
    }
}
</style>

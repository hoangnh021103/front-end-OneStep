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
                    <input v-model="search" placeholder="Nhập tên khách hàng, sđt, mã đơn..." />
                    <input type="date" v-model="fromDate" />
                    <input type="date" v-model="toDate" />
                    <button @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
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
                            <th>Mã Đơn</th>
                            <th>Tên Khách Hàng</th>
                            <th>SĐT Khách Hàng</th>
                            <th>Loại Đơn</th>
                            <th>Email</th>
                            <th>Tổng Tiền</th>
                            <th>Ngày Tạo</th>
                            <th>Trạng thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="tabInvoices.length === 0">
                            <td colspan="10" class="no-data">
                                <div class="empty-state">
                                    <div class="empty-icon"><i class="fa fa-file-invoice"></i></div>
                                    <div class="empty-text">Chưa có hóa đơn nào</div>
                                    <div class="empty-subtext">Dữ liệu hóa đơn sẽ hiển thị ở đây</div>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="(inv, idx) in tabInvoices" :key="inv.id">
                            <td>{{ idx + 1 }}</td>
                            <td>{{ inv.maDon }}</td>
                            <td>{{ inv.hoTen }}</td>
                            <td>{{ inv.soDienThoai }}</td>
                            <td>
                                <span class="type-badge">{{ formatType(inv.loaiDon) }}</span>
                            </td>
                            <td>{{ inv.email }}</td>
                            <td>{{ inv.tongTien }}</td>
                            <td>{{ formatDate(inv.ngayXacNhan) }}</td>
                            <td>
                                <span :class="['status-badge', inv.statusClass]">{{ inv.statusLabel }}</span>
                            </td>
                            <td>
                                <button class="action-btn edit-btn" title="Chỉnh sửa" @click="editInvoice(idx)"><i class="fa fa-edit"></i></button>
                                <button class="action-btn delete-btn" title="Xóa" @click="deleteInvoice(inv.id)"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Modal for Editing Invoice -->
            <div v-if="showModal" class="modal-overlay">
                <div class="modal-content">
                    <h3>{{ editIndex !== null ? 'Chỉnh sửa hóa đơn' : 'Thêm hóa đơn' }}</h3>
                    <div class="modal-form">
                        <label>Mã Đơn</label>
                        <input v-model="newInvoice.maDon" placeholder="Nhập mã đơn" />
                        <label>Tên Khách Hàng</label>
                        <input v-model="newInvoice.hoTen" placeholder="Nhập tên khách hàng" />
                        <label>SĐT Khách Hàng</label>
                        <input v-model="newInvoice.soDienThoai" placeholder="Nhập số điện thoại" />
                        <label>Email</label>
                        <input v-model="newInvoice.email" placeholder="Nhập email" />
                        <label>Loại Đơn</label>
                        <select v-model="newInvoice.loaiDon">
                            <option :value="0">OFFLINE</option>
                            <option :value="1">ONLINE</option>
                        </select>
                        <label>Tổng Tiền</label>
                        <input v-model="newInvoice.tongTien" placeholder="Nhập tổng tiền" type="number" />
                        <label>Ngày Xác Nhận</label>
                        <input v-model="newInvoice.ngayXacNhan" type="date" />
                        <label>Trạng Thái</label>
                        <select v-model="newInvoice.status">
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="shipping">Chờ giao</option>
                            <option value="delivering">Đang giao</option>
                            <option value="done">Hoàn thành</option>
                            <option value="cancel">Đã hủy</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button class="save-btn" @click="saveInvoice">Lưu</button>
                        <button class="cancel-btn" @click="closeModal">Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      invoices: [],
      search: "",
      status: "",
      fromDate: "",
      toDate: "",
      tab: "all",
      showModal: false,
      newInvoice: {
        khachHangId: 0,
        voucherId: 0,
        diaChiId: 0,
        soDienThoai: "",
        hoTen: "",
        email: "",
        tongTienGoc: 0,
        tienGiam: 0,
        tongTien: 0,
        tienShip: 0,
        ngayXacNhan: "",
        ngayDuKien: "",
        ngayNhan: "",
        loaiDon: 0,
        ghiChu: "",
        maDon: "",
        status: "pending"
      },
      editIndex: null
    };
  },
  computed: {
    filteredInvoices() {
      const keyword = this.search.toLowerCase();
      return this.invoices
        .filter(inv => {
          const matchSearch = this.search === '' ||
            (inv.hoTen && inv.hoTen.toLowerCase().includes(keyword)) ||
            (inv.soDienThoai && inv.soDienThoai.includes(keyword)) ||
            (inv.maDon && inv.maDon.toLowerCase().includes(keyword)) ||
            (inv.email && inv.email.toLowerCase().includes(keyword));
          const matchFrom = !this.fromDate || inv.ngayXacNhan >= this.fromDate;
          const matchTo = !this.toDate || inv.ngayXacNhan <= this.toDate;
          return matchSearch && matchFrom && matchTo;
        })
        .map(inv => ({
          ...inv,
          status: inv.status || 'pending', // Fallback to 'pending' if status is missing
          statusLabel: this.statusLabel(inv.status || 'pending'),
          statusClass: inv.status || 'pending'
        }));
    },
    tabInvoices() {
      if (this.tab === 'all') return this.filteredInvoices;
      return this.filteredInvoices.filter(inv => inv.status === this.tab);
    }
  },
  methods: {
    async fetchInvoices() {
      try {
        const res = await axios.get("http://localhost:8080/don-hang/hien-thi");
        this.invoices = Array.isArray(res.data) ? res.data : res.data.data || [];
        console.log('API Response:', this.invoices);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      }
    },
    async deleteInvoice(id) {
      if (confirm("Xác nhận xóa hóa đơn này?")) {
        try {
          await axios.delete(`http://localhost:8080/don-hang/delete/${id}`);
          this.invoices = this.invoices.filter(inv => inv.id !== id);
          alert("Xóa hóa đơn thành công!");
        } catch (err) {
          console.error('Error deleting invoice:', err);
          alert("Lỗi khi xóa hóa đơn!");
        }
      }
    },
    resetFilter() {
      this.search = "";
      this.status = "";
      this.fromDate = "";
      this.toDate = "";
      this.fetchInvoices();
    },
    countByStatus(status) {
      return this.filteredInvoices.filter(inv => inv.status === status).length;
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("vi-VN");
    },
    statusLabel(status) {
      switch (status) {
        case "pending": return "Chờ xác nhận";
        case "confirmed": return "Đã xác nhận";
        case "shipping": return "Chờ giao";
        case "delivering": return "Đang giao";
        case "done": return "Hoàn thành";
        case "cancel": return "Đã hủy";
        default: return "Không xác định";
      }
    },
    formatType(loaiDon) {
      return loaiDon === 0 ? "OFFLINE" : "ONLINE";
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newInvoice = {
        khachHangId: 0,
        voucherId: 0,
        diaChiId: 0,
        soDienThoai: "",
        hoTen: "",
        email: "",
        tongTienGoc: 0,
        tienGiam: 0,
        tongTien: 0,
        tienShip: 0,
        ngayXacNhan: "",
        ngayDuKien: "",
        ngayNhan: "",
        loaiDon: 0,
        ghiChu: "",
        maDon: "",
        status: "pending"
      };
    },
    closeModal() {
      this.showModal = false;
    },
    async saveInvoice() {
      if (!this.newInvoice.maDon) {
        alert("Vui lòng nhập mã đơn.");
        return;
      }
      if (!this.newInvoice.hoTen) {
        alert("Vui lòng nhập tên khách hàng.");
        return;
      }
      if (!this.newInvoice.soDienThoai) {
        alert("Vui lòng nhập số điện thoại khách hàng.");
        return;
      }
      try {
        if (this.editIndex !== null) {
          // Update existing invoice
          const updatedInvoice = { ...this.newInvoice };
          await axios.put(`http://localhost:8080/don-hang/update/${updatedInvoice.id}`, updatedInvoice);
          this.invoices[this.editIndex] = updatedInvoice;
          alert("Cập nhật hóa đơn thành công!");
        } else {
          // Add new invoice (API call not implemented, placeholder for future)
          alert("API thêm hóa đơn chưa được triển khai!");
        }
        this.closeModal();
      } catch (err) {
        console.error('Error saving invoice:', err);
        alert("Lỗi khi lưu hóa đơn!");
      }
    },
    editInvoice(index) {
      this.editIndex = index;
      this.newInvoice = { ...this.invoices[index] };
      this.showModal = true;
    }
  },
  mounted() {
    this.fetchInvoices();
  }
};
</script>

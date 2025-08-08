<template>
  <div class="container">
    <h2>Quản lý màu sắc</h2>

    <!-- Tìm kiếm -->
    <div class="filter-box">
      <label>Tìm kiếm màu sắc:</label>
      <input v-model="searchQuery" type="text" placeholder="Nhập mã / tên để tìm...">
      <button class="button" @click="resetFilter">Đặt lại bộ lọc</button>
    </div>

    <!-- Bảng danh sách -->
    <div class="table-container">
      <button class="button" @click="openModal">➕ Thêm mới màu sắc</button>
      <br><br>
      <table class="table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã</th>
            <th>Tên</th>
            <th>Mã màu</th>
            <th>Màu</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(color, index) in filteredColors" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ color.code }}</td>
            <td>{{ color.name }}</td>
            <td>{{ color.hex }}</td>
            <td><div :style="{background: color.hex}" class="circle"></div></td>
            <td><span class="status">Hoạt động</span></td>
            <td class="actions">
              <button @click="editColor(index)">✏️</button>
              <button @click="deleteColor(index)">♻️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editIndex !== null ? 'Sửa màu sắc' : 'Thêm màu sắc' }}</h3>
        <label>Tên màu sắc *</label>
        <input v-model="newColor.name" type="text" placeholder="Nhập tên màu sắc">

        <label>Mã màu</label>
        <input v-model="newColor.hex" type="text" @input="updatePreview">
        <div class="color-preview" :style="{ backgroundColor: newColor.hex }"></div>

        <div class="modal-actions">
          <button class="button" @click="saveColor">Xác nhận</button>
          <button @click="closeModal">Huỷ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colors: [
        { code: 'MS5521', name: 'Nâu', hex: '#723c3c' },
        { code: 'MS005', name: 'Xanh lá', hex: '#00FF00' },
        { code: 'MS2503', name: 'Vàng', hex: '#d5ff05' },
        { code: 'MS004', name: 'Đỏ', hex: '#FF0000' },
        { code: 'MS006', name: 'Tím', hex: '#800080' },
        { code: 'MS007', name: 'Cam', hex: '#FFA500' },
      ],
      searchQuery: '',
      showModal: false,
      newColor: { name: '', hex: '#000000' },
      editIndex: null
    };
  },
  computed: {
    filteredColors() {
      return this.colors.filter(c =>
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    resetFilter() {
      this.searchQuery = '';
},
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newColor = { name: '', hex: '#000000' };
    },
    closeModal() {
      this.showModal = false;
    },
    saveColor() {
      if (!this.newColor.name || !/^#[0-9A-Fa-f]{6}$/.test(this.newColor.hex)) {
        alert('Vui lòng nhập thông tin hợp lệ.');
        return;
      }
      if (this.editIndex !== null) {
        this.colors[this.editIndex] = { ...this.colors[this.editIndex], ...this.newColor };
      } else {
        const newCode = `MS00${this.colors.length + 1}`;
        this.colors.push({ code: newCode, name: this.newColor.name, hex: this.newColor.hex });
      }
      this.closeModal();
    },
    editColor(index) {
      this.editIndex = index;
      this.newColor = { ...this.colors[index] };
      this.showModal = true;
    },
    deleteColor(index) {
      if (confirm('Xác nhận xoá màu này?')) {
        this.colors.splice(index, 1);
      }
    },
    updatePreview() {
      // Optional: live preview handled by :style binding
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
}
.button {
  padding: 8px 16px;
  background-color: #00bcd4;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
.filter-box, .table-container {
  margin-bottom: 20px;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}
.status {
  background: #d4edda;
  color: #155724;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.circle {
  width: 20px;
  height: 20px;
  margin: auto;
  border-radius: 50%;
}
.actions button {
  margin: 0 3px;
}
.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.modal {
  background: white;
  padding: 20px;
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}
.color-preview {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
.modal-actions {
  text-align: right;
}
</style>

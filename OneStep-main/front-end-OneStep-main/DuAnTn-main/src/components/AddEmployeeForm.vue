<template>
  <div class="add-employee-form">
    <h2>Thêm nhân viên mới</h2>
    <form @submit.prevent="submitForm">
      <input v-model="form.code" placeholder="Mã nhân viên" required />
      <input v-model="form.name" placeholder="Tên nhân viên" required />
      <input v-model="form.email" placeholder="Email" required />
      <input v-model="form.phone" placeholder="Số điện thoại" required />
      <input v-model="form.joinDate" placeholder="Ngày tham gia" required />
      <select v-model="form.status">
        <option value="active">Đang làm việc</option>
        <option value="inactive">Nghỉ việc</option>
      </select>
      <div class="modal-actions">
        <button type="submit">Lưu</button>
        <button type="button" @click="goBack">Hủy</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        code: '',
        name: '',
        email: '',
        phone: '',
        joinDate: '',
        status: 'active'
      }
    }
  },
  methods: {
    submitForm() {
      // Lưu vào localStorage (demo), thực tế bạn có thể gọi API hoặc emit event
      let employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const newId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      employees.push({ ...this.form, id: newId });
      localStorage.setItem('employees', JSON.stringify(employees));
      this.$router.push('/employees');
      
    },
    goBack() {
      this.$router.back();
    }
    
  }
  
}
</script>

<style scoped>
.add-employee-form {
  background: #fff;
  border-radius: 10px;
  padding: 32px 40px;
  max-width: 420px;
  margin: 40px auto;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
}
.add-employee-form h2 {
  margin-bottom: 18px;
  font-size: 1.5rem;
  font-weight: 700;
}
.add-employee-form input, .add-employee-form select {
  display: block;
  width: 100%;
  margin-bottom: 14px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.modal-actions button {
  padding: 7px 18px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
}
</style>
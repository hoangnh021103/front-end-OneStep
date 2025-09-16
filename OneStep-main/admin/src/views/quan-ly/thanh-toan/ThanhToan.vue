<template>
  <div class="qr-container">
    <h2>Tạo mã QR thanh toán VietQR</h2>

    <div class="form">
      <input v-model="bankBin" placeholder="Mã ngân hàng (VD: 970422)" />
      <input v-model="accountNo" placeholder="Số tài khoản" />
      <input v-model="accountName" placeholder="Tên chủ tài khoản" />
      <input v-model="amount" type="number" placeholder="Số tiền" />
      <input v-model="addInfo" placeholder="Nội dung chuyển khoản" />

      <button @click="generateQR">Tạo QR</button>
    </div>

    <div v-if="qrUrl" class="qr-result">
      <h3>Mã QR thanh toán</h3>
      <img :src="qrUrl" alt="QR Code" />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      bankBin: "",
      accountNo: "",
      accountName: "",
      amount: null,
      addInfo: "",
      qrUrl: null,
    };
  },
  methods: {
    async generateQR() {
      const payload = {
        bankBin: this.bankBin,
        accountNo: this.accountNo,
        accountName: this.accountName,
        amount: this.amount,
        addInfo: this.addInfo,
      };
      const res = await axios.post("http://localhost:8080/api/vietqr/generate", payload);
      this.qrUrl = res.data.qrUrl;
    },
  },
};
</script>

<style scoped>
.qr-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background: #f9fafc;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

.qr-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.form input {
  width: 100%;
  margin: 8px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: border 0.3s;
}

.form input:focus {
  border-color: #4a90e2;
}

.form button {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  background: #4a90e2;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.form button:hover {
  background: #357abd;
}

.qr-result {
  margin-top: 20px;
}

.qr-result img {
  margin-top: 10px;
  max-width: 250px;
  border: 8px solid #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
</style>

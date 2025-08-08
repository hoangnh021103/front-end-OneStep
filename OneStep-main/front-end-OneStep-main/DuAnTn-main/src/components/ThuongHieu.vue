<template>
  <div class="thuong-hieu">
    <h2>Quản lý Thương Hiệu</h2>
    <form @submit.prevent="addBrand" class="brand-form">
      <input v-model="newBrand" placeholder="Nhập tên thương hiệu" />
      <input v-model="newBrandImg" placeholder="Nhập link ảnh logo" />
      <button type="submit">Thêm</button>
    </form>
    <div class="brand-table-wrapper">
      <table class="brand-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Logo</th>
            <th>Tên thương hiệu</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(brand, index) in brands" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <img :src="brand.img" :alt="brand.name" class="brand-logo" v-if="brand.img"/>
              <span v-else class="no-logo">Không có ảnh</span>
            </td>
            <td>{{ brand.name }}</td>
            <td>
              <button class="delete-btn" @click="removeBrand(index)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="brands.length === 0" class="empty-text">Chưa có thương hiệu nào.</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ThuongHieu",
  data() {
    return {
      newBrand: "",
      newBrandImg: "",
      brands: [
        {
          name: "Nike",
          img: "https://1000logos.net/wp-content/uploads/2017/03/Nike-Logo.png"
        },
        {
          name: "Adidas",
          img: "https://1000logos.net/wp-content/uploads/2017/05/Adidas-logo.png"
        },
        {
          name: "Puma",
          img: "https://1000logos.net/wp-content/uploads/2017/05/Puma-logo.png"
        },
        {
          name: "Converse",
          img: "https://1000logos.net/wp-content/uploads/2017/05/Converse-logo.png"
        },
        {
          name: "Vans",
          img: "https://1000logos.net/wp-content/uploads/2017/05/Vans-logo.png"
        },
        {
          name: "Bitis Hunter",
          img: "https://bizweb.dktcdn.net/100/438/408/files/bitis-logo.png"
        }
      ],
    };
  },
  methods: {
    addBrand() {
      const name = this.newBrand.trim();
      const img = this.newBrandImg.trim();
      if (name && !this.brands.some(b => b.name.toLowerCase() === name.toLowerCase())) {
        this.brands.push({ name, img });
        this.newBrand = "";
        this.newBrandImg = "";
      }
    },
    removeBrand(index) {
      this.brands.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.thuong-hieu {
  max-width: 700px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 24px;
}
h2 {
  text-align: center;
  color: #2563eb;
  margin-bottom: 24px;
  font-size: 2rem;
  font-weight: bold;
}
.brand-form {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: center;
}
.brand-form input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}
.brand-form button {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.brand-form button:hover {
  background: #1e40af;
}
.brand-table-wrapper {
  margin-top: 8px;
}
.brand-table {
  width: 100%;
  border-collapse: collapse;
  background: #f7f8fa;
  border-radius: 8px;
  overflow: hidden;
}
.brand-table th, .brand-table td {
  padding: 12px 8px;
  text-align: left;
  vertical-align: middle;
}
.brand-table th {
  background: #f0f4ff;
  color: #2563eb;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
}
.brand-table tr:nth-child(even) {
  background: #f8fafc;
}
.brand-table tr:hover {
  background: #e0e7ff;
}
.brand-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.no-logo {
  color: #bbb;
  font-style: italic;
}
.delete-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #b91c1c;
}
.empty-text {
  text-align: center;
  color: #888;
  margin-top: 16px;
  font-style: italic;
}
</style>
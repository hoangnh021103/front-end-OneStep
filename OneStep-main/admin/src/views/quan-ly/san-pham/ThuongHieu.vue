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

<style>
/* CSS đã được chuyển sang src/scss/pages/thuong-hieu.scss */
</style>

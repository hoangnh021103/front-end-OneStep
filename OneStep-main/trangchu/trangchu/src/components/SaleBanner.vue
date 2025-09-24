<template>
  <div class="sale">
    <div class="container">
      <div class="row">
        <div class="col-sm-8 offset-sm-2 text-center">
          <div class="row">
            <div class="owl-carousel2">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SaleBanner'
}
</script>

<style scoped>
.sale {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  padding: 15px 0;
  text-align: center;
}

.sale h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.sale h3 a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.sale h3 a:hover {
  opacity: 0.8;
}

.owl-carousel2 {
  position: relative;
}

.item {
  display: block;
}

/* Animation for banner text */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.item {
  animation: slideIn 0.5s ease-in-out;
}
</style>

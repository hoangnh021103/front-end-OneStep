<template>
  <div class="statistic-container">
    <h2 class="stat-title">Thống Kê Đơn Hàng</h2>
    <div class="filter-section modern-filter">
      <label>
        <span class="filter-icon"><i class="fas fa-shoe-prints"></i></span> Loại giày:
        <select v-model="selectedType">
          <option value="">Tất cả</option>
          <option v-for="type in shoeTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>
      <label>
        <span class="filter-icon"><i class="fas fa-tags"></i></span> Hãng giày:
        <select v-model="selectedBrand">
          <option value="">Tất cả</option>
          <option v-for="brand in shoeBrands" :key="brand" :value="brand">{{ brand }}</option>
        </select>
      </label>
      <label>
        <span class="filter-icon"><i class="fas fa-calendar-alt"></i></span> Thời gian:
        <input type="date" v-model="startDate" />
        <span> - </span>
        <input type="date" v-model="endDate" />
      </label>
      <button class="filter-btn" @click="applyFilter"><i class="fas fa-filter"></i> Lọc thống kê</button>
    </div>
    <div class="statistic-cards">
      <div class="stat-card gradient-card">
        <div class="stat-icon"><i class="fas fa-coins"></i></div>
        <h3>Tổng doanh thu</h3>
        <p>{{ filteredRevenue.toLocaleString() }} VNĐ</p>
      </div>
      <div class="stat-card gradient-card">
        <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
        <h3>Số đơn hàng</h3>
        <p>{{ filteredOrders.length }}</p>
      </div>
      <div class="stat-card gradient-card">
        <div class="stat-icon"><i class="fas fa-user-plus"></i></div>
        <h3>Khách hàng mới</h3>
        <p>{{ filteredNewCustomers }}</p>
      </div>
    </div>
    <div class="chart-section" style="display: flex; gap: 32px; margin-bottom: 32px;">
      <div style="flex:1;">
        <h3 class="chart-title"><i class="fas fa-chart-bar"></i> Biểu đồ doanh thu theo ngày</h3>
        <canvas ref="revenueChartDay"></canvas>
      </div>
      <div style="flex:1;">
        <h3 class="chart-title"><i class="fas fa-chart-line"></i> Biểu đồ doanh thu theo tháng</h3>
        <canvas ref="revenueChartMonth"></canvas>
      </div>
    </div>
    <div class="table-section" style="display: flex; gap: 32px;">
      <div style="flex:1;">
        <h3 class="table-title"><i class="fas fa-industry"></i> Bảng doanh thu theo hãng sản phẩm</h3>
        <table class="modern-table">
          <thead>
            <tr>
              <th>Hãng giày</th>
              <th>Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(revenue, brand) in revenueByBrand" :key="brand">
              <td>{{ brand }}</td>
              <td>{{ revenue ? revenue.toLocaleString() : 0 }} VNĐ</td>
            </tr>
            <tr v-if="Object.keys(revenueByBrand).length === 0">
              <td colspan="2">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="flex:1;">
        <h3 class="table-title"><i class="fas fa-shoe-prints"></i> Bảng doanh thu theo loại giày</h3>
        <table class="modern-table">
          <thead>
            <tr>
              <th>Loại giày</th>
              <th>Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(revenue, type) in revenueByType" :key="type">
              <td>{{ type }}</td>
              <td>{{ revenue ? revenue.toLocaleString() : 0 }} VNĐ</td>
            </tr>
            <tr v-if="Object.keys(revenueByType).length === 0">
              <td colspan="2">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'ThongKe',
  setup() {
    const orders = ref([
      { id: 1, date: '2025-07-01', type: 'Sneaker', brand: 'Nike', name: 'Air Max 90', revenue: 500000, customer: 'A', isNew: true },
      { id: 2, date: '2025-07-01', type: 'Boot', brand: 'Adidas', name: 'Superstar Boot', revenue: 700000, customer: 'B', isNew: false },
      { id: 3, date: '2025-07-02', type: 'Sneaker', brand: 'Nike', name: 'Air Force 1', revenue: 800000, customer: 'C', isNew: true },
      { id: 4, date: '2025-07-03', type: 'Sandal', brand: 'Puma', name: 'Puma Sandal', revenue: 400000, customer: 'D', isNew: false },
      { id: 5, date: '2025-07-03', type: 'Boot', brand: 'Nike', name: 'Nike Boot', revenue: 600000, customer: 'E', isNew: true },
      { id: 6, date: '2025-07-04', type: 'Sneaker', brand: 'Adidas', name: 'Ultraboost', revenue: 900000, customer: 'F', isNew: false },
      { id: 7, date: '2025-07-05', type: 'Sneaker', brand: 'Nike', name: 'Air Jordan 1', revenue: 1200000, customer: 'G', isNew: true },
      { id: 8, date: '2025-07-06', type: 'Sandal', brand: 'Puma', name: 'Puma Slide', revenue: 350000, customer: 'H', isNew: false },
      { id: 9, date: '2025-07-07', type: 'Boot', brand: 'Adidas', name: 'Adidas Boot', revenue: 750000, customer: 'I', isNew: true },
      { id: 10, date: '2025-07-08', type: 'Sneaker', brand: 'Nike', name: 'Air Max 97', revenue: 950000, customer: 'J', isNew: false },
      { id: 11, date: '2025-07-09', type: 'Sneaker', brand: 'Adidas', name: 'Stan Smith', revenue: 650000, customer: 'K', isNew: true },
      { id: 12, date: '2025-07-10', type: 'Boot', brand: 'Nike', name: 'Nike Classic Boot', revenue: 800000, customer: 'L', isNew: false },
      { id: 13, date: '2025-07-11', type: 'Sandal', brand: 'Puma', name: 'Puma Beach', revenue: 420000, customer: 'M', isNew: true },
      { id: 14, date: '2025-07-12', type: 'Sneaker', brand: 'Nike', name: 'Air Max 95', revenue: 1100000, customer: 'N', isNew: false },
      { id: 15, date: '2025-07-13', type: 'Sneaker', brand: 'Adidas', name: 'NMD R1', revenue: 980000, customer: 'O', isNew: true },
      { id: 16, date: '2025-07-14', type: 'Boot', brand: 'Nike', name: 'Nike Winter Boot', revenue: 870000, customer: 'P', isNew: false },
      { id: 17, date: '2025-07-15', type: 'Sandal', brand: 'Puma', name: 'Puma Flip', revenue: 390000, customer: 'Q', isNew: true },
      { id: 18, date: '2025-07-16', type: 'Sneaker', brand: 'Nike', name: 'Air Max 270', revenue: 1050000, customer: 'R', isNew: false },
      { id: 19, date: '2025-07-17', type: 'Sneaker', brand: 'Adidas', name: 'Gazelle', revenue: 720000, customer: 'S', isNew: true },
      { id: 20, date: '2025-07-18', type: 'Boot', brand: 'Adidas', name: 'Adidas Winter Boot', revenue: 830000, customer: 'T', isNew: false }
    ]);
    const shoeTypes = ref(['Sneaker', 'Boot', 'Sandal']);
    const shoeBrands = ref(['Nike', 'Adidas', 'Puma']);
    const selectedType = ref('');
    const selectedBrand = ref('');
    const startDate = ref('2025-07-01');
    const endDate = ref('2025-07-18');
    const filteredOrders = ref([]);
    const filteredRevenue = ref(0);
    const filteredNewCustomers = ref(0);
    const revenueByBrand = ref({});
    const revenueByType = ref({});
    const revenueChartDay = ref(null);
    const revenueChartMonth = ref(null);
    const revenueByDate = ref({});
    const revenueByMonth = ref({});

    function applyFilter() {
      filteredOrders.value = orders.value.filter(order => {
        const matchType = !selectedType.value || order.type === selectedType.value;
        const matchBrand = !selectedBrand.value || order.brand === selectedBrand.value;
        const matchDate = (!startDate.value || order.date >= startDate.value) && (!endDate.value || order.date <= endDate.value);
        return matchType && matchBrand && matchDate;
      });
      filteredRevenue.value = filteredOrders.value.reduce((sum, o) => sum + o.revenue, 0);
      filteredNewCustomers.value = filteredOrders.value.filter(o => o.isNew).length;
      // Tính doanh thu theo hãng sản phẩm
      const byBrand = {};
      filteredOrders.value.forEach(order => {
        if (!byBrand[order.brand]) byBrand[order.brand] = 0;
        byBrand[order.brand] += order.revenue;
      });
      revenueByBrand.value = byBrand;
      // Tính doanh thu theo loại giày
      const byType = {};
      filteredOrders.value.forEach(order => {
        if (!byType[order.type]) byType[order.type] = 0;
        byType[order.type] += order.revenue;
      });
      revenueByType.value = byType;
      // Tính doanh thu theo ngày
      const byDate = {};
      filteredOrders.value.forEach(order => {
        if (!byDate[order.date]) byDate[order.date] = 0;
        byDate[order.date] += order.revenue;
      });
      revenueByDate.value = byDate;
      // Tính doanh thu theo tháng
      const byMonth = {};
      filteredOrders.value.forEach(order => {
        const month = order.date.slice(0,7); // yyyy-mm
        if (!byMonth[month]) byMonth[month] = 0;
        byMonth[month] += order.revenue;
      });
      revenueByMonth.value = byMonth;
      drawChart();
    }

    function drawChart() {
      // Biểu đồ doanh thu theo ngày
      if (revenueChartDay.value) {
        if (revenueChartDay.value._chartInstance) {
          revenueChartDay.value._chartInstance.destroy();
        }
        const ctxDay = revenueChartDay.value.getContext('2d');
        const gradientDay = ctxDay.createLinearGradient(0, 0, 0, 400);
        gradientDay.addColorStop(0, '#2563eb');
        gradientDay.addColorStop(1, '#60a5fa');
        const labelsDay = Object.keys(revenueByDate.value);
        const dataDay = Object.values(revenueByDate.value);
        const chartInstanceDay = new Chart(revenueChartDay.value, {
          type: 'bar',
          data: {
            labels: labelsDay,
            datasets: [{
              label: 'Doanh thu (VNĐ)',
              data: dataDay,
              backgroundColor: gradientDay,
              borderRadius: 8,
              barPercentage: 0.7,
              categoryPercentage: 0.6,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Doanh thu theo ngày',
                color: '#2563eb',
                font: { size: 18, weight: 'bold' }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#2563eb', font: { weight: 'bold' } }
              },
              y: {
                grid: { color: '#e0e7ff' },
                ticks: { color: '#2563eb', font: { weight: 'bold' } }
              }
            }
          }
        });
        revenueChartDay.value._chartInstance = chartInstanceDay;
      }
      // Biểu đồ doanh thu theo tháng
      if (revenueChartMonth.value) {
        if (revenueChartMonth.value._chartInstance) {
          revenueChartMonth.value._chartInstance.destroy();
        }
        const ctxMonth = revenueChartMonth.value.getContext('2d');
        const gradientMonth = ctxMonth.createLinearGradient(0, 0, 0, 400);
        gradientMonth.addColorStop(0, '#16a34a');
        gradientMonth.addColorStop(1, '#86efac');
        const labelsMonth = Object.keys(revenueByMonth.value);
        const dataMonth = Object.values(revenueByMonth.value);
        const chartInstanceMonth = new Chart(revenueChartMonth.value, {
          type: 'bar',
          data: {
            labels: labelsMonth,
            datasets: [{
              label: 'Doanh thu (VNĐ)',
              data: dataMonth,
              backgroundColor: gradientMonth,
              borderRadius: 8,
              barPercentage: 0.7,
              categoryPercentage: 0.6,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Doanh thu theo tháng',
                color: '#16a34a',
                font: { size: 18, weight: 'bold' }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#16a34a', font: { weight: 'bold' } }
              },
              y: {
                grid: { color: '#bbf7d0' },
                ticks: { color: '#16a34a', font: { weight: 'bold' } }
              }
            }
          }
        });
        revenueChartMonth.value._chartInstance = chartInstanceMonth;
      }
    }

    onMounted(() => {
      applyFilter();
    });

    watch([selectedType, selectedBrand, startDate, endDate], applyFilter);

    return {
      shoeTypes,
      shoeBrands,
      selectedType,
      selectedBrand,
      startDate,
      endDate,
      filteredOrders,
      filteredRevenue,
      filteredNewCustomers,
      revenueByBrand,
      revenueByType,
      revenueChartDay,
      revenueChartMonth,
      revenueByDate,
      revenueByMonth,
      applyFilter
    };
  }
};
</script>

<style scoped>
.statistic-container {
  background: linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 100%);
  border-radius: 24px;
  padding: 40px 24px;
  margin-top: 32px;
  box-shadow: 0 4px 24px rgba(37,99,235,0.08);
}
.stat-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 24px;
  letter-spacing: 1px;
  text-align: center;
}
.filter-section.modern-filter {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  align-items: center;
  justify-content: center;
  background: #f0f4ff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(37,99,235,0.06);
  padding: 16px 0;
}
.filter-section label {
  font-weight: 600;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-icon {
  color: #2563eb;
  font-size: 1.2rem;
}
.filter-section select, .filter-section input[type="date"] {
  margin-left: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  background: #fff;
  transition: border 0.2s;
}
.filter-section select:focus, .filter-section input[type="date"]:focus {
  border: 1.5px solid #2563eb;
}
.filter-btn {
  padding: 8px 20px;
  background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 2px 8px rgba(37,99,235,0.08);
  transition: background 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-btn:hover {
  background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%);
  transform: translateY(-2px) scale(1.04);
}
.statistic-cards {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}
.stat-card.gradient-card {
  background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%);
  border-radius: 20px;
  padding: 32px 20px;
  flex: 1;
  text-align: center;
  box-shadow: 0 4px 16px rgba(37,99,235,0.10);
  color: #fff;
  position: relative;
  transition: box-shadow 0.2s, transform 0.2s;
}
.stat-card.gradient-card:hover {
  box-shadow: 0 8px 32px rgba(37,99,235,0.18);
  transform: translateY(-4px) scale(1.03);
}
.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #fff;
  filter: drop-shadow(0 2px 8px #2563eb44);
}
.stat-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}
.stat-card p {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 1px;
}
.chart-section {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}
.chart-title {
  color: #2563eb;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.table-section {
  margin-top: 32px;
  display: flex;
  gap: 32px;
}
.table-title {
  color: #16a34a;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.modern-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(22,163,74,0.08);
}
th, td {
  border: 1px solid #e0e7ff;
  padding: 12px;
  text-align: center;
  font-size: 1rem;
}
th {
  background: #f0fdf4;
  font-weight: 700;
  color: #16a34a;
}
td {
  color: #2563eb;
  font-weight: 600;
}
canvas {
  border-radius: 16px;
  background: #f9fafb;
  box-shadow: 0 2px 8px rgba(37,99,235,0.06);
}
@media (max-width: 900px) {
  .statistic-cards, .chart-section, .table-section {
    flex-direction: column;
    gap: 20px;
  }
  .stat-card.gradient-card {
    padding: 24px 10px;
  }
}
</style>

<!-- Thêm link fontawesome vào index.html để icon hoạt động -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

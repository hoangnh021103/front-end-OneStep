// Script để test API chi tiết sản phẩm
const axios = require('axios');

const API_BASE = 'http://localhost:8080';

async function testChiTietSanPhamAPI() {
    console.log('🔍 Testing Chi Tiết Sản Phẩm API...');
    
    try {
        const response = await axios.get(`${API_BASE}/chi-tiet-san-pham/hien-thi`);
        console.log('✅ Chi Tiết Sản Phẩm API Response:');
        console.log(`📊 Số lượng sản phẩm: ${response.data.length}`);
        
        if (response.data.length > 0) {
            const firstProduct = response.data[0];
            console.log('📦 Sản phẩm đầu tiên:');
            console.log(`   - ID: ${firstProduct.id || firstProduct.chiTietSanPhamId}`);
            console.log(`   - Tên: ${firstProduct.tenSanPham || firstProduct.tenChiTiet}`);
            console.log(`   - Giá: ${firstProduct.giaTien || firstProduct.giaBan || 0}`);
            console.log(`   - Giảm giá: ${firstProduct.tienGiamGia || 0}`);
            console.log(`   - Tồn kho: ${firstProduct.soLuongTon || 0}`);
            console.log(`   - Thương hiệu: ${firstProduct.thuongHieuTen || 'N/A'}`);
            console.log(`   - Hình ảnh: ${firstProduct.duongDanAnh || 'N/A'}`);
        }
        
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi Chi Tiết Sản Phẩm API:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
        return null;
    }
}

async function testSanPhamAPI() {
    console.log('🔍 Testing Sản Phẩm API (Fallback)...');
    
    try {
        const response = await axios.get(`${API_BASE}/san-pham/hien-thi`);
        console.log('✅ Sản Phẩm API Response:');
        console.log(`📊 Số lượng sản phẩm: ${response.data.length}`);
        
        if (response.data.length > 0) {
            const firstProduct = response.data[0];
            console.log('📦 Sản phẩm đầu tiên:');
            console.log(`   - ID: ${firstProduct.productId || firstProduct.id}`);
            console.log(`   - Tên: ${firstProduct.tenSanPham}`);
            console.log(`   - Giá: ${firstProduct.giaBan || firstProduct.gia || 0}`);
            console.log(`   - Thương hiệu: ${firstProduct.thuongHieuTen || 'N/A'}`);
        }
        
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi Sản Phẩm API:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
        return null;
    }
}

async function testCORS() {
    console.log('🔍 Testing CORS Configuration...');
    
    try {
        // Test với origin từ frontend
        const response = await axios.get(`${API_BASE}/chi-tiet-san-pham/hien-thi`, {
            headers: {
                'Origin': 'http://localhost:5177'
            }
        });
        console.log('✅ CORS OK - API có thể truy cập từ frontend');
        return true;
    } catch (error) {
        console.error('❌ CORS Error:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('🚀 Bắt đầu test API...\n');
    
    // Test CORS
    await testCORS();
    console.log('');
    
    // Test Chi Tiết Sản Phẩm API
    const chiTietData = await testChiTietSanPhamAPI();
    console.log('');
    
    // Test Sản Phẩm API nếu chi tiết không có dữ liệu
    if (!chiTietData || chiTietData.length === 0) {
        await testSanPhamAPI();
    }
    
    console.log('🏁 Test hoàn thành!');
}

// Chạy test nếu file được gọi trực tiếp
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    testChiTietSanPhamAPI,
    testSanPhamAPI,
    testCORS,
    runAllTests
};

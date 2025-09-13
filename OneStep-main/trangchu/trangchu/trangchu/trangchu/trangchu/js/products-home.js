document.addEventListener('DOMContentLoaded', function () {
    // Gọi API lấy danh sách sản phẩm
    fetch('/san-pham/hien-thi')
        .then(res => res.json())
        .then(data => {
            renderProducts(data);
            initFilters();
        })
        .catch(err => {
            console.error('Lỗi lấy sản phẩm:', err);
        });

    function renderProducts(products) {
        const container = document.querySelector('.row.row-pb-md');
        if (!container) return;
        container.innerHTML = ''; // Xóa sản phẩm cũ

        products.forEach(product => {
            // Tùy chỉnh các trường theo API của bạn
            const colors = product.mauSac ? product.mauSac.join(',') : '';
            const sizes = product.kichThuoc ? product.kichThuoc.join(',') : '';
            const price = product.giaBan || 0;
            const priceStr = price.toLocaleString('vi-VN') + '₫';
            const priceOld = product.giaCu ? product.giaCu.toLocaleString('vi-VN') + '₫' : '';
            const imgSrc = product.duongDanAnh || 'images/no-image.png';

            const html = `
            <div class="col-lg-3 mb-4 text-center">
                <div class="product-entry border animate-fade-in-up" 
                    data-name="${product.tenSanPham}" 
                    data-price="${price}"
                >
                    <div class="product-tags" data-colors="${colors}" data-sizes="${sizes}">
                        <span class="tag tag-sale">★ SIÊU SALE ★</span>
                        <span class="tag tag-new">✨ HÀNG MỚI VỀ ✨</span>
                    </div>
                    <a href="#" class="prod-img">
                        <img src="${imgSrc}" class="img-fluid" alt="${product.tenSanPham}">
                    </a>
                    <div class="desc">
                        <div class="rating">
                            <span class="stars">★★★★★</span>
                        </div>
                        <div class="brand">${product.thuongHieu || ''}</div>
                        <h2><a href="#">${product.tenSanPham}</a></h2>
                        <div class="price">
                            <span class="current-price">${priceStr}</span>
                            <span class="original-price">${priceOld}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        // Gắn sự kiện click cho sản phẩm
        document.querySelectorAll('.product-entry').forEach(function(product){
            product.addEventListener('click', function(){
                var name = product.querySelector('.desc h2 a').textContent;
                var img = product.querySelector('.prod-img img').getAttribute('src');
                localStorage.setItem('selectedProduct', JSON.stringify({ name, img }));
                window.location.href = 'product-detail.html';
            });
        });
    }

    // Khởi tạo bộ lọc (lọc giá, màu, size)
    function initFilters() {
        let selectedColor = 'all';
        let selectedSize = 'all';
        let selectedPrice = 'all';
        let customMinPrice = null;
        let customMaxPrice = null;

        function filterAllProducts() {
            document.querySelectorAll('.product-entry').forEach(function(entry) {
                // Lọc màu & size
                const tagDiv = entry.querySelector('.product-tags');
                const colors = tagDiv.getAttribute('data-colors') ? tagDiv.getAttribute('data-colors').split(',') : [];
                const sizes = tagDiv.getAttribute('data-sizes') ? tagDiv.getAttribute('data-sizes').split(',') : [];
                let show = true;
                if(selectedColor !== 'all' && !colors.includes(selectedColor)) show = false;
                if(selectedSize !== 'all' && !sizes.includes(selectedSize)) show = false;

                // Lọc giá
                const priceElement = entry.querySelector('.current-price');
                if (priceElement) {
                    const priceText = priceElement.textContent.replace(/[^\d]/g, '');
                    const productPrice = parseInt(priceText);
                    let minPrice = 0, maxPrice = 99999999;
                    if(selectedPrice !== 'all') {
                        [minPrice, maxPrice] = selectedPrice.split('-').map(Number);
                    }
                    if(customMinPrice !== null) minPrice = customMinPrice;
                    if(customMaxPrice !== null) maxPrice = customMaxPrice;
                    if(productPrice < minPrice || productPrice > maxPrice) show = false;
                }
                entry.style.display = show ? '' : 'none';
            });
        }

        // Lọc màu
        document.querySelectorAll('.color-filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                selectedColor = this.getAttribute('data-color');
                document.querySelectorAll('.color-filter-btn').forEach(b=>b.classList.remove('active'));
                this.classList.add('active');
                filterAllProducts();
            });
        });

        // Lọc size
        document.querySelectorAll('.size-filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                selectedSize = this.getAttribute('data-size');
                document.querySelectorAll('.size-filter-btn').forEach(b=>b.classList.remove('active'));
                this.classList.add('active');
                filterAllProducts();
            });
        });

        // Lọc giá theo nút
        document.querySelectorAll('.price-filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.price-filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedPrice = this.getAttribute('data-price');
                customMinPrice = null;
                customMaxPrice = null;
                filterAllProducts();
            });
        });

        // Lọc giá custom
        window.applyHomepageCustomPrice = function() {
            customMinPrice = parseInt(document.getElementById('homepage-min-price').value) || 0;
            customMaxPrice = parseInt(document.getElementById('homepage-max-price').value) || 99999999;
            document.querySelectorAll('.price-filter-btn').forEach(b => b.classList.remove('active'));
            filterAllProducts();
        };
    }
});
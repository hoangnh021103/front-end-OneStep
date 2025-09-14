const state = {
  products: [
    {
      id: 1,
      name: "Giày Nike Court Shot Nam - Đen Đen",
      brand: "Nike",
      price: 2290000,
      originalPrice: 2600000,
      image: "images/item-1.jpg",
      rating: 5,
      colors: ["Đen", "Trắng"],
      sizes: ["39", "40", "41"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-12%"],
      category: "men"
    },
    {
      id: 2,
      name: "Giày Nike Quest 6 Nam - Đen Đỏ Trắng",
      brand: "Nike",
      price: 2390000,
      originalPrice: 2800000,
      image: "images/item-2.jpg",
      rating: 5,
      colors: ["Đen", "Đỏ", "Trắng"],
      sizes: ["40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-15%"],
      category: "men"
    },
    {
      id: 3,
      name: "Giày Nike Quest 6 Nam - Xám Xanh Lá",
      brand: "Nike",
      price: 2390000,
      originalPrice: 2800000,
      image: "images/item-3.jpg",
      rating: 5,
      colors: ["Xám", "Xanh", "Trắng"],
      sizes: ["39", "41", "42"],
      tags: ["SIÊU SALE", "ĐỘC QUYỀN", "HÀNG MỚI VỀ", "-15%"],
      category: "men"
    },
    {
      id: 4,
      name: "Giày Nike Pegasus 41 Nữ - Hồng Nâu",
      brand: "Nike",
      price: 3790000,
      originalPrice: 3990000,
      image: "images/item-4.jpg",
      rating: 5,
      colors: ["Hồng", "Nâu", "Trắng"],
      sizes: ["40", "41", "42"],
      tags: ["SIÊU SALE", "ĐỘC QUYỀN", "HÀNG MỚI VỀ", "-5%"],
      category: "women"
    },
    {
      id: 5,
      name: "Giày Nike Air Max 270 Nam - Trắng",
      brand: "Nike",
      price: 3290000,
      originalPrice: 3460000,
      image: "images/item-5.jpg",
      rating: 4,
      colors: ["Trắng"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-5%"],
      category: "men"
    },
    {
      id: 6,
      name: "Giày Lacoste Carnaby Nam - Đen Trắng",
      brand: "Lacoste",
      price: 2890000,
      originalPrice: 3610000,
      image: "images/item-6.jpg",
      rating: 4,
      colors: ["Đen", "Trắng"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-20%"],
      category: "men"
    },
    {
      id: 7,
      name: "Giày Adidas Pureboost Lightmotion Nam - Trắng Đỏ",
      brand: "Adidas",
      price: 2590000,
      originalPrice: 2780000,
      image: "images/item-7.jpg",
      rating: 4,
      colors: ["Trắng", "Đỏ"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-7%"],
      category: "men"
    },
    {
      id: 8,
      name: "Giày Adidas Ultraboost 22 Nam - Xanh Dương",
      brand: "Adidas",
      price: 3990000,
      originalPrice: 4430000,
      image: "images/item-8.jpg",
      rating: 5,
      colors: ["Xanh"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-10%"],
      category: "men"
    },
    {
      id: 9,
      name: "Giày Converse Chuck Taylor All Star Nam - Đen",
      brand: "Converse",
      price: 1290000,
      originalPrice: 1400000,
      image: "images/item-9.jpg",
      rating: 4,
      colors: ["Đen"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-8%"],
      category: "men"
    },
    {
      id: 10,
      name: "Giày Vans Old Skool Nam - Đen Trắng",
      brand: "Vans",
      price: 1590000,
      originalPrice: 1800000,
      image: "images/item-10.jpg",
      rating: 5,
      colors: ["Đen", "Trắng"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "ĐỘC QUYỀN", "HÀNG MỚI VỀ", "-12%"],
      category: "men"
    },
    {
      id: 11,
      name: "Giày Puma RS-X Nam - Xám Đỏ",
      brand: "Puma",
      price: 1890000,
      originalPrice: 2220000,
      image: "images/item-11.jpg",
      rating: 4,
      colors: ["Xám", "Đỏ"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-15%"],
      category: "men"
    },
    {
      id: 12,
      name: "Giày New Balance 574 Nam - Xanh Navy",
      brand: "New Balance",
      price: 2190000,
      originalPrice: 2330000,
      image: "images/item-12.jpg",
      rating: 5,
      colors: ["Xanh"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-6%"],
      category: "men"
    },
    {
      id: 13,
      name: "Giày Reebok Classic Leather Nam - Trắng",
      brand: "Reebok",
      price: 1790000,
      originalPrice: 1970000,
      image: "images/item-13.jpg",
      rating: 4,
      colors: ["Trắng"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-9%"],
      category: "men"
    },
    {
      id: 14,
      name: "Giày Fila Disruptor 2 Nữ - Trắng Hồng",
      brand: "Fila",
      price: 1690000,
      originalPrice: 1900000,
      image: "images/item-14.jpg",
      rating: 5,
      colors: ["Trắng", "Hồng"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "ĐỘC QUYỀN", "HÀNG MỚI VỀ", "-11%"],
      category: "women"
    },
    {
      id: 15,
      name: "Giày Asics Gel-Kayano 28 Nam - Đen Xám",
      brand: "Asics",
      price: 3490000,
      originalPrice: 4010000,
      image: "images/item-15.jpg",
      rating: 4,
      colors: ["Đen", "Xám"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-13%"],
      category: "men"
    },
    {
      id: 16,
      name: "Giày Under Armour Charged Assert 9 Nam - Đen",
      brand: "Under Armour",
      price: 1990000,
      originalPrice: 2310000,
      image: "images/item-16.jpg",
      rating: 5,
      colors: ["Đen"],
      sizes: ["39", "40", "41", "42"],
      tags: ["SIÊU SALE", "HÀNG MỚI VỀ", "-14%"],
      category: "men"
    }
  ],
  filteredProducts: [],
  searchQuery: ''
}

const mutations = {
  SET_FILTERED_PRODUCTS(state, products) {
    state.filteredProducts = products
  },
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query
  }
}

const actions = {
  filterProducts({ commit, state }, filters) {
    let filtered = [...state.products]
    
    // Filter by search query
    if (state.searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    }
    
    // Filter by price range
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(product => 
        product.price >= min && product.price <= max
      )
    }
    
    // Filter by color
    if (filters.color && filters.color !== 'all') {
      filtered = filtered.filter(product => 
        product.colors.includes(filters.color)
      )
    }
    
    // Filter by size
    if (filters.size && filters.size !== 'all') {
      filtered = filtered.filter(product => 
        product.sizes.includes(filters.size)
      )
    }
    
    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category === filters.category
      )
    }
    
    commit('SET_FILTERED_PRODUCTS', filtered)
  },
  
  searchProducts({ commit, dispatch }, query) {
    commit('SET_SEARCH_QUERY', query)
    dispatch('filterProducts', {})
  }
}

const getters = {
  allProducts: state => state.products,
  filteredProducts: state => state.filteredProducts,
  productById: state => id => state.products.find(product => product.id === id),
  searchQuery: state => state.searchQuery
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

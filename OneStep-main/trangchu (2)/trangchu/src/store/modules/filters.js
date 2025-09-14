const state = {
  priceRange: 'all',
  color: 'all',
  size: 'all',
  category: 'all',
  sortBy: 'name'
}

const mutations = {
  SET_PRICE_RANGE(state, range) {
    state.priceRange = range
  },
  
  SET_COLOR(state, color) {
    state.color = color
  },
  
  SET_SIZE(state, size) {
    state.size = size
  },
  
  SET_CATEGORY(state, category) {
    state.category = category
  },
  
  SET_SORT_BY(state, sortBy) {
    state.sortBy = sortBy
  },
  
  RESET_FILTERS(state) {
    state.priceRange = 'all'
    state.color = 'all'
    state.size = 'all'
    state.category = 'all'
    state.sortBy = 'name'
  }
}

const actions = {
  setPriceRange({ commit }, range) {
    commit('SET_PRICE_RANGE', range)
  },
  
  setColor({ commit }, color) {
    commit('SET_COLOR', color)
  },
  
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  
  setCategory({ commit }, category) {
    commit('SET_CATEGORY', category)
  },
  
  setSortBy({ commit }, sortBy) {
    commit('SET_SORT_BY', sortBy)
  },
  
  resetFilters({ commit }) {
    commit('RESET_FILTERS')
  }
}

const getters = {
  currentFilters: state => ({
    priceRange: state.priceRange,
    color: state.color,
    size: state.size,
    category: state.category,
    sortBy: state.sortBy
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

<template>
    <div class="category-manager">
        <h2>Quản lý danh mục</h2>

        <!-- Thanh tìm kiếm và lọc giống hình -->
        <div class="filter-bar">
            <input v-model="searchTerm" type="text" placeholder="Nhập mã / tên để tìm kiếm.." class="search-input" />
            <select v-model="statusFilter" class="status-select">
                <option value="">Chọn trạng thái</option>
                <option value="active">Kích hoạt</option>
                <option value="inactive">Chưa kích hoạt</option>
            </select>
            <button class="reset-btn" @click="resetFilter">Đặt lại bộ lọc</button>
        </div>

        <!-- Bảng danh mục -->
        <div class="table-wrapper">
            <div class="table-header">
                <p>{{ filteredCategories.length }} danh mục</p>
                <button class="add-btn" @click="startAdd">Thêm mới danh mục</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã DM</th>
                        <th>Tên DM</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Dòng thêm mới -->
                    <tr v-if="addingNew">
                        <td>--</td>
                        <td><input v-model="newCategory.code" placeholder="Mã DM" /></td>
                        <td><input v-model="newCategory.name" placeholder="Tên DM" /></td>
                        <td>
                            <select v-model="newCategory.status">
                                <option value="active">Kích hoạt</option>
                                <option value="inactive">Chưa kích hoạt</option>
                            </select>
                        </td>
                        <td>
                            <button @click="saveNewCategory">💾</button>
                            <button @click="cancelAdd">❌</button>
                        </td>
                    </tr>

                    <!-- Danh mục hiện có -->
                    <tr v-for="(cat, index) in filteredCategories" :key="cat.id">
                        <td>{{ index + 1 }}</td>

                        <!-- Edit inline -->
                        <td v-if="editId === cat.id">
                            <input v-model="editCategory.code" />
                        </td>
                        <td v-else>{{ cat.code }}</td>

                        <td v-if="editId === cat.id">
                            <input v-model="editCategory.name" />
                        </td>
                        <td v-else>{{ cat.name }}</td>

                        <td v-if="editId === cat.id">
                            <select v-model="editCategory.status">
                                <option value="active">Kích hoạt</option>
                                <option value="inactive">Chưa kích hoạt</option>
                            </select>
                        </td>
                        <td v-else>
                            <span :class="cat.status === 'active' ? 'status-active' : 'status-inactive'">
                                {{ cat.status === 'active' ? 'Kích hoạt' : 'Chưa kích hoạt' }}
                            </span>
                        </td>

                        <td>
                            <template v-if="editId === cat.id">
                                <button @click="saveEdit(cat.id)">💾</button>
                                <button @click="cancelEdit">❌</button>
                            </template>
                            <template v-else>
                                <button @click="startEdit(cat)">✏️</button>
                                <button @click="deleteCategory(cat.id)">🗑️</button>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchTerm: '',
            statusFilter: '',
            addingNew: false,
            newCategory: { code: '', name: '', status: 'active' },

            editId: null,
            editCategory: {},

            categories: [
                { id: 1, code: 'DM001', name: 'Giày Sneaker', status: 'active' },
                { id: 2, code: 'DM002', name: 'Giày Sandal', status: 'inactive' },
                { id: 3, code: 'DM003', name: 'Giày Da', status: 'active' },
                { id: 4, code: 'DM004', name: 'Giày Thể Thao', status: 'active' },
                { id: 5, code: 'DM005', name: 'Dép Lê', status: 'active' }
            ]
        }
    },
    computed: {
        filteredCategories() {
            return this.categories.filter(cat => {
                const matchSearch =
                    cat.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    cat.name.toLowerCase().includes(this.searchTerm.toLowerCase());
                const matchStatus = this.statusFilter
                    ? cat.status === this.statusFilter
                    : true;
                return matchSearch && matchStatus;
            });
        }
    },
    methods: {
        resetFilter() {
            this.searchTerm = '';
            this.statusFilter = '';
        },
        startAdd() {
            this.addingNew = true;
            this.newCategory = { code: '', name: '', status: 'active' };
        },
        saveNewCategory() {
            if (!this.newCategory.code || !this.newCategory.name) return alert('Nhập đủ thông tin');
            this.categories.push({ id: Date.now(), ...this.newCategory });
            this.addingNew = false;
        },
        cancelAdd() {
            this.addingNew = false;
        },
        startEdit(cat) {
            this.editId = cat.id;
            this.editCategory = { ...cat };
        },
        saveEdit(id) {
            const idx = this.categories.findIndex(c => c.id === id);
            if (idx !== -1) {
                this.categories[idx] = { ...this.editCategory };
            }
            this.editId = null;
        },
        cancelEdit() {
            this.editId = null;
        },
        deleteCategory(id) {
            this.categories = this.categories.filter(c => c.id !== id);
        }
    }
}
</script>

<style scoped>
.filter-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
}

.search-input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.status-select {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.reset-btn {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
}

.table-wrapper {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
}

.table-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.add-btn {
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
}

.status-active {
    background: #dcfce7;
    color: #166534;
    padding: 2px 6px;
    border-radius: 4px;
}

.status-inactive {
    background: #fee2e2;
    color: #991b1b;
    padding: 2px 6px;
    border-radius: 4px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
    border-bottom: 1px solid #eee;
    text-align: left;
}

td input,
td select {
    width: 100%;
    padding: 4px;
    box-sizing: border-box;
}
</style>
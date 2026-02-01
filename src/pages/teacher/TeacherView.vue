<template>
    <div class="teacher-landscape-wrapper">
        <aside class="sidebar">
            <div class="sidebar-top">
                <div class="brand text-center"> TEACHER PANEL</div>
                <div class="profile-section">
                    <div class="avatar-bg"></div>
                    <div class="profile-info">
                        <small class="label">NAME</small>
                        <div class="name-text">{{ teacherName }}</div>
                    </div>
                </div>

                <div class="code-section">
                    <small class="label">CLASS CODE</small>
                    <div class="code-box" @click="copyClicked">{{ teacherCode }}</div>
                </div>
            </div>

            <button class="logout-btn" @click="handleLogout">LOGOUT</button>
        </aside>

        <main class="main-content">
            <header class="content-header">
                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" v-model="searchQuery" placeholder="Search student name or module..."
                        class="search-input" />
                </div>
                <div class="student-count">{{ filteredStudents.length }} Students</div>
            </header>

            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>STUDENT</th>
                            <th>MODULE</th>
                            <th>COINS</th>
                            <th class="text-center">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in filteredStudents" :key="student.id">
                            <td class="fw-bold">{{ student.name }}</td>
                            <td><span class="module-tag">{{ student.progress?.name }}</span></td>
                            <td><span class="coin-val">⭐ {{ student.coins }}</span></td>
                            <td class="text-center">
                                <button class="view-btn" @click="openDetails(student)">VIEW</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>

        <div v-if="selectedStudent" class="modal-overlay" @click.self="closeDetails">
            <div class="modal-card">
                <div class="modal-header">
                    <h6 class="text-primary fw-bolder"> {{ selectedStudent.name }}</h6>
                    <button class=" btn btn-sm btn-danger close-btn" @click="closeDetails">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-between fw-bold text-uppercase small mb- ">
                        <span class="text-center">Category</span>
                        <span class="text-center">Percentage</span>
                    </div>

                    <!-- Categories -->
                    <div class="flex-grow-1">
                        <div v-for="(cat, index) in selectedStudent.budget_plan" :key="cat.id"
                            class="d-flex align-items-center justify-content-between ">
                            <span class="text-dark w-50 lh-sm">{{ cat.name }}</span>

                            <div class="d-flex align-items-center justify-content-end w-50">
                                <span class="fw-bold fs-6 ms-1 me-1 text-center">
                                    {{ cat.percent }}
                                </span>
                                <span class="fw-bold fs-5">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            teacherName: 'Teacher I',
            teacherCode: 'TCHRUDTDSB',
            searchQuery: '',
            selectedStudent: null,
            studentList: []
        };
    },
    computed: {
        filteredStudents() {
            const q = this.searchQuery.toLowerCase();
            return this.studentList.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.budgetPlan.toLowerCase().includes(q)
            );
        }
    },
    created() {
        this.loadStudent();
    },
    methods: {
        loadStudent() {
            const account = localStorage.getItem('account');
            if (account) {
                this.account = JSON.parse(account);
                this.teacherCode = this.account.user.teacherCode;
                this.teacherName = this.account.user.name;
                this.loader = false
                const students = axios.get('/teacher/retrieve-student', { headers: { Authorization: `Bearer ${this.account.token}` } })
                    .then((response) => {
                        console.log(response.data);
                        this.studentList = response.data.students_progress;
                    }).catch((error) => {
                        console.error('Error fetching students:', error);
                    });
            } else {
                this.$router.push("/home");
            }
        },
        generateStudentData() {
            const modules = ['Amusement', 'Fast Food', 'Subs', 'Market'];
            const names = ['Percival T. Banting', 'Student User I', 'Chesca', 'Ycel Cruz'];

            for (let i = 1; i <= 100; i++) {
                const baseName = names[(i - 1) % names.length];
                this.studentList.push({
                    id: i,
                    name: i <= 4 ? baseName : `${baseName} ${Math.ceil(i / 4)}`,
                    budgetPlan: modules[Math.floor(Math.random() * modules.length)],
                    coins: Math.floor(Math.random() * 500),
                    logs: [
                        { item: 'Entrance Fee', cost: 50 },
                        { item: 'Package A', cost: 150 }
                    ]
                });
            }
        },
        async copyClicked() {
            try {
                await navigator.clipboard.writeText(this.teacherCode);
                alert('Class code copied to clipboard!');
            } catch (err) {
                console.error('Copy failed', err);
            }

        },
        openDetails(student) { this.selectedStudent = student; },
        closeDetails() { this.selectedStudent = null; },
        handleLogout() {
            localStorage.removeItem('account');
            localStorage.clear();
            this.$router.push("/home"); // Assuming you have a login route
        }
    }
};
</script>

<style scoped>
/* LANDSCAPE OPTIMIZATION (800x360) */
.teacher-landscape-wrapper {
    display: flex;
    width: 100vw;
    height: 100vh;
    background: #f4f7f6;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
}

/* SIDEBAR COLORS */
.sidebar {
    width: 25%;
    background: #2c3e50;
    /* Navy Blue */
    color: white;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.brand {
    color: #3498db;
    font-weight: 800;
    font-size: 0.7rem;
    letter-spacing: 1px;
}

.avatar-bg {
    width: 35px;
    height: 35px;
    background: #34495e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
}

.label {
    font-size: 0.55rem;
    color: #95a5a6;
    display: block;
    font-weight: bold;
}

.name-text {
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 12px;
}

.code-box {
    background: #e67e22;
    /* Orange */
    padding: 6px;
    border-radius: 4px;
    text-align: center;
    font-weight: 800;
    font-size: 0.8rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logout-btn {
    background: #e74c3c;
    /* Red */
    border: none;
    color: white;
    padding: 8px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 0.75rem;
}

/* MAIN CONTENT */
.main-content {
    flex: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.search-container {
    background: white;
    padding: 5px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    width: 60%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input {
    border: none;
    outline: none;
    margin-left: 8px;
    width: 100%;
    font-size: 0.8rem;
}

.student-count {
    font-size: 0.7rem;
    font-weight: bold;
    color: #7f8c8d;
}

.table-container {
    background: white;
    border-radius: 8px;
    flex: 1;
    overflow-y: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th {
    position: sticky;
    top: 0;
    background: #ecf0f1;
    padding: 8px;
    font-size: 0.65rem;
    color: #7f8c8d;
    text-align: left;
}

.data-table td {
    padding: 8px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 0.8rem;
}

.module-tag {
    background: #e1f5fe;
    color: #0288d1;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 600;
}

.coin-val {
    font-weight: bold;
    color: #2c3e50;
}

.view-btn {
    background: #3498db;
    /* Action Blue */
    color: white;
    border: none;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: bold;
}

/* MODAL */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-card {
    background: white;
    width: 45%;
    height: 70%;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    background: #f8f9fa;
}

.modal-body {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
}

.log-entry {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px dashed #eee;
    font-size: 0.8rem;
}

.log-price {
    color: #e74c3c;
    font-weight: bold;
}
</style>
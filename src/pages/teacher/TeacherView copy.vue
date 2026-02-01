<template>
    <div class="game-container">
        <img class="title-image" src="/title.png" alt="Mathropolis Title">

        <div class="container">
            <div class="teacher-header">
                <div class="teacher-info-left">
                    <label for="" class="fw-bold">TEACHER'S NAME:</label>
                    <h2 v-if="account" class="teacher-name-value">{{ account.user.name }}</h2>
                </div>

                <div v-if="account" class="teacher-info-right">
                    <label for="" class="h6">CODE:</label>
                    <span class="teacher-code-value">{{ account.user.teacherCode }}</span>
                </div>
            </div>

            <hr>

            <table class="table student-roster-header">
                <thead>
                    <tr>
                        <th class="col-name">NAME</th>
                        <th class="col-progress">GAME PROGRESS</th>
                    </tr>
                </thead>
            </table>

            <div class="table-scroll-body">
                <table class="table student-roster-body">
                    <tbody v-if="students">
                        <tr v-for="student in students" :key="student.id">
                            <td class="col-name">{{ student.name }}</td>
                            <td class="col-progress">{{ student.progress }}</td>
                        </tr>

                        <tr v-if="students.length === 0">
                            <td colspan="2" class="text-center">No students have used your code yet.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button @click="logout" class="btn btn-primary logout-button">LOGOUT</button>
        </div>
    </div>
    <div v-if="loader" class="loader-overlay">
        <div class="loader-spinner"></div>
    </div>
</template>
<script>
import { ScreenOrientation } from '@capacitor/screen-orientation';
import axios from 'axios';

export default {
    name: 'TeacherView',
    data() {
        return {
            loader: true,
            account: null,
            errors: {},
            // Placeholder Student Data for demonstration
            students: []
        }
    },
    mounted() {
        const account = localStorage.getItem('account');
        if (account) {
            this.account = JSON.parse(account);
            this.loader = false
            const students = axios.get('/teacher/retrieve-student', { headers: { Authorization: `Bearer ${this.account.token}` } })
                .then((response) => {
                    console.log(response.data);
                    this.students = response.data.students_progress;
                }).catch((error) => {
                    console.error('Error fetching students:', error);
                });
        } else {
            this.$router.push("/home");
        }
        // Locking to portrait as per original code
        ScreenOrientation.lock({ orientation: 'portrait' })
            .catch((err) => {
                console.error('Error locking screen orientation:', err);
            });
    },
    methods: {
        logout() {
            localStorage.removeItem('account');
            localStorage.clear();
            this.$router.push("/home"); // Assuming you have a login route
        }
    }

}
</script>
<style scoped>
.title-image {
    position: absolute;
    top: 0%;
    max-width: 100%;
    height: auto;
}

/* Existing styles shortened for brevity, focusing on new/modified styles */
h2 {
    color: #4CAF50;
    margin-bottom: 15px;
    font-size: 2.2em;
    text-shadow: 2px 2px #fff;
}

.game-container {
    background-color: rgba(0, 0, 0, 0.3);
    height: 100vh;
}

.container {
    /* Centering the dashboard panel */
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    /* Increased padding */
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    max-width: 450px;
    /* Adjusted max-width */
    width: 90%;
    height: 100%;
    border: 3px solid #66bb6a;
}

.teacher-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.teacher-name-value {
    color: #000;
    /* Darker color for name */
    font-size: 1.5em;
    margin: 0;
}

.teacher-code-value {
    background-color: #4a90e2;
    /* Blue background for code */
    color: white;
    padding: 5px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 1em;
    margin-left: 5px;
    display: inline-block;
}

/* --- Table Scroll Fixes --- */

/* Ensures the header table doesn't scroll */
.student-roster-header {
    width: 100%;
    margin-bottom: 0;
    /* Remove default table margin */
    table-layout: fixed;
    /* Ensures fixed column widths */
}

.student-roster-header th {
    background-color: #e8f5e9;
    /* Use the light green background */
    border-bottom: 1px solid #ddd;
}

/* The element that makes the table body scrollable */
.table-scroll-body {
    max-height: 150px;
    /* Adjust this value as needed for the height of the scrollable area */
    overflow-y: auto;

    /* Enable vertical scrolling */
    border: 1px solid #ddd;
    /* Optional: border around the scrollable area */
}

/* The body table should fill its container */
.student-roster-body {
    width: 100%;
    margin-bottom: 0;
    table-layout: fixed;
    /* Ensures fixed column widths match the header */
}

.student-roster-body td {
    border-top: none;
    /* Remove duplicate top border */
    border-bottom: 1px solid #eee;
    /* Light divider */
}

/* Define column widths (Must match in both header and body tables) */
.col-name {
    width: 50%;
}

.col-progress {
    width: 50%;
}

.logout-button {
    background-color: #f44336;
    /* Red/standard logout color */
    box-shadow: 0 4px #d32f2f;
    margin-top: 20px;
    width: 100%;
}

.logout-button:hover {
    background-color: #d32f2f;
}

/* ... keep other utility styles like loader, responsive media queries, etc. ... */
</style>
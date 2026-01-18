<template>
    <div class="game-container">
        <img class="title-image" src="/title.png" alt="">
        <div class="container">
            <h2>Join Mathropolis!</h2>
            <form @submit.prevent="registerAccount" method="POST">
                <div class="form-group">
                    <label for="new-username">Choose a Username:</label>
                    <input type="text" v-model="formData.username" required>
                    <small v-if="errors.username" class="error">{{ errors.username }}</small>
                </div>
                <div class="form-group">
                    <label for="new-username">Enter your Fullname:</label>
                    <input type="text" v-model="formData.name" required>
                    <small v-if="errors.name" class="error">{{ errors.name }}</small>
                </div>
                <div class="form-group">
                    <label for="new-password">Create a Password:</label>
                    <input type="password" v-model="formData.password" required>
                    <small v-if="errors.password" class="error">{{ errors.password }}</small>
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirm Password:</label>
                    <input type="password" v-model="formData.password_confirmation" required>
                    <small v-if="errors.password_confirmation" class="error">{{ errors.password_confirmation }}</small>
                </div>
                <div class="form-group">
                    <label for="new-username">Teacher Code</label>
                    <input type="text" v-model="formData.teacherCode" required>
                    <small v-if="errors.teacherCode" class="error">{{ errors.teacherCode }}</small>
                </div>
                <button type="submit" class="mt-2">Register to Play</button>
            </form>
            <div class="switch-form">
                Already have an account? <a style="color: #FF9800;" @click="goto">Login to Play</a>
            </div>
        </div>
    </div>
    <div v-if="loader" class="loader-overlay">
        <div class="loader-spinner"></div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'Registration',
    data() {
        const buildings = [
            {
                name: "Bank",
                route: "/building/bank",
                style: "bottom: 40%; left: 7%; width: 15%; height: 20%;",
                isLocked: true,
                isDone: null
            },
            {
                name: "Supermarket",
                route: "building/supermarket",
                style: "top: 14%; left: 23%; width: 15%; height: 20%;",
                isLocked: true,
                isDone: null,
            },
            {
                name: "Restaurant",
                route: "building/fastfood",
                style: "top: 15%; left: 56%; width: 15%; height: 20%;",
                isLocked: true,
                isDone: null
            },
            {
                name: "Subscription",
                route: "/building/online-subscription",
                style: "top: 45%; right: 13%; width: 15%; height: 20%;",
                isLocked: true,
                isDone: null
            },
            {
                name: "House",
                route: "building/house",
                style: "bottom: 35%; left: 40%; width: 15%; height: 20%;",
                isLocked: false,
                isDone: null
            },
            {
                name: "Department Store",
                route: "/building/department-store",
                style: "bottom: 2%; left: 23%; width: 15%; height: 20%;",
                isLocked: true,
                isDone: null
            },
            {
                name: "Amusement",
                route: "/building/amusement",
                style: "bottom: 3%; right: 9%; width: 15%; height: 20%;",
                isLocked: true,
                isDone: null
            },
        ]
        return {
            loader: false,
            buildings,
            formData: {
                username: "",
                name: "",
                password: "",
                password_confirmation: "",
                teacherCode: ""
            },
            errors: {}
        }
    },
    methods: {
        goto() {
            this.$router.push("/home")
        },
        validateForm() {
            this.errors = {}

            if (!this.formData.username.trim()) {
                this.errors.username = "Username is required."
            }

            if (!this.formData.name.trim()) {
                this.errors.name = "Full name is required."
            }

            if (!this.formData.password) {
                this.errors.password = "Password is required."
            } else if (this.formData.password.length < 6) {
                this.errors.password = "Password must be at least 6 characters."
            }

            if (!this.formData.password_confirmation) {
                this.errors.password_confirmation = "Please confirm your password."
            } else if (this.formData.password_confirmation !== this.formData.password) {
                this.errors.password_confirmation = "Passwords do not match."
            }

            if (!this.formData.teacherCode.trim()) {
                this.errors.teacherCode = "Teacher code is required."
            }

            // Return true only if no errors
            return Object.keys(this.errors).length === 0
        },
        async registerAccount() {
            if (!this.validateForm()) {
                console.log("Form validation failed:", this.errors)
                return // Stop submission
            }
            this.loader = true
            // If valid, send API request
            console.log("Form valid! Sending to server:", this.formData)
            /*  const response = await axios.post('/register', this.formData) */
            try {
                const response = await axios.post("/register", this.formData, {
                    withCredentials: true
                });
                console.log(response)
                const { username } = response.data
                localStorage.setItem('account', JSON.stringify(response.data))
                localStorage.setItem('buildings', JSON.stringify(this.buildings))
                localStorage.setItem('coin', 0)
                if (response.data.user.isTeacher) {
                    this.$router.push("/teacher");
                } else {
                    this.$router.push("/map");
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    const serverErrors = error.response.data.errors;
                    this.errors = { ...this.errors, ...serverErrors };
                } else {
                    alert("Registration failed:" + error)
                    console.error("Registration failed:", error);
                }
            } finally {
                this.loader = false
            }

        }
    }

}
</script>
<style scoped>
h2 {
    color: #4CAF50;
    margin-bottom: 15px;
    font-size: 2.2em;
    text-shadow: 2px 2px #fff;
}

.game-container {
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100vh;
    overflow-y: auto;
}



.title-image {
    position: absolute;
    top: 0%;
    max-width: 100%;
    height: auto;
}

.container {
    top: 10px;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    /* Slightly transparent white */
    padding: 10px 20px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 90%;
    border: 3px solid #66bb6a;
    /* Green border like the logo */
    overflow-y: auto;
}


.form-group {
    margin-bottom: 20px;
    text-align: left;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555;
    font-size: 1.1em;
}

input[type="text"],
input[type="password"] {
    width: calc(100% - 20px);
    padding: 12px;
    border: 2px solid #a5d6a7;
    /* Light green border */
    border-radius: 8px;
    font-size: 1em;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="password"]:focus {
    border-color: #4CAF50;
    outline: none;
}

button {
    background-color: #2196F3;
    /* Blue button like "Login to Play" */
    color: white;
    padding: 14px 25px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2em;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px #1976D2;
    /* Darker blue shadow */
}

button:hover {
    background-color: #1976D2;
    transform: translateY(-2px);
}

button:active {
    transform: translateY(0);
    box-shadow: 0 2px #1976D2;
}

.switch-form {
    margin-top: 20px;
    font-size: 0.95em;
}

.switch-form a {
    color: #FF9800;
    /* Orange for links */
    text-decoration: none;
    font-weight: bold;
}

.switch-form a:hover {
    text-decoration: underline;
}

@media (min-width: 600px) {
    .container {
        width: 50%;
        bottom: 2%;
    }

    label {
        display: block;
        margin-bottom: 4px;
        font-weight: bold;
        color: #555;
        font-size: 0.9em;
    }

    input[type="text"],
    input[type="password"] {
        width: 100%;
        padding: 2px;
        border: 2px solid #a5d6a7;
        /* Light green border */
        border-radius: 8px;
        font-size: 1em;
        box-sizing: border-box;
        transition: border-color 0.3s ease;
    }

    input[type="text"]:focus,
    input[type="password"]:focus {
        border-color: #4CAF50;
        outline: none;
    }

    button {
        padding: 7px 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1em;
        font-weight: bold;
        transition: background-color 0.3s ease, transform 0.2s ease;
        box-shadow: 0 2px #1976D2;
        /* Darker blue shadow */
    }

    .form-group {
        margin-bottom: 5px;
        text-align: left;
    }

}

@media (orientation: portrait) {
    .container {
        width: 90;
        top: 20%;
    }

    label {
        display: block;
        margin-bottom: 4px;
        font-weight: bold;
        color: #555;
        font-size: 0.9em;
    }

    input[type="text"],
    input[type="password"] {
        width: 100%;
        padding: 2px;
        border: 2px solid #a5d6a7;
        border-radius: 8px;
        font-size: 1em;
        box-sizing: border-box;
        transition: border-color 0.3s ease;
    }

    input[type="text"]:focus,
    input[type="password"]:focus {
        border-color: #4CAF50;
        outline: none;
    }

    button {
        padding: 7px 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1em;
        font-weight: bold;
        box-shadow: 0 2px #1976D2;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .form-group {
        margin-bottom: 5px;
        text-align: left;
    }
}

.error {
    color: red;
    font-size: 0.8em;
}

.loader-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loader-spinner {
    width: 60px;
    height: 60px;
    border: 6px solid #ddd;
    border-top-color: #1976D2;
    /* Primary blue */
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
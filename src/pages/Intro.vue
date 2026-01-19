<template>
    <div class="intro-container">
        <img class="title-image" src="/title.png" alt="">
        <div class="container">
            <form @submit.prevent="loginAccount" method="POST">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" v-model="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" v-model="password" required>
                </div>
                <button type="submit">Login to Play</button>
            </form>
            <div class="switch-form">
                Don't have an account? <a style="color: #FF9800;" @click="goto">Register to Play</a>
            </div>
        </div>
    </div>
    <div v-if="loader" class="loader-overlay">
        <div class="loader-spinner"></div>
    </div>
    <div v-if="message" class="message-box bg-danger text-white">
        {{ message }}
    </div>
</template>

<script>
import axios from 'axios';
import { DEFAULT_BUILDINGS, DEFAULT_CATEGORIES } from "../store/gameData.js"
export default {
    data() {
        return {
            username: null,
            password: null,
            loader: false,
            message: null

        }
    },
    mounted() {
        // Check if account exists in localStorage
        try {
            const accountData = localStorage.getItem('account');
            if (accountData) {
                const account = JSON.parse(accountData);
                console.log("Account found in localStorage:", account);
                if (account.user.isTeacher) {
                    this.$router.push("/teacher");
                } else {
                    this.$router.push("/map");
                }
            }
        } catch (error) {
        }

    },
    methods: {
        goto() {
            this.$router.push("/register")
        },
        async loginAccount() {
            this.loader = true
            try {
                const formData = new FormData()
                formData.append('username', this.username)
                formData.append('password', this.password)
                //const response = await login(formData)
                const response = await axios.post('/login', formData)
                console.log('Login success:', response.data)
                // Save account data to localStorage
                const { username } = response.data
                localStorage.setItem('account', JSON.stringify(response.data))
                /*   localStorage.setItem('buildings', JSON.stringify(this.DEFAULT_BUILDINGS))
                  localStorage.setItem('coin', 0) */
                if (response.data.user.isTeacher) {
                    this.$router.push("/teacher");
                } else {
                    this.$router.push("/map");
                }

                this.showMessage("Login successful! Redirecting...")
            }
            catch (error) {
                console.log("Login error details:", error.message)
                if (error.response && error.response.data && error.response.data.message) {
                    this.showMessage(error.response.data.message)
                    return
                }
                this.showMessage("Login failed:" + error + ' - ' + axios.defaults.baseURL)
                console.log(axios.defaults.baseURL)
            } finally {
                this.loader = false
            }
            const account = {
                username,
                coin: 0.00
            }

        },
        showMessage(text) {
            this.message = text;
            setTimeout(() => {
                this.message = null;
            }, 2000);
        }
    }
};
</script>

<style scoped>
.intro-container {
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100vh;
    overflow-x: hidden;
}



.title-image {
    top: 20%;
    position: absolute;
    max-height: 95%;
}

.container {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    /* Slightly transparent white */
    padding: 10px 20px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-width: 400px;
    width: 90%;
    border: 3px solid #66bb6a;
    /* Green border like the logo */
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

@media (min-width: 700px) {
    .title-image {
        top: -5%;
    }

    .container {
        width: 50%;
        top: 40%;
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

.message-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10001;
    padding: 15px 30px;
    border-radius: 8px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: rgba(0, 0, 0, 0.2);
}
</style>

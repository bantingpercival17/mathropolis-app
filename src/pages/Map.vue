<template>
    <template v-if="taskComplete">
        <Navbar budgetName="Map" :store="false" @reset="resetGame" :tools="enabledTools" :coins="coin" />
        <img class="mia-position" :src="mia" alt="mia character" style="" @click="playAudio">
        <div class="mission-overlay d-flex align-items-center justify-content-center text-center">
            <div class="container py-5 px-4 rounded-5  ">

                <div class="row mb-2">
                    <div class="col">
                        <h4 style=" letter-spacing: 2px;font-family: 'Modak', cursive;"
                            class=" fw-bold text-success border border-success border-3 rounded-pill py-2 bg-white bg-opacity-75">
                            TASK COMPLETED!
                        </h4>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col">
                        <div class="p-4 rounded-4 bg-white bg-opacity-90 border border-success border-3">
                            <label class="display-2 fw-bolder text-success  mb-1" style=" letter-spacing: 2px;">
                                CONGRATULATIONS!!!
                            </label>
                            <h6 class="fw-bold text-secondary text-uppercase">
                                Allowance fully spent and mission successfully finished
                            </h6>
                            <button class="btn btn-sm btn-success rounded" @click="resetGame">START A NEW
                                GAME</button>
                        </div>
                    </div>
                </div>
                <div class="quote-box p-2 rounded-pill bg-white bg-opacity-75 border border-success border-2">
                    <p class="fst-italic fw-bold text-success mb-0 h6">
                        “A BUDGET IS NOT A LIMIT—IT’S A PLAN FOR YOUR GOALS.”
                    </p>
                </div>

            </div>
        </div>
    </template>
    <div v-else class="">
        <Navbar budgetName="Map" :store="false" @reset="resetGame" :tools="enabledTools" :coins="coin" />

        <div v-for="building in buildings" :key="building.name" :alt="building.name" class="building"
            :style="building.style" @click="goTo(building)">
            <img v-if="building.isLocked" class="lock" src="/assets/lock.png" alt="">
        </div>

        <img class="mia-position" :src="mia" alt="mia character" style="" @click="playAudio">

    </div>
    <div v-if="loader" class="loader-overlay">
        <div class="loader-spinner"></div>
    </div>
    <div v-if="message" class="message-box bg-danger text-white">
        {{ message }}
    </div>




</template>

<script scoped>
import { fetchGameProgress, storeGameProgress } from "../controller";
import { DEFAULT_BUILDINGS, DEFAULT_CATEGORIES } from "../store/gameData.js"
import Navbar from "./Navbar.vue";
export default {
    name: "GameMap",
    components: {
        Navbar
    },
    data() {
        return {
            coin: 0.00,
            loader: false,
            mia: '/assets/mia.png',
            audioSrc: null,
            audio1: null,
            audio2: null,
            message: '',
            DEFAULT_BUILDINGS, DEFAULT_CATEGORIES,
            taskComplete: false,
            buildings: [],
        };
    },
    computed: {
        enabledTools() {
            try {
                const buildings = JSON.parse(localStorage.getItem('buildings')) ?? [];
                return Object.fromEntries(
                    buildings.map(({ name, isDone }) => [name, !!isDone])
                );
            } catch {
                return {};
            }
        },
        isAllDone() {
            const checker = JSON.parse(localStorage.getItem('buildings')) ?? null;
            if (checker) {
                return checker.every(value => value.isDone !== null) ?? false;
            }
            return false
        }
    },
    async mounted() {
        this.coin = parseFloat(localStorage.getItem('coin'))

        this.loadBuilding()

    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.name === 'home') {
                vm.playAudio();
            }
        });
    },
    beforeRouteLeave(to, from, next) {
        this.stopAudio();  // <-- ensures audio stops when leaving the page
        next();
    },

    methods: {
        async loadBuilding() {
            this.loader = true;
            const account = JSON.parse(localStorage.getItem('account'));
            if (!account) {
                this.loader = false;
                this.$router.push("/home");
                return;
            }

            if (account.user?.isTeacher) {
                this.loader = false;
                this.$router.push("/teacher");
                return;
            }

            try {
                const data = await fetchGameProgress();
                const buildings = JSON.parse(localStorage.getItem('buildings'));
                const isDone = this.isAllBuildingDone();
                if (isDone) {
                    this.taskComplete = true;
                }
                if (buildings) {
                    this.buildings = buildings;
                }

                if (this.$route.name === 'home') {
                    this.playAudio();
                }

                this.$router.push("/map");
            } catch (error) {
                console.error("Error loading game progress:", error);
            } finally {
                this.loader = false;
            }

        },
        // ... your existing methods ...
        goTo(building) {
            this.stopAudio();
            if (!building.isLocked) {
                this.$router.push(building.route);
            } else {
                alert("This " + building.name + " is Locked")
            }
        },
        playAudio() {
            this.audio1 = new Audio('/assets/mia-voice/intro1.mp3');
            this.audio2 = new Audio('/assets/mia-voice/intro2.mp3');

            // Play first audio
            this.audio1.play().catch(err => console.log('Audio play failed:', err));

            // When first audio ends, play second
            this.audio1.addEventListener('ended', () => {
                this.audio2.play().catch(err => console.log('Audio play failed:', err));
            });
        },
        stopAudio() {
            if (this.audio1) {
                this.audio1.pause();
                this.audio1.currentTime = 0;
            }
            if (this.audio2) {
                this.audio2.pause();
                this.audio2.currentTime = 0;
            }
        },
        isAllBuildingDone() {
            const checker = JSON.parse(localStorage.getItem('buildings')) ?? null;
            if (checker) {
                return checker.every(value => value.isDone !== null) ?? false;
            }
            return false
        },
        async resetGame() {
            this.loader = true;

            try {
                // Initialize storage
                localStorage.setItem('buildings', JSON.stringify(this.DEFAULT_BUILDINGS));
                localStorage.setItem('budgetPlan', JSON.stringify(this.DEFAULT_CATEGORIES));
                localStorage.setItem('coin', 0);
                await storeGameProgress();
                const account = JSON.parse(localStorage.getItem('account'));
                if (!account) {
                    this.$router.push("/home");
                    return;
                }
                if (account.user?.isTeacher) {
                    this.$router.push("/teacher");
                    return;
                }
                // Student flow
                await fetchGameProgress();
                this.buildings = JSON.parse(localStorage.getItem('buildings')) || [];
                this.coin = Number(localStorage.getItem('coin')) || 0;

                if (this.$route.name === 'home') {
                    this.playAudio();
                }

                window.location.reload()

            } catch (error) {
                console.error("Initialization failed:", error);
            } finally {
                this.loader = false;
            }

        }
    },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com');

/* 🔑 KEY: Ensures this container fills the parent (intro-bg) and is the positioning context */
.building-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.building {
    position: absolute;
    cursor: pointer;
    transition: all 0.2s ease-out;

    /* Center the lock image */
    display: flex;
    justify-content: center;
    align-items: center;
}

.lock {
    width: 70%;
    height: auto;
    /* keep proportions */
}

.building:hover {
    z-index: 5;
    /* Optional: Provides a visual feedback when hovering over the invisible area */
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 10px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
}

/* .mia-position {

    left: 5%;
    z-index: 2;
    width: 35%;
} */

.mia-position {
    position: absolute;
    top: 60%;
    width: 13%;
    z-index: 2;
}

.coin-bg {
    /* ... (Existing styles) ... */
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20%;
    height: 15%;
    /* ... (Other styles) ... */
    text-align: center;
    /* Still useful for older browsers/fallback */

    /* New/Modified centering styles */
    display: flex;
    /* Turn it into a flex container */
    align-items: center;
    /* Center item vertically */
    justify-content: center;
    background-image: url('/assets/coin-bg.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    /* Center item horizontally */
    z-index: 2;
    font-family: 'Sandspit', sans-serif;
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


/* Background mimicking your game map */
.mission-overlay {
    min-height: 100vh;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/assets/your-city-background.png');
    background-size: cover;
    background-position: center;
    position: fixed;
    width: 100%;
    z-index: 1050;
}

.mission-card {
    max-width: 900px;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
}

.fw-black {
    font-weight: 900;
}

/* Custom styling for the "Congratulations" text stroke if needed */
h1 {
    -webkit-text-stroke: 2px #0dcaf0;
    /* Bootstrap Info Color */
    color: white;
}
</style>
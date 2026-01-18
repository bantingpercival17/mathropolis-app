<template>
    <div class="">
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
            loader: false,
            mia: '/assets/mia.png',
            audioSrc: null,
            buildings: [],
            audio1: null,
            audio2: null,
            message: '',
            DEFAULT_BUILDINGS, DEFAULT_CATEGORIES
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
        coin() {
            return localStorage.getItem('coin') ?? 0;
        }
    },
    async mounted() {
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
                await fetchGameProgress();

                const coin = localStorage.getItem('coin');
                const buildings = JSON.parse(localStorage.getItem('buildings'));

                if (buildings) {
                    this.buildings = buildings;
                }

                this.coin = coin;

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
        async resetGame() {
            this.loader = true;

            try {
                // Initialize storage
                localStorage.setItem('buildings', JSON.stringify(this.DEFAULT_BUILDINGS));
                localStorage.setItem('budgetPlan', JSON.stringify(this.DEFAULT_CATEGORIES));
                localStorage.setItem('coin', '0');
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

                this.$router.push("/map");

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
</style>
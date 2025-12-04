<template>
    <div class="building-container">
        <Navbar budgetName="Map" :store="false" />

        <div v-for="building in buildings" :key="building.name" :alt="building.name" class="building"
            :style="building.style" @click="goTo(building)">
            <img v-if="building.isLocked" class="lock" src="/assets/lock.png" alt="">
        </div>


        <img class="mia-position" :src="mia" alt="mia character" style="" @click="playAudio">

    </div>
</template>

<script scoped>
import { fetchGameProgress } from "../controller";
import Navbar from "./Navbar.vue";
export default {
    name: "GameMap",
    components: {
        Navbar
    },
    data() {
        return {
            coin: 0,
            mia: '/assets/mia.png',
            audioSrc: null,
            buildings: [],
            audio1: null,
            audio2: null,
        };
    },
    async mounted() {
        const account = JSON.parse(localStorage.getItem('account'))
        if (!account) {
            this.$router.push("/home");
        } else {
            const account = JSON.parse(localStorage.getItem('account'));
            if (account.user.isTeacher) {
                this.$router.push("/teacher");

            } else {
                this.$router.push("/map");
                await fetchGameProgress();
                const coin = localStorage.getItem('coin')
                const buildings = JSON.parse(localStorage.getItem('buildings'));
                if (buildings) {
                    this.buildings = buildings;
                }
                this.coin = coin
                if (this.$router.name === 'home') {
                    this.playAudio();
                }

            }
        }
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
        // ... your existing methods ...
        goTo(building) {
            this.stopAudio();
            if (!building.isLocked) {
                this.$router.push(building.route);
            } else {
                alert("This Building is Locked")
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
</style>
<template>
    <div class="game-container  vh-100">
        <div class="flex-fill position-relative intro-bg">
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    /*  components: {
         Navbar
     }, */
    data() {
        return {
            bgMusic: null
        }
    },

    mounted() {
        // Load the music file
        /*   this.bgMusic = new Audio('/assets/audio/map.mp3')
          this.bgMusic.loop = true */
        /* this.bgMusic.volume = 01 */

        // Wait for a user click/touch (autoplay policy)
        // Try to autoplay
        /* this.bgMusic.play().catch(err => {
            console.warn('Autoplay blocked:', err)
        }) */
    },

    // ... rest of your script
};
</script>

<style>
@font-face {
    font-family: 'Children Sans';
    src: url('/assets/fonts/childrensans.regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

body {
    font-family: 'Children Sans', sans-serif;
}

.game-container {
    background: #dff5f2;
    overflow-x: hidden;
}

/* 🎨 THE RESPONSIVE BACKGROUND MAP STYLES */
.intro-bg {
    width: 100%;
    height: 100vh;
    /* 1. Sets the image source */
    background-image: url('/assets/map.png');
    /* 2. Centers the image */
    background-position: center;
    /* 3. SCALES the image to cover the entire container (the key to responsiveness) */
    background-size: cover;
    /* 4. Prevents the image from tiling */
    background-repeat: no-repeat;
    /* This element is the positioning context for the GameMap component */
    position: relative;
}
</style>
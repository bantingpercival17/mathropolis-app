<template>
    <router-view />
</template>

<script>
import { safeLockOrientation } from './util-orientation';
export default {
    name: "App",
    mounted() {
        safeLockOrientation('landscape-primary');
    }
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
    margin: 0;
    font-family: 'Children Sans', sans-serif;
    height: 100vh;
    overflow-x: hidden;
}

button {
    margin: 6px;
    padding: 8px 16px;
    cursor: pointer;
}
</style>

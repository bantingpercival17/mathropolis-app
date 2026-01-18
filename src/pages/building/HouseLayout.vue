<template>
    <!--  <div class="coin-bg">
        <span style="font-size: 16px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">₱
            0.00</span>
    </div> -->
    <div class="house-bg">

        <div class="house-layout" v-html="houseData[currentIndex].instruction" @click="handleClick">

        </div>
        <a v-if="currentIndex < houseData.length - 1" class="next-button-v2" @click="nextInstruction">
            <svg width="110" height="34" viewBox="0 0 110 34" xmlns="http://www.w3.org/2000/svg" role="img"
                aria-label="Next">
                <rect x="0" y="0" width="110" height="34" rx="17" fill="#008f66" />
                <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="14"
                    fill="#f7fff9">NEXT</text>
                <g transform="translate(74,9)">
                    <path d="M0 3 L6 9 L0 15" stroke="#f7fff9" stroke-width="2.6" stroke-linecap="round"
                        stroke-linejoin="round" fill="none" />
                    <path d="M6 3 L12 9 L6 15" stroke="#f7fff9" stroke-width="2.6" stroke-linecap="round"
                        stroke-linejoin="round" fill="none" />
                </g>
            </svg>

        </a>
        <a v-else class="next-button-v2" @click="nextInstruction">
            <svg width="160" height="50" viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg">
                <rect width="160" height="50" rx="25" fill="#00C08B" />
                <polygon points="20,15 20,35 38,25" fill="white" />
                <text x="55%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20"
                    font-weight="bold" fill="#fff">
                    START
                </text>
            </svg>

        </a>
    </div>
    <div v-if="currentIndex > 2" class="formula-icon">
        <img @click="backToFormula" src="/assets/tools/formula.png" width="10%" alt="">
    </div>
</template>
<script>
import { storeGameProgress, fetchGameProgress } from '../../controller';

export default {
    name: "HouseLayout",
    data() {
        return {
            houseData: [
                {
                    instruction: `
                    <p style="font-size:24px;text-align:center; color:#1daa81"; font-weight: bolder;>Welcome to Mathropolis, traveler!<p/>
                    <p>Here, every establishment is more than just a place to visit—it’s a chance to learn how to manage your money wisely. In this city, your decisions shape your future. Will you spend recklessly, or will you learn to budget?</p>
                                    <p>That’s up to you!</p>
                                    <p>Your journey begins with a small savings pouch and a list of goals</p> `,
                    audio: new Audio('/assets/mia-voice/house-1.mp3')
                }, {
                    instruction: `<p>Hey, a quick tip before you go!</p>
                                <p>Budgeting isn’t just about tracking money—it’s your power skill in Budgetville:</p>
                                <ul>
                                    <li>Use it to plan your expenses so you never spend more than you earn.</li>
                                    <li>Apply it to separate needs from wants and make smarter choices.</li>
                                    <li>And don’t forget saving goals—budgeting helps you set aside money for dreams, emergencies, and future plans!</li>
                                </ul>
                                <p>Remember: if you can control your budget, you can control your future.</p>`,
                    audio: new Audio('/assets/mia-voice/house-2.mp3')
                },
                {
                    instruction: `<div class="paper-content">
                <h1 class="main-title">MATHEMATICAL CONCEPTS<br>OF FINANCIAL LITERACY</h1>
                <p class="instruction">Solve money problems involving percentages</p>
                <div class="concepts-grid">
                <ul class="concepts-list">
                    <li data-formula="3">INCREASE</li>
                    <li data-formula="4">DECREASE</li>
                    <li data-formula="5">DISCOUNT</li>
                </ul>
                <ul class="concepts-list">
                    <li data-formula="6">COMMISSION</li>
                    <li data-formula="7">SALES TAX</li>
                    <li data-formula="8">SIMPLE INTEREST</li>
                </ul>
            </div>
            </div>`,
                    audio: null
                },
                {
                    instruction: `<p style="font: 2rem; color: red; font-weight: 900;" class="text-red">Percentage Increase:</p>
<p>Percentage increase measures how much a value has gone up, expressed as a percent.</p>
<div style="text-align:center;">
<img style="width: 60%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-1.png" alt="">
</div>
<p>In the game, you’ll solve problems like this to unlock new areas.</p>`,
                    audio: new Audio('/assets/mia-voice/house-3.mp3')
                },
                {
                    instruction: `<p style="font: 2rem; color: red; font-weight: 900;" class="text-red">Percentage Decrease:</p>
<p>Percentage decrease measures how much a value went down, expressed as a percent.</p>
<div style="text-align:center;">
<img style="width: 60%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-2.png" alt="">
</div>
<p>In the game, you’ll solve problems like this to unlock new areas. </p>`,
                    audio: new Audio('/assets/mia-voice/house-4.mp3')
                },
                {
                    instruction: `<p style="font: 2rem; color: red; font-weight: 900;" class="text-red">Discount</p>
<p>Discount is the amount reduced from the original price</p>
<div style="text-align:center;">
<img style="width: 60%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-3.png" alt="">
    </div>
<p>In the game, you’ll solve problems like this to unlock new areas. </p>`,
                    audio: new Audio('/assets/mia-voice/house-5.mp3')
                },
                {
                    instruction: `<p style="font: 2rem; color: red; font-weight: 900;" class="text-red">Commission</p>
<p>Commission is the amount earned based on sales.</p>
<div style="text-align:center;">
<img style="width: 60%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-4.png" alt="">
    </div>
<p>In the game, you’ll solve problems like this to unlock new areas. </p>`,
                    audio: new Audio('/assets/mia-voice/house-6.mp3')
                },
                {
                    instruction: `<p style="font: 2rem; color: red; font-weight: 900;" class="text-red">Sales Tax</p>
<p>Sales tax is the additional amount added to the price of goods.</p>
<div style="text-align:center;">
<img style="width: 60%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-5.png" alt="">
    </div>
<p>In the game, you’ll solve problems like this to unlock new areas. </p>`,
                    audio: new Audio('/assets/mia-voice/house-7.mp3')
                },
                {
                    instruction: `<p style="font: 2rem; color: red; font-weight: 900;" class="text-red"> Simple Interest</p>
<p>Simple interest is the cost of borrowing money.</p>
<div style="text-align:center;">
<img style="width: 60%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-6.png" alt="">
    </div>
<p>In the game, you’ll solve problems like this to unlock new areas. </p>`,
                    audio: new Audio('/assets/mia-voice/house-8.mp3')
                }
                , {
                    instruction: `<p style="font: 24px; color: blue; font-weight: 900;">Welcome to your very first challenge in Mathropolis!</p>
<p>Here’s your starter credit card it holds your first savings of ₱5,000. You’ll need to head inside the bank to
    withdraw it. But remember, this isn’t just money to spend freely it’s the foundation of your budgeting journey!</p>
<p>So get ready your adventure in Mathropolis starts now.</p>`,
                    audio: new Audio('/assets/mia-voice/house-9.mp3')
                }
            ],
            currentIndex: 0
        };
    },
    mounted() {
        this.playCurrentAudio();
    },
    beforeRouteLeave(to, from, next) {
        this.stopAudio();  // <-- ensures audio stops when leaving the page
        next();
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
        playCurrentAudio() {
            this.houseData.forEach(item => {
                if (item.audio) {
                    item.audio.pause();
                    item.audio.currentTime = 0; // reset audio to start
                }
            });

            const currentAudio = this.houseData[this.currentIndex].audio;
            if (currentAudio) {
                currentAudio.play().catch(err => console.log('Audio play failed:', err));
            }
        },
        backToFormula() {
            this.currentIndex = 2
            this.playCurrentAudio();
        },
        async nextInstruction() {
            if (this.currentIndex < this.houseData.length - 1) {
                this.currentIndex++;
                this.playCurrentAudio();
            } else {
                let buildings = JSON.parse(localStorage.getItem('buildings') || '[]');
                buildings.forEach(b => {
                    if (b.name === 'Bank') b.isLocked = false;
                    if (b.name === 'House') { b.isDone = true; b.isLocked = true; }
                });
                localStorage.setItem('buildings', JSON.stringify(buildings));
                await storeGameProgress();
                // Navigate to the next page after the last instruction
                await fetchGameProgress()
                this.$router.push('/map');
            }
        },
        handleClick(event) {
            const formula = event.target.dataset.formula;
            if (formula) {
                this.selectFormula(Number(formula));
            }
        },
        selectFormula(index) {
            console.log(index)
            this.currentIndex = index
            if (this.currentIndex < this.houseData.length - 1) {
                this.playCurrentAudio();
            } else {
                // Navigate to the next page after the last instruction
                this.navigateTo('/map');
            }
        },
        stopAudio() {
            if (this.houseData[this.currentIndex].audio) {
                this.houseData[this.currentIndex].audio.pause();
                this.houseData[this.currentIndex].audio.currentTime = 0;
            }
        }
    }
};
</script>
<!-- <style>
@import url('https://fonts.cdnfonts.com/css/sandspit');
</style>
 -->
<style>
@font-face {
    font-family: 'Children Sans';
    src: url('/assets/fonts/childrensans.regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

/* ---------------------------------------------------- */
/* 1. Base Container and Background */
/* ---------------------------------------------------- */
.house-bg {
    width: 100%;
    height: 100vh;
    background-image: url('/assets/house/house.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
}

.house-layout {
    /*  font-family: 'Sandspit', sans-serif; */
    font-family: 'Children Sans', sans-serif;
    padding-top: 2%;
    padding-left: 5%;
    position: absolute;
    width: 85%;
    height: 320px;
    top: 5%;
    bottom: 15%;
    left: 5%;
    font-size: 20px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 15px;
}

/* Specific HTML content scaling inside house-layout */
.house-layout p,
.house-layout ul {
    margin-bottom: 1.5vh;
    /* Flexible spacing */
}

.house-layout ul {
    list-style-position: inside;
    padding-left: 1.5vw;
}

/* Image scaling inside the layout */
.house-layout img {
    /* Making the image responsive by limiting its size */
    max-width: 90%;
    max-height: 90%;
    height: auto !important;
    /* Override inline style */
    position: static !important;
    /* Override inline style */
    left: 0 !important;
    /* Override inline style */
    display: block;
    /* Treat as block element for margin control */
    margin: 10px auto;
}

.coin-bg {
    /* ... (Existing styles) ... */
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20%;
    height: 40%;
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
    /* font-family: 'Sandspit', sans-serif; */
}

.formula-icon {
    position: absolute;
    bottom: 1%;
    left: 1%;
}

/* ---------------------------------------------------- */
/* 3. Button Styles (next-button) */
/* ---------------------------------------------------- */
.next-button {
    background-color: #2ECC71;
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    /* Use flexible padding */
    padding: 8px 15px 8px 25px;
    border-radius: 20px;

    /* Positioning with flexible units */
    bottom: 5%;
    /* Moved up a bit for consistency */
    right: 5%;
    /* Scaling font size based on viewport width */
    font-size: 2.5vw;
    height: auto;
    min-height: 50px;
    font-weight: 800;
    cursor: pointer;
    border: none;
    transition: transform 0.2s;
}

.next-button-v2 {
    position: absolute;
    /* Positioning with flexible units */
    bottom: 5%;
    /* Moved up a bit for consistency */
    right: 5%;

}

.next-button:hover {
    transform: scale(1.05);
}

.next-button-icon {
    background-color: white;
    color: #2ECC71;
    border-radius: 50%;
    /* Sizing with flexible units */
    width: 6vw;
    height: 6vw;
    max-width: 40px;
    max-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-left: 10px;
    /* Icon size should scale down with device */
    font-size: 3vw;
    line-height: 1;
    /* Fixes vertical alignment of '>' */
}

/* ---------------------------------------------------- */
/* 4. Media Query for Mobile Devices (<= 768px) */
/* ---------------------------------------------------- */
@media (max-width: 720px) {

    .house-layout {
        /* FIX: Add a background color to make the text readable */
        background-color: rgba(255, 255, 255, 0.9);
        /* Repositioning for better mobile fit */
        font-size: 24px;
        width: 90%;
        height: auto;
        min-height: 2.8vw;
        top: 15%;
        bottom: 15%;
        left: 5%;
        padding: 10px 5px;
        border-radius: 10px;
        padding-left: 20px;
    }

    /* Ensure any image in the layout is scaled down */
    .house-layout img {
        max-width: 100%;
        margin-top: 1vh;
        height: auto;
    }

    .next-button {
        /* Center the button for easier mobile tapping */
        font-size: 3vw;
        bottom: 2vh;
        right: 6vw;
        padding: 5px 10px 5px 15px;
    }

    .next-button-icon {
        width: 4vw;
        height: 4vw;
        font-size: 4vw;
        max-width: 50px;
        max-height: 50px;
    }
}

.next-button-v2 {
    /* Center the button for easier mobile tapping */
    font-size: 3vw;
    bottom: 2vh;
    right: 6vw;
    padding: 5px 10px 5px 15px;
}

.title {
    font-size: 1.3em;
    font-weight: bold;
    color: #d9534f;
    /* Red color for the title */
    text-align: center;
    margin-bottom: 30px;
    text-shadow: 1px 1px 2px #fff;
}

.main-title {
    color: #cc0000;
    /* Red color */
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    letter-spacing: 1.5px;
    font-weight: bold;
}

.instruction {
    text-align: center;
    font-size: 18px;
    margin-bottom: 30px;
    font-weight: 500;
    color: #333;
}

/* --- Concepts Grid Layout --- */
.concepts-grid {
    display: flex;
    justify-content: space-around;
    /* Distributes the two lists */
    padding: 0 50px;
}

.concepts-list {
    list-style: none;
    /* Remove default bullets */
    padding: 0;
    margin: 0;
    padding-left: 15px;
}

.concepts-list li {
    font-size: 18px;
    margin-bottom: 15px;
    font-weight: bold;
    cursor: pointer;
    /* To match the bold and underlined look */
}

.concepts-list li::before {
    content: "•";
    /* Custom bullet point */
    color: #333;
    /* Color of the bullet */
    display: inline-block;
    width: 1em;
    margin-left: -1em;
}
</style>
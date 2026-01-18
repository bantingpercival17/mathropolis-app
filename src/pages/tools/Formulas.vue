<template>
    <div class="formula-container">
        <div class="house-layout" v-html="formula[currentIndex].instruction" @click="handleClick"></div>
        <a v-if="currentIndex < formula.length - 1" class="next-button-v2" @click="nextInstruction">
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
            <svg width="110" height="34" viewBox="0 0 110 34" xmlns="http://www.w3.org/2000/svg" role="img"
                aria-label="Next">
                <rect x="0" y="0" width="110" height="34" rx="17" fill="RED" />
                <text x="30" y="22" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="14"
                    fill="#f7fff9">CLOSE</text>
            </svg>

        </a>
    </div>
    <div v-if="currentIndex > 0" class="formula-icon">
        <img @click="backToFormula" src="/assets/tools/formula.png" width="10%" alt="">
    </div>
</template>
<script>
export default {
    name: 'Formula',
    data() {
        return {
            formula: [
                {
                    instruction: `<div class="">
                <h1 class="main-title" style="font-size:20px; color: red; font-weight: 900;" >MATHEMATICAL CONCEPTS<br>OF FINANCIAL LITERACY</h1>
                <p class="instruction" style="font-size:18px;">Solve money problems involving percentages</p>
                <div class="concepts-grid">
                <ul class="concepts-list" style="font-size:32px;">
                    <li data-formula="1"  style="font-size:18px;">INCREASE</li>
                    <li data-formula="2"  style="font-size:18px;">DECREASE</li>
                    <li data-formula="3"  style="font-size:18px;">DISCOUNT</li>
                </ul>
                <ul class="concepts-list" style="font-size:32px;">
                    <li data-formula="4"  style="font-size:18px;">COMMISSION</li>
                    <li data-formula="5"  style="font-size:18px;">SALES TAX</li>
                    <li data-formula="6"  style="font-size:18px;">SIMPLE INTEREST</li>
                </ul>
            </div>
            </div>`,
                    audio: null
                },
                {
                    instruction: `<p style="font:4rem; color: red; font-weight: 900;" class="text-red">Percentage Increase:</p>
<p>Percentage increase measures how much a value has gone up, expressed as a percent.</p>
<div style="text-align:center;">
<img style="width: 65%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-1.png" alt="">
</div>
<p>In the game, you’ll solve problems like this to unlock new areas.</p>`,
                    audio: new Audio('/assets/mia-voice/house-3.mp3')
                },
                {
                    instruction: `<p style="font:4rem; color: red; font-weight: 900;" class="text-red">Percentage Decrease:</p>
<p>Percentage decrease measures how much a value went down, expressed as a percent.</p>
<div style="text-align:center;">
<img style="width: 65%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-2.png" alt="">
</div>
<p>In the game, you’ll solve problems like this to unlock new areas. </p>`,
                    audio: new Audio('/assets/mia-voice/house-4.mp3')
                },
                {
                    instruction: `<p style="font:4rem; color: red; font-weight: 900;" class="text-red">Discount</p>
<p>Discount is the amount reduced from the original price</p>
<div style="text-align:center;">
<img style="width: 65%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-3.png" alt="">
    </div>
<p>In the game, you’ll solve problems like this to unlock new areas. </p>`,
                    audio: new Audio('/assets/mia-voice/house-5.mp3')
                },
                {
                    instruction: `<p style="font:4rem; color: red; font-weight: 900;" class="text-red">Commission</p>
<p>Commission is the amount earned based on sales.</p>
<div style="text-align:center;">
<img style="width: 65%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-4.png" alt="">
    </div>
<p>In the game, you’ll solve problems like this to unlock new areas. </p>`,
                    audio: new Audio('/assets/mia-voice/house-6.mp3')
                },
                {
                    instruction: `<p style="font:4rem; color: red; font-weight: 900;" class="text-red">Sales Tax</p>
<p>Sales tax is the additional amount added to the price of goods.</p>
<div style="text-align:center;">
<img style="width: 65%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-5.png" alt="">
    </div>
<p>In the game, you’ll solve problems like this to unlock new areas. </p>`,
                    audio: new Audio('/assets/mia-voice/house-7.mp3')
                },
                {
                    instruction: `<p style="font:4rem; color: red; font-weight: 900;" class="text-red"> Simple Interest</p>
<p>Simple interest is the cost of borrowing money.</p>
<div style="text-align:center;">
<img style="width: 65%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/tools/formula/formula-6.png" alt="">
    </div>
<p>In the game, you’ll solve problems like this to unlock new areas. </p>`,
                    audio: new Audio('/assets/mia-voice/house-8.mp3')
                }
            ],
            currentIndex: 0
        }
    },
    methods: {
        backToFormula() {
            this.currentIndex = 0
            this.playCurrentAudio();
        },
        nextInstruction() {
            if (this.currentIndex < this.formula.length - 1) {
                this.currentIndex++;
                this.playCurrentAudio();
            } else {
                this.playCurrentAudio();
                this.$emit('close')

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
            if (this.currentIndex <= this.formula.length - 1) {
                this.playCurrentAudio();
            } else {
                // Navigate to the next page after the last instruction
                this.$emit('close')

            }
        },
        playCurrentAudio() {
            this.formula.forEach(item => {
                if (item.audio) {
                    item.audio.pause();
                    item.audio.currentTime = 0; // reset audio to start
                }
            });

            const currentAudio = this.formula[this.currentIndex].audio;
            if (currentAudio) {
                currentAudio.play().catch(err => console.log('Audio play failed:', err));
            }
        },
    },
    beforeRouteLeave(to, from, next) {
        this.stopAudio();  // <-- ensures audio stops when leaving the page
        next();
    },
}
</script>
<style scoped>
.house-layout {
    /*  font-family: 'Sandspit', sans-serif; */
    font-family: 'Children Sans', sans-serif;
    padding-top: 1%;
    padding-left: 10%;
    width: 85%;
    font-size: 12px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 15px;
    z-index: 10;
}

.formula-icon {
    position: absolute;
    bottom: 1%;
    left: 1%;
    z-index: 10.0;
}

.next-button-v2 {
    z-index: 3;
}

.main-title {
    color: #cc0000;
    /* Red color */
    text-align: center;
    font-size: 32px;
    margin-bottom: 20px;
    letter-spacing: 1.5px;
    font-weight: bold;
}
</style>
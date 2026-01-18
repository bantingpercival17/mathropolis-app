<template>
    <div class="bank-bg">
        <Navbar budgetName="Bank" store="false" />
        <!-- <div class="coin-bg">
            <span style="font-size: 16px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">₱
                {{ coin }}</span>
        </div> -->
        <div class="content">
            <div v-if="!withdrawPanel" class="buttons">
                <span @click="openATM" class="left-atm atm"></span>
                <span @click="openATM" class="right-atm atm"></span>
                <span @click="openTask" class="table-task atm"></span>
            </div>
            <div v-else class="atm-info text-center">
                <div v-if="!openWithdraw" class="first">
                    <span @click="openWithdraw = true"
                        style="width: 10%; height: 20%;position: absolute; left: 45%; bottom: 55%; z-index: 7"></span>
                    <img style="width: 50%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/bank/bank-1.png" alt="">
                    <button class="btn btn-danger" style="position: absolute; z-index: 7; left: 30%; bottom: 35%;"
                        @click="withdrawPanel = false">CANCEL</button>
                </div>
                <div v-else class="first">
                    <span class="get-coin" @click="getCoin"
                        style="width: 5%; height: 15%;position: absolute; right: 38%; bottom: 10%; background-color: aqua;z-index: 7">GET
                        COIN</span>
                    <img style="width: 50%; background-size: cover;
    background-repeat: no-repeat; " src="/assets/bank/bank-2.png" alt="">
                    <button class="btn btn-danger" style="position: absolute; z-index: 7; left: 30%; bottom: 35%;"
                        @click="openWithdraw = false">BACK</button>
                </div>
            </div>
            <div v-if="taskContent" style="width: 100%; height: 100%; z-index: 2;" class=" atm-info ">
                <div class="close-task" @click="closeTask">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="#fff" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M6 6L18 18" stroke="#fff" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="row p-4 align-items-start position-relative z-1">
                    <!-- LEFT COL: Clipboard -->
                    <div class="left-content col-md-6 col-xs-6 d-flex flex-column align-items-center">
                        <!-- Clip -->
                        <div class="clipboard-clip mb-n3">
                            <div class="clipboard-hole"></div>
                        </div>

                        <!-- Board -->
                        <div class="clipboard-board p-2 p-md-3 shadow-lg" style="max-width: 580px;">
                            <!-- Paper -->
                            <div class="paper bg-white p-4 pt-4 d-flex flex-column">
                                <div class="paper-clip-visual"></div>

                                <h6 class="text-center fw-black text-uppercase mx-3" style="letter-spacing: 2px;">
                                    Budget Plan
                                </h6>

                                <!-- Header -->
                                <div class="d-flex justify-content-between fw-bold text-uppercase small mb- ">
                                    <span class="text-center">Category</span>
                                    <span class="text-center">Percentage</span>
                                </div>

                                <!-- Categories -->
                                <div class="flex-grow-1">
                                    <div v-for="(cat, index) in categories" :key="cat.id"
                                        class="d-flex align-items-center justify-content-between ">
                                        <span class="text-dark w-50 lh-sm">{{ cat.name }}</span>

                                        <div class="d-flex align-items-center justify-content-end w-50">
                                            <button @click="handleAdjust(index, 'minus')"
                                                class="btn btn-light btn-sm border shadow-sm d-flex align-items-center justify-content-center "
                                                style="width: 24px; height: 24px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                </svg>
                                            </button>
                                            <span class="fw-bold fs-6 ms-1 me-1 text-center">
                                                {{ cat.percent }}
                                            </span>
                                            <button @click="handleAdjust(index, 'add')"
                                                class="btn btn-light btn-sm border shadow-sm d-flex align-items-center justify-content-center"
                                                style="width: 24px; height: 24px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                </svg>
                                            </button>
                                            <span class="fw-bold fs-5">%</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- Total & Save -->
                                <div class="border-top border-dark ">
                                    <div class="d-flex justify-content-between align-items-center ">
                                        <span class="fs-6 fw-black text-uppercase">Total</span>
                                        <span class="fs-6 fw-black"
                                            :class="totalPercent === 100 ? 'text-success' : 'text-danger'">
                                            {{ totalPercent }}%
                                        </span>
                                    </div>

                                    <div class="d-flex flex-column align-items-center ">
                                        <div v-if="message" class="alert py-1 px-3 fw-bold small mb-0 text-center"
                                            :class="isSuccess ? 'alert-success' : 'alert-danger'">
                                            {{ message }}
                                        </div>
                                        <button @click="handleSave"
                                            class="btn btn-primary fx-6 btn-sm rounded-pill fw-black  shadow border-bottom border-primary border-4 d-flex align-items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"
                                                stroke-linecap="round" stroke-linejoin="round">
                                                <path
                                                    d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z">
                                                </path>
                                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                                <polyline points="7 3 7 8 15 8"></polyline>
                                            </svg> SAVE
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COL: Info -->
                    <div class="right-content col-md-6 col-xs-6 d-flex flex-column gap-4">
                        <!-- Instructions Card -->
                        <div class="card border-0 shadow-lg position-relative" style="border: 4px solid #e5e7eb;">
                            <!-- Visual tab on left -->
                            <div class="position-absolute top-0 start-0 mt-4 ms-n3 bg-secondary rounded-end border border-secondary"
                                style="width: 10px; height: 40px; left: -14px;"></div>

                            <div class="card-body p-4">
                                <h6 class="card-title fw-black border-bottom border-dark d-inline-block pb-1 mb-3">
                                    TASK 1:
                                </h6>

                                <div class="card-text text-secondary-emphasis">
                                    <p>
                                        Your task is to create a financial plan: <br />
                                        A <strong>financial plan</strong> helps people manage income, set goals, and
                                        track
                                        spending.
                                    </p>

                                    <div class="bg-light border rounded p-1 mb-1">
                                        <label class="fw-bold text-decoration-underline mb-2 fs-6">Steps in Creating a
                                            Simple Financial Plan:</label>
                                        <ul class="small mb-0 ps-3">
                                            <li>Identify your income (allowance, gifts, small earnings).</li>
                                            <li>List your expenses (food, school needs).</li>
                                            <li>Set financial goals (short-term and long-term).</li>
                                            <li>Make a budget: allocate money to each expense.</li>
                                            <li>Monitor and adjust your plan.</li>
                                        </ul>
                                    </div>

                                    <div class="alert alert-warning border-start border-warning border-4 rounded mb-0 ">
                                        <p class="fw-bold d-flex align-items-center gap-2 mb-2">
                                            💡 Example:
                                        </p>
                                        <p class="small mb-1">If you have ₱5,000,</p>
                                        <ul class="list-unstyled small font-monospace mb-0">
                                            <li>Needs → ₱5,000 × 50% = ₱2,500</li>
                                            <li>Wants → ₱5,000 × 30% = ₱1,500</li>
                                            <li>Savings → ₱5,000 × 20% = ₱1,000</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
        <div v-if="miraShow" class="mia-position" @click="playAudio">
            <img :src="mia" alt="mia character" style="">
        </div>
        <div v-if="rewardBox" class="atm-info" style="width: 100%; height: 100%;">
            <div class="reward-box">
                <div class=" row align-items-end">
                    <div class="col-sm-8">
                        <div class=" bg-white rounded p-3 shadow d-flex align-items-center justify-content-between">
                            <div>
                                <h5 class="fw-black text-uppercase mb-1 fs-6">Rewards:</h5>
                                <p class="small mb-0 fw-bold" :class="isSuccess ? 'text-success' : 'text-secondary'"> {{
                                    isSuccess ? 'The Supermarket level unlocked!' : 'Complete the budget to unlock.' }}
                                </p>
                            </div>
                            <div class="rounded-circle d-flex align-items-center justify-content-center border border-4"
                                :class="isSuccess ? 'bg-success border-success text-white' : 'bg-light border-secondary text-secondary'"
                                style="width: 48px; height: 48px;"> <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg> </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div @click="backToMap" class="bg-white rounded text-center pt-2 pb-2">
                            <img src="/assets/map.png" alt="" style="width: 80%;"> <br>
                            <span class=" badge bg-primary">BACK TO THE MAP</span>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import { storeGameProgress, fetchGameProgress } from '../../controller';
import Navbar from '../Navbar.vue';

export default {
    name: 'BankLayout',
    components: {
        Navbar,
    },
    data() {
        const categories = [
            { id: 1, name: 'Supermarket', percent: 50, amount: 2500 },
            { id: 2, name: 'Department Store', percent: 10, amount: 500 },
            { id: 3, name: 'Restaurant', percent: 20, amount: 1000 },
            { id: 4, name: 'Online Subscription', percent: 10, amount: 500 },
            { id: 5, name: 'Leisure', percent: 10, amount: 500 },
        ]
        return {
            coin: 0.00,
            mia: '/assets/mia.png',
            withdrawPanel: false,
            openWithdraw: false,
            taskContent: false,
            rewardBox: false,
            sounds:
                [new Audio('/assets/bank/bank-1.mp3'),
                new Audio('/assets/bank/bank-2.mp3'),
                new Audio('/assets/bank/bank-3.mp3'),
                new Audio('/assets/bank/bank-4.mp3'),
                new Audio('/assets/bank/bank-5.mp3')],

            currentSoundIndex: 0,
            categories,
            message: '',
            isSuccess: false,
            showConfetti: false,
            totalPercent: 0,
            miraShow: true
        }
    }, mounted() {
        this.coin = localStorage.getItem('coin')
        this.playAudio();
        this.totalPercent = this.categories.reduce((acc, curr) => acc + curr.percent, 0)
        const budgetPlan = localStorage.getItem('budgetPlan')
        if (budgetPlan) {
            this.categories = JSON.parse(budgetPlan);
        }
    },
    methods: {
        navigateTo(route) {
            let buildings = JSON.parse(localStorage.getItem('buildings') || '[]');
            const bank = buildings.find(item => item.name === "Supermarket");
            if (bank) {
                bank.isLocked = false;
            }
            localStorage.setItem('buildings', JSON.stringify(buildings));
            this.$router.push(route);
        },
        playSound(index) {
            this.currentSoundIndex = index
            const audio = this.sounds[this.currentSoundIndex]
            audio.play().catch(err => console.log('Audio play failed:', err));
        },
        playAudio() {
            const index = this.coin > 0 ? 2 : 0;
            const audio = this.sounds[index]
            // Play first audio
            audio.play().catch(err => console.log('Audio play failed:', err));
        },
        openATM() {
            this.withdrawPanel = true
            this.playCurrentAudio()
            this.playSound(1)
        },
        getCoin() {
            localStorage.setItem('coin', 5000)
            this.coin = 5000
            this.withdrawPanel = false
            this.playCurrentAudio()
            this.playSound(2)
        },
        openTask() {
            if (!this.rewardBox) {
                this.playCurrentAudio()
                if (this.coin > 0) {
                    this.taskContent = true
                    this.miraShow = false
                    this.playCurrentAudio()
                    this.playSound(3)
                } else {
                    this.playSound(4)
                }
            }
        },
        playCurrentAudio() {
            this.sounds.forEach(item => {
                if (item) {
                    item.pause();
                    item.currentTime = 0; // reset audio to start
                }
            })
        },
        handleAdjust(index, type) {
            const max = 50;
            const min = 10;
            const amount = 10;

            this.message = '';
            this.isSuccess = null
            const current = this.categories[index];
            let newValue = current.percent;

            // Calculate current total BEFORE changing anything
            const totalBefore = this.categories.reduce((acc, c) => acc + c.percent, 0);

            // Apply tentative change
            if (type === 'add') {
                newValue += amount;
            } else {
                newValue -= amount;
            }

            // 1️⃣ Check min / max for this category
            if (newValue < min) {
                this.message = "You reached the minimum percentage for this category";
                this.isSuccess = false
                return;
            }
            if (newValue > max) {
                this.message = "You reached the maximum percentage for this category";
                this.isSuccess = false
                return;
            }
            // 2️⃣ Compute new total
            const totalAfter = totalBefore - current.percent + newValue;
            // Prevent total > 100
            if (totalAfter > 100) {
                this.isSuccess = false
                this.message = "Total percentage cannot exceed 100%. Reduce other categories first.";
                return;
            }
            // Prevent total < 100 when user is lowering (optional constraint)
            if (totalAfter < 100 && type === "subtract") {
                // Only enforce this if you want total always exactly 100
                // otherwise remove this block.
            }
            // 3️⃣ Apply update
            this.categories[index].percent = newValue;
            this.categories[index].amount = (5000 * (newValue / 100))
            // 4️⃣ Update total
            this.totalPercent = totalAfter;
        },

        handleSave() {
            this.playCurrentAudio()
            const total = this.categories.reduce((acc, c) => acc + c.percent, 0);
            if (total !== 100) {
                this.isSuccess = false
                this.message = `Total is ${totalPercent.value}%. It needs to be exactly 100%.`;
                return;
            }
            this.isSuccess = true
            this.taskContent = false
            localStorage.setItem('budgetPlan', JSON.stringify(this.categories))
            this.rewardBox = true
            // Save action here (API call, emit event, etc.)
            this.message = 'Great job! Plan saved successfully.';
        },
        async backToMap() {
            let buildings = JSON.parse(localStorage.getItem('buildings') || '[]');
            const current = buildings.find(item => item.name === 'Bank');
            const next = buildings.find(item => item.name === 'Supermarket');
            if (current) {
                current.isLocked = true;
                current.isDone = true;
                next.isLocked = false
            }
            localStorage.setItem('buildings', JSON.stringify(buildings));
            await storeGameProgress();
            // Navigate to the next page after the last instruction
            await fetchGameProgress()
            this.$router.push('/map');
        },
        closeTask() {
            this.taskContent = false
            this.playCurrentAudio()
        }
    },
}
</script>
<style scoped>
.bank-bg {
    width: 100%;
    height: 100vh;
    background-image: url('/assets/bank.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    overflow: scroll;
}

.mia-position {
    position: absolute;
    top: 60%;
    left: 5%;
    z-index: 5;
}

.mia-position img {
    width: 35%;
}

.buttons {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.atm {
    position: absolute;
    cursor: pointer;
    /* background-color: aqua; */
    width: 10%;
    height: 40%;
    transition: all 0.2s ease-out;
    bottom: 20%;
}

.atm:hover {
    z-index: 2;
    /* Optional: Provides a visual feedback when hovering over the invisible area */
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 10px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
}

.atm-info {
    background-color: rgba(255, 255, 255, 0.5);
}

.right-atm {
    right: 12%;
}

.left-atm {
    left: 12%;
}

.table-task {
    width: 35%;
    height: 25%;
    right: 12%;
    bottom: 10%;
}

.bg-ambience-blue {
    background-color: #93c5fd;
}

.bg-ambience-gray {
    background-color: #d1d5db;
}

.bg-floor {
    background-color: #cbd5e1;
    border-top: 4px solid #94a3b8;
}

/* Clipboard Styles */
.clipboard-clip {
    width: 6rem;
    height: 1.5rem;
    background-color: #d1d5db;
    border: 4px solid #9ca3af;
    border-bottom: 0;
    border-radius: 1rem 1rem 0 0;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.clipboard-hole {
    width: .8rem;
    height: .8rem;
    background-color: #1f2937;
    border: 4px solid #9ca3af;
    border-radius: 50%;
    margin-top: 0.5rem;
}

.clipboard-board {
    background-color: #8B5A2B;
    border-right: 3px solid #5D3A1A;
    border-bottom: 3px solid #5D3A1A;
    border-radius: 1rem;
    position: relative;
}

.paper {
    min-height: fit-content;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    border-radius: 0.75rem;
    position: relative;
    font-size: small;
}

.paper-clip-visual {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 6rem;
    height: 1rem;
    background-color: #9ca3af;
    border-radius: 0 0 0.75rem 0.75rem;
    opacity: 0.5;
}

/* Game Elements */
.budget-badge {
    background-color: #facc15;
    /* yellow-400 */
    border: 4px solid white;
    transform: rotate(2deg);
    transition: transform 0.3s;
}

.budget-badge:hover {
    transform: rotate(0);
}

.icon-box-orange {
    background-color: #fb923c;
}

.close-task {
    background-color: red;
    position: absolute;
    z-index: 7;
    left: 3%;
    top: 5%;
    font-size: 24px;
    border-radius: 10%;
    /* Size of the X */
    line-height: 1;
    color: #ffffff;
    /* Dark Grey */
    cursor: pointer;
    padding: 0 6px;
    transition: color 0.2s ease;
}

.close-task:hover {
    color: #ff0000;
    /* Red on hover */
}

.reward-box {
    height: 20%;
    position: absolute;
    left: 15%;
    right: 15%;
    bottom: 45%;
    z-index: 7
}




/* Animations */
@keyframes bounce-custom {

    0%,
    100% {
        transform: translateY(-25%);
    }

    50% {
        transform: translateY(0);
    }
}

.animate-bounce {
    animation: bounce-custom 1s infinite;
}

/* Helpers */
.cursor-default {
    cursor: default;
}

.fw-black {
    font-weight: 900;
}

/* Mobile adjustments override */
@media (max-width: 600px) {
    .clipboard-board {
        max-width: 100vh;
    }

    .paper {
        min-height: 200px;
    }

    .clipboard-clip {
        width: 6rem;
        height: 1.5rem;
    }

    .clipboard-hole {
        width: .8rem;
        height: .8rem;
    }

    .right-content {
        font-size: x-small;

    }

    .left-content {
        font-size: small;
    }
}
</style>
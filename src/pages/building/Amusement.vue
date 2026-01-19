<template>
    <template v-if="intro">
        <div class="amusement-1-bg">
            <Navbar :budgetName="building" :store="true" :tools="enabledTools" :coins="coin" />
            <div class="ticket-both" @click="showTicketBooth = true"></div>
            <div v-if="showTicketBooth" class="task-content d-flex justify-content-center align-items-center"
                style="background: rgba(0,0,0,0.7);">

                <div class="amusement-content p-4 text-center d-flex flex-column" style="max-width: 500px;">
                    <div class="align-items-center border-bottom pb-2 mb-3">
                        <h2 class="text-danger fw-bold m-0 text-center">TICKET BOOTH </h2>
                        <label for="">PRICE LIST</label>
                    </div>
                    <div class="ticket-booth-content">
                        <div class="entrance-header text-center bg-dark text-warning p-2">
                            <h5>ENTRANCE FEE ₱{{ entranceFee }}</h5>
                        </div>

                        <div class="section-title text-center bg-danger text-white py-1">RIDE PACKAGES</div>
                        <div class="package-list p-3">
                            <div v-for="pkg in ridePackages" :key="pkg.id" @click="selectPackage(pkg)"
                                :class="['package-card', selectedPackage?.id === pkg.id ? 'active-border' : '']">
                                <span>{{ pkg.name }} ({{ pkg.details }})</span>
                                <span class="fw-bold">₱{{ pkg.price }}</span>
                            </div>
                        </div>

                        <div class="section-title text-center bg-danger text-white py-1">INDIVIDUAL RIDE TICKETS
                        </div>
                        <div :class="['ride-list p-3', selectedPackage ? 'opacity-50' : '']">
                            <button v-for="ride in individualRides" :key="ride.name" @click="toggleRide(ride)"
                                :disabled="selectedPackage !== null"
                                :class="['btn btn-sm w-100 mt-2', selectedRides.includes(ride) ? 'btn-danger' : 'btn-outline-danger']">
                                {{ ride.name }} - ₱{{ ride.price }}
                            </button>
                        </div>
                    </div>
                    <div class="align-items-center">
                        <button class="btn btn-danger btn-sm w-100" @click="processBuy">
                            BUY - Total: ₱{{ calculateTotal }}
                        </button><br>
                        <div class="d-flex justify-content-center align-items-center mt-2">
                            <button v-if="selectedPackage || selectedRides.length > 0" @click="clearSelection"
                                class="btn btn-sm btn-primary w-100 me-2">Reset</button>
                            <button class="btn btn-sm btn-outline-danger w-100"
                                @click="showTicketBooth = false">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showReceipt" class="cash-receipt-overlay" @click.self="showReceipt = false">
                <div class="cash-receipt-container">
                    <div class="cash-receipt-header">
                        🎟️ AMUSEMENT TICKET 🎟️
                    </div>

                    <div class="receipt-info">
                        <div>DATE: {{ new Date().toLocaleDateString() }}</div>
                        <div>TIME: {{ new Date().toLocaleTimeString() }}</div>
                        <div>BOOTH: Ticket Booth #1</div>
                    </div>

                    <div class="scrollable-items-wrapper">
                        <ul class="receipt-items">
                            <li class="receipt-item">
                                <span>Entrance Fee</span>
                                <span>₱50.00</span>
                            </li>

                            <template v-if="selectedPackage">
                                <li class="receipt-item fw-bold">
                                    <span>{{ selectedPackage.name }}</span>
                                    <span>₱{{ selectedPackage.price.toFixed(2) }}</span>
                                </li>
                                <li class="receipt-item">
                                    <small class="text-muted ms-2 italic">{{ selectedPackage.details }}</small>
                                </li>
                            </template>

                            <template v-else>
                                <li v-for="ride in selectedRides" :key="ride.name" class="receipt-item">
                                    <span>{{ ride.name }}</span>
                                    <span>₱{{ ride.price.toFixed(2) }}</span>
                                </li>
                            </template>
                        </ul>
                    </div>

                    <div class="receipt-total">
                        <span>TOTAL AMOUNT:</span>
                        <span>₱{{ calculateTotal.toFixed(2) }}</span>
                    </div>

                    <div class="receipt-congratulations">
                        ENJOY THE RIDES!
                    </div>

                    <div class="receipt-button-container">
                        <button class="btn btn-success w-100" @click="confirmPayment">CONFIRM & PAY</button>
                        <button class="btn btn-link btn-sm mt-2" @click="showReceipt = false">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="amusement-bg">
            <Navbar :budgetName="building" :store="true" :tools="enabledTools" :coins="coin" />

            <div v-for="building in ridesQuestion" :key="building.code" :alt="building.name" class="rides-box"
                :style="building.style" @click="viewQuestion(building)">
                <!--   <img v-if="building.isLocked" class="lock" src="/assets/lock.png" alt=""> -->
            </div>
            <div v-if="showQuestion" class="atm-info task-content">
                <div class="p-4 align-items-start position-relative z-1">
                    <div class="right-content d-flex flex-column gap-4">
                        <!-- Instructions Card -->
                        <div class="card border-0 shadow-lg position-relative"
                            style="width:50%;border: 4px solid #e5e7eb; left: 25%;">
                            <!-- Visual tab on left -->
                            <div class="position-absolute top-0 start-0 mt-4 ms-n3 bg-secondary rounded-end border border-secondary"
                                style="width: 10px; height: 40px; left: -14px;"></div>

                            <div class="card-body p-4 question-bg"
                                :style="{ backgroundImage: `url(${promoQuestion.image})` }"> <span
                                    class="badge bg-danger float-end" @click="closeQuestion">X</span>
                                <h6 class="card-title fw-black border-bottom border-dark d-inline-block pb-1 mb-3">
                                    QUESTION
                                </h6>
                                <div class="card-text text-secondary-emphasis">
                                    <div v-html="promoQuestion.question"></div>
                                    <div class="form-group">
                                        <input type="text" v-model="answer" class="form-control border border-primary">
                                    </div>
                                    <template v-if="questionError.show">
                                        <div class="alert alert-danger border-start border-danger border rounded mt-2 ">
                                            <span class="badge bg-danger float-end"
                                                @click="questionError.show = false">X</span>
                                            <p class="small mb-1">{{ questionError.message }}</p>
                                        </div>
                                    </template>
                                </div>
                                <button @click="submitAnswer"
                                    class="btn btn-sm btn-info w-100 rounded mt-1 text-white fw-bold">
                                    SUBMIT ANSWER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div v-if="taskComplete" class="atm-info task-content">
                <div class="p-4 align-items-start position-relative z-1">
                    <div class="right-content d-flex flex-column gap-4">
                        <!-- Instructions Card -->
                        <div class="card border-0 shadow-lg position-relative"
                            style="width:50%;border: 4px solid #e5e7eb; left: 25%;">
                            <!-- Visual tab on left -->
                            <div class="position-absolute top-0 start-0 mt-4 ms-n3 bg-secondary rounded-end border border-secondary"
                                style="width: 10px; height: 40px; left: -14px;"></div>

                            <div class="card-body p-4 question-bg"
                                :style="{ backgroundImage: `url(${promoQuestion.image})` }">
                                <span class="badge bg-danger float-end" @click="closeQuestion">X</span>
                                <h6 class="card-title fw-black border-bottom border-dark d-inline-block pb-1 mb-3">
                                    TASK COMPLETE
                                </h6>
                                <div class="card-text text-secondary-emphasis">
                                    <p class="text-success">
                                        Your Task in Amusement Park you can go back to the Map
                                    </p>

                                </div>
                                <button @click="finishGame"
                                    class="btn btn-sm btn-primary w-100 rounded mt-1 text-white fw-bold">
                                    GO TO THE MAP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </template>

    <div v-if="loader" class="loader-overlay">
        <div class="loader-spinner"></div>
    </div>
    <div v-if="message" class="message-box bg-danger text-white">
        {{ message }}
    </div>

</template>

<script scoped>
import Navbar from '../Navbar.vue';
import { storeGameProgress, fetchGameProgress } from '../../controller';
import { updateCoins, completeBuilding } from '../../gameProgress.service';
export default {
    name: "Amusement",
    components: {
        Navbar
    },
    data() {
        return {
            building: 'Amusement',
            loader: false,
            intro: true,
            showTicketBooth: false,
            showReceipt: false,
            isReadTask: true,
            message: '',
            entranceFee: 50.00,
            selectedPackage: null, // Tracks if a bundle is chosen
            selectedRides: [],     // Tracks individual tickets
            ridePackages: [
                { id: 'A', name: "Package A", details: "1 Person • 3 Rides", price: 150.00 },
                { id: 'B', name: "Package B", details: "1 Person • 5 Rides", price: 200.00 },
                { id: 'C', name: "Package C", details: "2 Persons • 3 Rides", price: 350.00 },
                { id: 'D', name: "Package D", details: "3 Persons • 3 Rides", price: 500.00 }
            ],
            individualRides: [
                { name: "Ferris Wheel", price: 50.00 },
                { name: "Roller Coaster", price: 80.00 },
                { name: "Bumper Cars", price: 40.00 },
                { name: "Carousel", price: 30.00 },
                { name: "Pirate Ship", price: 70.00 }
            ],
            showQuestion: false,
            promoQuestion: [],
            setEvent: null,
            questionError: {
                show: false,
                message: null
            },
            answer: null,
            ridesQuestion: [
                {
                    code: 101,
                    image: '/assets/amusement/ride-2.png',
                    style: 'width:20%; height:45%; top:3%; left:18%;',
                    question: `<label class="text-primary">An arcade gives 20% off on all games.</label> <br>
                    <label class="fw-bolder">Original price: ₱50 per play</label><br><br>
                    <label for="" class="text-info fw-bolder">How much is the discounted price?</label>`,
                    answer: 40,
                    status: null,
                },
                {
                    code: 102,
                    image: '/assets/amusement/ride-3.png',
                    style: 'width:15%; height:25%; top:38%; right:20%;',
                    question: `<label class="text-primary">During holidays, the arcade increases claw-machine prices by 15%.</label> <br>
                    <label class="fw-bolder">Original price: ₱40</label><br><br>
                    <label for="" class="text-info fw-bolder">What is the new price value?</label>`,
                    answer: 46,
                    status: null,
                }, {
                    code: 103,
                    image: '/assets/amusement/ride-5.png',
                    style: 'width:15%; height:25%; top:20%; left:48%;',
                    question: `<label class="text-primary">You redeem a prize worth ₱3000.</label> <br>
                    <label class="fw-bolder">You paid ₱900 worth of tokens to earn the tickets.</label><br><br>
                    <label for="" class="text-info fw-bolder">What percent of the prize value did you spend?</label>`,
                    answer: '30%',
                    status: null,
                }, {
                    code: 104,
                    image: '/assets/amusement/ride-1.png',
                    style: 'width:15%; height:20%; bottom:3%; right:10%',
                    question: `<label class="text-primary">A parent buys tickets for herself and her two children.</label> <br>
                    <label class="fw-bolder">Adult entry: ₱550 <br>
                        Children get 30% off the adult price.</label><br><br>
                    <label for="" class="text-info fw-bolder">How much is the children's fee?</label>`,
                    answer: 385,
                    status: null,
                }, {
                    code: 105,
                    image: '/assets/amusement/ride-4.png',
                    style: 'width:15%; height:20%; bottom:5%; left:42%',
                    question: `<label class="text-primary">A drink costs ₱90.</label> <br>
                    <label class="fw-bolder">A promo gives 5% off plus an additional ₱10 discount.</label><br><br>
                    <label for="" class="text-info fw-bolder">What is the price after the discount?</label>`,
                    answer: 75.5,
                    status: null,
                }
            ],
            taskComplete: false
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
            return parseFloat(localStorage.getItem('coin'));
        },
        calculateTotal() {
            let total = this.entranceFee;
            if (this.selectedPackage) {
                total += this.selectedPackage.price;
            } else {
                total += this.selectedRides.reduce((sum, ride) => sum + ride.price, 0);
            }
            return total;
        },
        expectedBudget() {
            const budgetPlan = localStorage.getItem('budgetPlan');
            if (!budgetPlan) return 0;

            const plan = JSON.parse(budgetPlan);
            const budget = plan.find(
                item => item.name === this.building
            );

            return budget ? budget.amount : 0;
        }
    },
    methods: {
        viewQuestion(item) {
            if (item.status) {
                this.message = 'This Ride is Close'
                setTimeout(() => { this.message = null }, 3000)
                return
            }
            this.promoQuestion = item
            this.showQuestion = true
        },
        submitAnswer() {
            if (this.promoQuestion.answer == this.answer) {
                this.promoQuestion.status = true
                this.closeQuestion()
                this.message = 'Correct Answer. Tap another Rides'
                setTimeout(() => { this.message = null }, 3000)
                const allDone = this.ridesQuestion.every(q => q.status !== null);

                if (allDone) {
                    this.taskComplete = true
                }
                return
            }
            this.message = 'Wrong Answer'
            setTimeout(() => { this.message = null }, 3000)

        },
        selectPackage(pkg) {
            // If selecting a package, clear any individual rides already picked
            this.selectedPackage = pkg;
            this.selectedRides = [];
        },
        toggleRide(ride) {
            // Only allow selecting rides if NO package is selected
            if (this.selectedPackage) return;

            const index = this.selectedRides.findIndex(r => r.name === ride.name);
            if (index > -1) {
                this.selectedRides.splice(index, 1);
            } else {
                this.selectedRides.push(ride);
            }
        },
        clearSelection() {
            this.selectedPackage = null;
            this.selectedRides = [];
        },
        processBuy() {
            if (!this.selectedPackage && this.selectedRides.length === 0) {
                this.message = '("Please select a package or at least one ride!"';
                setTimeout(() => { this.message = null }, 2000)
                return;
            }
            this.showReceipt = true;
            updateCoins(this.calculateTotal);
        },
        async confirmPayment() {
            if (this.expectedBudget > this.calculateTotal) {
                // Deduct coins
                console.log(this.calculateTotal)

                // Sync progress
                await storeGameProgress();

                this.message = 'Welcome to the Amusement. Tap Ride';
                setTimeout(async () => {
                    this.message = null
                    await fetchGameProgress();
                }, 2000)
                this.intro = false
                // Here you would integrate your budget deduction logic
                this.message = "Payment Successful! Tickets Printing...";


                // Reset state after success
                setTimeout(() => {
                    this.showReceipt = false;
                    this.selectedPackage = null;
                    this.selectedRides = [];
                    this.message = null;

                }, 3000);
                return;
            }

        },
        closeQuestion() {
            this.showQuestion = false
            this.promoQuestion = []
            this.questionError = {
                show: false,
                message: null
            }
            this.answer = null
        },
        async finishGame() {
            this.loader = true
            completeBuilding(this.$route.path, null);
            // Sync progress
            await storeGameProgress();
            await fetchGameProgress();

            // Return to map
            setTimeout(() => {
                this.message = null
                this.loader = false
                this.$router.push('/map');
            }, 2000)

        }
    },
};
</script>

<style scoped>
.amusement-bg {
    width: 100%;
    height: 100vh;
    background-image: url('/assets/amusement/amusement.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    overflow-y: scroll;
}

.amusement-1-bg {
    width: 100%;
    height: 100vh;
    background-image: url('/assets/amusement/amusement-1.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    overflow-y: scroll;
}

.amusement-content {
    margin: 10px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    width: 98%;
    height: auto;
    z-index: 7;
}

.ticket-both {
    position: absolute;
    bottom: 22%;
    left: 3%;
    width: 12%;
    height: 30%;
    z-index: 2;
}

.ticket-booth-content {
    overflow-y: scroll;
    background-color: #d21919;
    height: 200px;
    margin-bottom: 10px;
}

.ticket-booth-content {
    background-color: #fff9e6;
    /* Light vintage paper color */
    border: 4px solid #b22222;
    /* Deep red border */
    border-radius: 15px;
}

.ticket-header {
    background: #b22222;
    color: #ffd700;
    /* Gold text */
    padding: 10px;
    text-align: center;
    border-radius: 10px 10px 0 0;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.entrance-fee-banner {
    background: #4a4a4a;
    color: #fff;
    font-size: 0.85rem;
    padding: 5px;
    text-align: center;
    margin-bottom: 15px;
}

/* Package Selection Styling */
.package-grid {
    display: grid;
    gap: 10px;
    margin-bottom: 20px;
}

.package-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #fff;
    border: 2px solid #ddd;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.3s;
}

.package-item.selected {
    border-color: #b22222;
    background: #fff0f0;
    transform: scale(1.02);
}

.package-item .details {
    font-size: 0.8rem;
    color: #666;
}

/* Individual Rides Styling */
.ride-selection-area {
    background: #fdfdfd;
    padding: 15px;
    border-radius: 10px;
    border: 1px dashed #b22222;
}

.ride-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    margin-bottom: 5px;
    border-radius: 6px;
    background: #eee;
    cursor: pointer;
}

.ride-item.active {
    background: #dc3545;
    color: white;
}

/* Disable individual rides visually if package is picked */
.disabled-zone {
    opacity: 0.4;
    filter: grayscale(1);
    pointer-events: none;
    cursor: not-allowed;
}

/* Main Action Button */
.buy-button {
    background: #28a745;
    color: white;
    border: none;
    padding: 15px;
    width: 100%;
    border-radius: 10px;
    font-weight: bold;
    font-size: 1.2rem;
    margin-top: 15px;
    box-shadow: 0 5px 0 #1e7e34;
}

.buy-button:active {
    box-shadow: none;
    transform: translateY(4px);
}

/* 🔑 KEY: Ensures this container fills the parent (intro-bg) and is the positioning context */
.building-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.rides-box {
    position: absolute;
    cursor: pointer;
    transition: all 0.2s ease-out;

    /* Center the lock image */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
}

.question-bg {
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 12px;
}

/* STRONG overlay */
.question-bg::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.8);
    /* increase opacity */
    border-radius: 12px;
    z-index: 0;
}

/* Ensure text stays above overlay */
.question-bg>* {
    position: relative;
    z-index: 1;
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
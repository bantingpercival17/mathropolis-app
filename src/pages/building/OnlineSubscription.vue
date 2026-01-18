<template>
    <div class="supermarket-container supermarket-bg">
        <Navbar :budgetName="this.building" :store="true" :tools="enabledTools" />
        <div v-if="message" class="message-box bg-warning text-white text-center" v-html="message">
        </div>
        <div class="kiosk" @click="kioskPanel = true"></div>
        <div v-if="showSubInstructions" class="task-content d-flex justify-content-center align-items-center"
            style="background: rgba(0,0,0,0.8);">
            <div class="stall-content p-4 border border-primary shadow-lg"
                style="max-width: 480px; height: auto; border-width: 5px !important;">
                <h3 class="text-primary fw-bold text-center mb-3">🌐 ONLINE SUBSCRIPTION GUIDE</h3>

                <div class="instruction-body small">
                    <div class="mb-3 p-2 bg-light rounded border-start border-success border-4">
                        <strong>💸 DISCOUNTS:</strong> Price is reduced instantly. Look for student or summer deals!
                    </div>

                    <div class="mb-3 p-2 bg-light rounded border-start border-danger border-4">
                        <strong>📈 SALES TAX:</strong> Standard 12% VAT is added to your total at checkout.
                    </div>

                    <div class="mb-3 p-2 bg-light rounded border-start border-info border-4">
                        <strong>📅 INTEREST:</strong> Calculated as $I = P \times r \times t$.
                        Check the <i>Years</i> in the description!
                    </div>
                </div>

                <button class="btn btn-primary w-100 fw-bold mt-2 py-3" @click="startSubTask">
                    UNDERSTOOD, GO TO MARKET
                </button>
            </div>
        </div>
        <div v-if="kioskPanel" class="task-content d-flex justify-content-center align-items-center"
            style="background: rgba(0,0,0,0.7);">
            <div class="stall-content p-4 text-center d-flex flex-column" style="max-width: 650px; height: 90%;">
                <div class="d-flex justify-content-between align-items-center border-bottom ">
                    <h3 class="text-primary fw-bold text-center mb-3">
                        <span style="background-color: #007bff;; padding-left: 20px;padding-right:20px;
                            color:white">ONLINE</span>
                        SUBSCRIPTION
                    </h3>
                    <button class="btn btn-sm btn-outline-danger" @click="kioskPanel = false">Close</button>
                </div>
                <div class="row">
                    <!-- Food Items -->
                    <div class="col-7">
                        <div class="row g-3 overflow-auto"
                            style="max-height: 65vh; background-color: #64afff; padding:10px; margin-top:10px;">
                            <div class="list-group">
                                <button v-for="item in subscriptions" :key="item.name" @click="addToCart(item)"
                                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 shadow-sm mb-2 rounded">
                                    <div>
                                        <span class="fw-semibold text-primary text-start">{{ item.name }}</span> <br>
                                        <small class="text-start">{{ item.desc }}</small>
                                    </div>
                                    <span class="badge bg-danger rounded-pill">₱{{ item.price.toFixed(2) }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-5 col-4 m-0 p-0">
                        <label for="" class="fw-bolder text-center text-primary">SUBSCRIPTION CART</label>
                        <div class="text-start mb-4 overflow-auto" style="height: 130px;">
                            <template v-if="subscriptionCart.length > 0">
                                <div class="instruction-step mb-3 p-1 d-flex justify-content-between align-items-center bg-light rounded-3"
                                    v-for="item in subscriptionCart" :key="item.code">
                                    <div>
                                        <h6 class="fw-bold text-dark">{{ item.name }}</h6>
                                        <small class="text-muted">
                                            {{ item.quantity }} * @ ₱{{ item.price.toFixed(2) }}
                                        </small>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="me-2 fw-semibold fs-6">
                                            ₱{{ (item.quantity * (item.price)).toFixed(2) }}
                                        </span>
                                        <button @click="removeFromCart(item)"
                                            class="btn btn-sm text-danger hover:text-danger rounded-circle lh-1 fs-5">
                                            &minus;
                                        </button>
                                    </div>

                                </div>
                            </template>
                            <template v-else>
                                <div
                                    class="instruction-step mb-3 p-1 d-flex justify-content-between align-items-center bg-light rounded-3">
                                    Your cart is empty.
                                </div>
                            </template>

                        </div>
                        <div class="receipt-total">
                            <span>TOTAL:</span>
                            <span>₱{{ cartTotal.toFixed(2) }}</span>
                        </div>
                        <button class="btn btn-primary btn-sm w-100" @click="processPayment">CHECKOUT</button>
                    </div>
                </div>

            </div>
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

                        <div class="card-body p-4"> <span class="badge bg-danger float-end"
                                @click="closeQuestion">X</span>
                            <h6 class="card-title fw-black border-bottom border-dark d-inline-block pb-1 mb-3">
                                PROMO QUESTION
                            </h6>

                            <div class="card-text text-secondary-emphasis">
                                <p>
                                    {{ generateQuestion(promoQuestion) }}
                                    <!--  A {{ promoQuestion.name }} costs ₱{{ promoQuestion.price }}.
                                    <b>{{ promoQuestion.desc }}</b>.
                                    <br> What is the new price? -->
                                </p>

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
        <div v-if="completeTask" class="cash-receipt-overlay">
            <div class="cash-receipt-container">
                <div class="cash-receipt-header">
                    CASH RECEIPT
                </div>
                <div class="receipt-info">
                    <div>Tel: 123-456-789</div>
                    <div>Date: {{ new Date().toLocaleDateString() }}</div>
                </div>
                <div class="scrollable-items-wrapper">
                    <ul class="receipt-items">
                        <!-- Dynamically list items from the cart, grouping duplicates -->
                        <li v-for="(item, index) in subscriptionCart" :key="index" class="receipt-item">
                            <span>{{ item.quantity }} * {{ item.name }} ({{ item.price }})</span>
                            <div class="d-flex align-items-center gap-2">
                                <span>₱{{ item.price * item.quantity }}</span>

                            </div>
                        </li>
                    </ul>
                </div>
                <div class="receipt-total">
                    <span>Total:</span>
                    <span>Items ({{ this.cartItemCount }})</span>
                    <span>{{ cartTotal.toFixed(2) }}</span>
                </div>
                <div class="receipt-congratulations">
                    CONGRATULATIONS!
                </div>

                <div class="receipt-button-container">
                    <button @click="nextGame" class="btn btn-primary">NEXT</button>
                </div>
            </div>
        </div>
    </div>


</template>
<script>
import Navbar from '../Navbar.vue';
import { storeGameProgress, fetchGameProgress } from '../../controller';
import { updateCoins, completeBuilding } from '../../gameProgress.service';
export default {
    name: 'Online Subscription',
    components: {
        Navbar,
    },
    data() {
        return {
            showSubInstructions: true,
            kioskPanel: false,
            building: 'Online Subscription',
            showReceipt: false,
            completeTask: false,
            message: null,
            selectedCategory: 'All',
            subscriptionCart: [],
            subscriptions: [
                { code: 1, name: "Spotify Premium", price: 150, logic: "Discount", rate: 0.10, desc: "10% student discount" },
                { code: 2, name: "Netflix Basic", price: 200, logic: "Sales Tax", rate: 0.12, desc: "12% sales tax" },
                { code: 3, name: "ML Diamonds", price: 250, logic: "Commission", rate: 0.05, desc: "5% agent commission" },
                { code: 4, name: "Apple Music", price: 180, logic: "Simple Interest", rate: 0.10, years: 1, desc: "10% interest/year" },
                { code: 5, name: "PlayStation Plus", price: 500, logic: "Discount", rate: 0.20, desc: "20% summer sale" },
                { code: 6, name: "Disney+", price: 300, logic: "Sales Tax", rate: 0.12, desc: "12% sales tax" },
                { code: 7, name: "YouTube Premium", price: 200, logic: "Commission", rate: 0.10, desc: "10% promoter commission" },
                { code: 8, name: "Discord Nitro", price: 250, logic: "Simple Interest", rate: 0.08, years: 2, desc: "8% interest for 2 years" },
                { code: 9, name: "Roblox Premium", price: 400, logic: "Discount", rate: 0.15, desc: "15% off" },
                { code: 10, name: "Canva Pro", price: 500, logic: "Commission", rate: 0.05, desc: "5% affiliate commission" },
                { code: 11, name: "Deezer", price: 180, logic: "Simple Interest", rate: 0.10, years: 2, desc: "10% interest for 2 years" },
                { code: 12, name: "Xbox Game Pass", price: 450, logic: "Discount", rate: 0.10, desc: "10% off" },
                { code: 13, name: "TikTok Premium", price: 250, logic: "Sales Tax", rate: 0.12, desc: "12% sales tax" },
                { code: 14, name: "Adobe Creative Cloud", price: 500, logic: "Simple Interest", rate: 0.06, years: 3, desc: "6% interest for 3 years" },
                { code: 15, name: "Zoom Premium", price: 120, logic: "Discount", rate: 0.05, desc: "5% student discount" }
            ],
            showQuestion: false,
            promoQuestion: [],
            setEvent: null,
            questionError: {
                show: false,
                message: null
            },
            answer: null
        }
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
        categories() {
            return ['All', ...Object.keys(this.menuData)];
        },

        filteredMenu() {
            if (this.selectedCategory === 'All') {
                return this.menuData;
            }
            return {
                [this.selectedCategory]: this.menuData[this.selectedCategory]
            };
        },

        // ✅ This is NOT undefined
        totalCount() {
            return this.subscriptionCart.reduce(
                (acc, item) => {
                    acc.totalQuantity += item.quantity;
                    acc.totalAmount += item.price * item.quantity;
                    return acc;
                },
                { totalQuantity: 0, totalAmount: 0 }
            );
        },

        cartItemCount() {
            return this.totalCount.totalQuantity;
        },

        cartTotal() {
            return this.totalCount.totalAmount;
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
        addToCart(item) {
            if (item.rate != 0) {
                this.promoQuestion = item
                this.showQuestion = true
                return;
            }
            const findItem = this.subscriptionCart.find(
                itemCart => itemCart.code === item.code
            );

            if (findItem) {
                findItem.quantity += 1;
            } else {
                const storeItem = {
                    code: item.code,
                    name: item.name,
                    quantity: 1,
                    price: item.price
                };
                this.subscriptionCart.push(storeItem);
            }
        },
        removeFromCart(item) {
            const index = this.subscriptionCart.findIndex(
                i => i.code === item.code
            );

            if (index !== -1) {
                const cartItem = this.subscriptionCart[index];
                cartItem.quantity--;

                if (cartItem.quantity <= 0) {
                    this.subscriptionCart.splice(index, 1);
                }
            }
        },
        formatPrice(price) {
            // Ensures price is a number for calculation, then formats
            const numericPrice = typeof price === 'string' ? parseFloat(price.replace('₱', '')) : price;
            return '₱' + numericPrice.toFixed(2);
        },
        processPayment() {
            if (this.subscriptionCart.length === 0) return;
            if (this.expectedBudget != this.cartTotal) {
                if (this.expectedBudget > this.cartTotal) {
                    this.message = 'Add More Items';
                    setTimeout(() => { this.message = null }, 2000)
                    return;
                } else {
                    this.message = 'You have exceeded your fastfood budget';
                    setTimeout(() => { this.message = null }, 2000)
                    return;
                }
            }
            console.log(this.totalCount)
            this.kioskPanel = false
            this.completeTask = true
        },
        startSubTask() {
            this.showSubInstructions = false;
            this.showTask = true; // Opens the actual menu
            this.message = "Welcome to the Digital Marketplace! <br> Tap the Monitor";
            setTimeout(() => { this.message = null }, 3000);
        },
        async nextGame() {
            // Deduct coins
            updateCoins(this.cartTotal);

            // Complete current building based on route
            completeBuilding(this.$route.path, '/building/online-subscription');

            // Sync progress
            await storeGameProgress();
            await fetchGameProgress();

            // Return to map
            this.$router.push('/map');
        },
        closeQuestion() {
            this.showQuestion = false
            this.promoQuestion = []
            this.setEvent = null
            this.questionError = {
                show: false,
                message: null
            }
            this.answer = null
        },
        generateQuestion(item) {
            const price = item.price;
            const ratePercent = item.rate * 100;

            switch (item.logic) {
                case 'Discount':
                    return `  ${item.name} costs ₱${price}. A ${ratePercent}% discount is applied. What is the final price after the discount?`;

                case 'Sales Tax':
                    return `${item.name} costs ₱${price}. A ${ratePercent}% sales tax is added. What is the total price after tax?      `;

                case 'Simple Interest':
                    return `${item.name} costs ₱${price}. It has ${ratePercent}% simple interest per year for ${item.years || 1} year(s).What is the total amount to be paid?`;

                case 'Commission':
                    return `${item.name} costs ₱${price}. There is a ${ratePercent}% commission, but the buyer pays only the base price. What is the final price paid by the buyer? `;

                default:
                    return `What is the final price of ${item.name}?`;
            }
        }

    }
}

</script>
<style>
.supermarket-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.supermarket-bg {
    width: 100%;
    height: 100vh;
    background-image: url('/assets/online-subscription/online-subscription-bg.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
}

.kiosk {
    position: absolute;
    top: 91px;
    left: 31%;
    width: 15%;
    height: 22%;
    z-index: 2;
}

.paper-bag {
    width: 20px;
    height: 20px;
}

.atm-info {
    background-color: rgba(255, 255, 255, 0.5);
}

.task-content {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 7;
    overflow-y: scroll;
}

.stall-content {
    margin: 10px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    width: 98%;
    height: 95%;
    z-index: 7;
}

.selected-stall {
    width: 70%;
}

/* --- ANIMATION CLASS (CRITICAL) --- */
.animating-clone {
    position: fixed;
    /* Allows movement independent of document flow */
    z-index: 10000;
    transition: transform 0.8s cubic-bezier(0.5, -0.5, 0.7, 1.5), opacity 0.8s;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    border-radius: 4px;
}

.cart-items {
    background-color: rgba(255, 255, 255, 0.5);
    position: absolute;
    width: 100%;
    height: 95%;
    z-index: 7;
    align-items: center;

}

.cart-items-content {
    top: 5%;
    left: 25%;
    margin: 10px;
    width: 50%;
    height: 95%;
}

/* Message Box Styling */
.message-box {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10001;
    padding: 15px 30px;
    border-radius: 8px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* --- CASH RECEIPT STYLING --- */
.cash-receipt-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    /* Dark overlay */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    overflow-y: auto;
}

.cash-receipt-container {
    margin-top: 10%;
    width: 380px;
    /* Fixed width */
    max-height: 1000vh;
    /* Limit the maximum height of the entire receipt on screen */
    background-color: #fdfdfd;
    /* Off-white receipt paper */
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    padding: 30px;
    position: relative;
    font-family: 'Courier New', monospace;
    /* Classic receipt font */
    font-size: 13px;
    color: #333;
    line-height: 1.4;
    display: flex;
    flex-direction: column;
    /* Allows content to stack and scrollable part to expand */
}

.cash-receipt-header {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 20px;
    position: relative;
    flex-shrink: 0;
    /* Header doesn't shrink when scrolling */
}

.cash-receipt-header::before {
    content: '';
    position: absolute;
    top: -30px;
    /* Position above the receipt */
    left: 50%;
    transform: translateX(-50%);
    width: 120%;
    /* Wider than receipt */
    height: 30px;
    background-color: #555;
    /* Simulates the machine opening */
    border-radius: 5px 5px 0 0;
    box-shadow: inset 0 -5px 10px rgba(0, 0, 0, 0.3);
    z-index: -1;
}

.receipt-info {
    margin-bottom: 15px;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 10px;
    flex-shrink: 0;
    /* Info section doesn't shrink */
}

/* NEW SCROLLABLE WRAPPER */
.scrollable-items-wrapper {
    flex-grow: 1;
    /* Allows this section to fill available space */
    overflow-y: auto;
    /* Makes this section scrollable */
    padding-right: 15px;
    /* Add space for scrollbar */
    margin-right: -15px;
    /* Compensate for the padding */
    border-bottom: 1px dashed #ccc;
    margin-bottom: 15px;
    padding-bottom: 10px;
}

.receipt-items {
    list-style: none;
    padding: 0;
    margin: 0;
}

.receipt-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.receipt-item span:first-child {
    flex-grow: 1;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.receipt-item span:last-child {
    text-align: right;
    min-width: 60px;
    flex-shrink: 0;
}

.receipt-total {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 15px;
    padding-top: 10px;
    border-top: 1px dashed #ccc;
    flex-shrink: 0;
    /* Total doesn't shrink */
}

.receipt-total span:last-child {
    font-size: 18px;
    /* Larger total price */
}

.receipt-congratulations {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    margin-top: 25px;
    color: #28a745;
    /* Green for success */
    flex-shrink: 0;
}

.receipt-button-container {
    text-align: center;
    margin-top: 30px;
    flex-shrink: 0;
}

.receipt-button-container .btn {
    background-color: #007bff;
    /* Blue button */
    border-color: #007bff;
    font-weight: bold;
    padding: 10px 30px;
    border-radius: 25px;
    font-size: 16px;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
}

.receipt-button-container .btn:hover {
    background-color: #0056b3;
    border-color: #0056b3;
}

.instruction-step {
    background: #fff;
    padding: 15px;
    border-radius: 12px;
    border-left: 5px solid rgba(0, 0, 0, 0.7);
    ;
    margin-bottom: 15px;
}

.instruction-step h5 {
    margin-bottom: 5px;
    font-size: 1rem;
}

/* Custom scrollbar for the instructions text */
.overflow-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-auto::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.7);
    ;
    border-radius: 10px;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.cursor-pointer {
    cursor: pointer;
}

/* Ensure the stall-content is scrollable for many menu items */
.stall-content {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.text-blue {
    color: #007bff;
}
</style>
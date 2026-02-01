<template>
    <div class="supermarket-container supermarket-bg">
        <Navbar :budgetName="building" :store="true" :tools="enabledTools" :coins="coin" />
        <div v-if="message" class="message-box bg-warning text-dark">
            {{ message }}
        </div>
        <img v-for="(stall, index) in stalls" :key="index" class="stall stall-image" :style="stall.position"
            @click="choiceStall(index)" alt="">
        <div class="cashier" @click="tapCart"> </div>
        <!-- <img @click="tapCart" src="/assets/supermarket/cart.png" alt="" class="cart"> -->
        <div v-if="showTask" class=" atm-info task-content">
            <div class="p-4 align-items-start position-relative z-1">
                <div class="right-content d-flex flex-column gap-4">
                    <!-- Instructions Card -->
                    <div class="card border-0 shadow-lg position-relative"
                        style="width:50%;border: 4px solid #e5e7eb; left: 25%;">
                        <!-- Visual tab on left -->
                        <div class="position-absolute top-0 start-0 mt-4 ms-n3 bg-secondary rounded-end border border-secondary"
                            style="width: 10px; height: 40px; left: -14px;"></div>

                        <div class="card-body p-4">
                            <div class="close-task" @click="closeTask">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18" stroke="#fff" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M6 6L18 18" stroke="#fff" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                            <h6 class="card-title fw-black border-bottom border-dark d-inline-block pb-1 mb-3">
                                TASK 3:
                            </h6>

                            <div class="card-text text-secondary-emphasis">
                                <p>
                                    Your task is to budget of your assigned percentage of your money for department
                                    store
                                    expenses.
                                </p>

                                <div class="alert alert-info border-start border-info border-4 rounded mb-0 ">
                                    <p class="fw-bold d-flex align-items-center gap-2 mb-2">
                                        Rewards:
                                    </p>
                                    <p class="small mb-1">The FastFood level unlocked.</p>
                                </div>
                            </div>
                            <button @click="gameStart"
                                class="btn btn-sm btn-info w-100 rounded mt-4 text-white fw-bold">
                                START THE GAME
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div v-if="showStalls" class="stall-content">
            <div class="row p-4 align-items-start position-relative z-1">
                <!-- LEFT COL: Clipboard -->
                <div class="left-content col-sm-6 col-xs-6 d-flex flex-column align-items-center">
                    <div class="stall-container position-relative">
                        <img class="selected-stall" :src="stallContent.image" alt="Stall Image"
                            :style="{ width: stallContent.size }">
                        <!--  <h2>{{ stallContent.size }}</h2> -->
                        <div class="items-display position-absolute w-100 h-100" style="top: 0; left: 0;">
                            <div v-for="(item, index) in stallContent.items" :key="index" class="item-hotspot" :style="{
                                top: item.top,
                                left: item.left,
                                width: item.width,
                                height: item.height,
                                fontAlign: 'center'
                            }" @click="addToCartWithAnimation(item, $event)">
                                <!-- <span class="badge bg-info">{{ item.name }}</span> -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- RIGHT COL: Info -->
                <div class="right-content col-sm-6 col-xs-6 d-flex flex-column gap-4">
                    <!-- Instructions Card -->
                    <div class="card border-0 shadow-lg position-relative" style="border: 4px solid #e5e7eb;">
                        <!-- Visual tab on left -->
                        <div class="position-absolute top-0 start-0 mt-4 ms-n3 bg-secondary rounded-end border border-secondary"
                            style="width: 10px; height: 40px; left: -14px;"></div>

                        <div class="card-body p-4 text-center">
                            <img id="cart-target" src="/assets/department-store/shopping-basket.png" alt=""
                                style="width: 50%;">
                            <p class="mt-2 text-muted">Items in cart:
                                <span class="fw-bold">{{ cartItemCount }}</span>
                            </p>
                        </div>
                    </div>
                    <button @click="closeStall" class="btn btn-sm btn-primary rounded">NEXT ITEMS</button>
                </div>
            </div>
        </div>
        <div v-if="showCart" class="cart-items">
            <div class="card shadow cart-items-content">
                <div class="card-header bg-white border-bottom text-primary fw-semibold">
                    <button class="btn btn-danger btn-sm float-end" @click="showCart = false">CLOSE</button>
                    <h6 class="mb-0 fw-bolder">Your Cart ({{ cartItemCount }} items)</h6>

                </div>
                <div class="card-body">
                    <div class="overflow-auto" style="max-height: 40vh; margin-bottom: 1rem;">
                        <div v-for="cartItem in shoppingCart" :key="cartItem.code"
                            class="d-flex justify-content-between align-items-center bg-light rounded-3">
                            <div>
                                <span class="fw-bold">{{ cartItem.quantity }}x {{ cartItem.name }}</span>
                                <br><small class="text-muted">
                                    @ ₱{{ cartItem.price.toFixed(2) }}
                                </small>
                            </div>
                            <div class="d-flex align-items-center">
                                <button @click="addItemFromCart(cartItem)"
                                    class="btn btn-sm text-primary hover:text-primary rounded-circle lh-1 fs-5">
                                    &plus;
                                </button>
                                <span class="me-2 fw-semibold fs-6">
                                    ₱{{ (cartItem.quantity * (cartItem.price)).toFixed(2) }}
                                </span>
                                <button @click="removeItemFromCart(cartItem)"
                                    class="btn btn-sm text-danger hover:text-danger rounded-circle lh-1 fs-5">
                                    &minus;
                                </button>
                            </div>
                        </div>
                        <div v-if="cartItemCount === 0" class="text-center text-muted p-4">Cart is empty.</div>
                    </div>

                    <div class="border-top border-secondary">
                        <p class="fs-6 d-flex justify-content-between text-success fw-bolder">
                            Total to Pay (Current): <span class="fw-bolder">₱{{ cartTotal.toFixed(2) }}</span>
                        </p>
                    </div>

                    <button @click="showReceiptScreen" :disabled="cartItemCount < 2" :class="['w-100', 'btn', 'shadow-lg', 'rounded-3', 'transition',
                        { 'btn-success': cartItemCount >= 2, 'btn-secondary text-muted': cartItemCount < 2 }]">
                        Go to Checkout (Minimum 2 Items)
                    </button>
                </div>
            </div>
        </div>
        <div v-if="showQuestion" class=" atm-info task-content">
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
                                    A {{ promoQuestion.name }} costs ₱{{ promoQuestion.price }}. The Department Store
                                    gives a
                                    <b>
                                        {{ promoQuestion.promo * 100 }}% discount</b>. <br> What is the new price?
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
    </div>
    <div v-if="showReceipt" class="cash-receipt-overlay">
        <div class="cash-receipt-container">
            <div class="cash-receipt-header">
                CASH RECEIPT
            </div>
            <div class="receipt-info">
                <div>Tel: 123-456-789</div>
                <div>Date: {{ getCurrentDate() }}</div>
            </div>
            <div class="scrollable-items-wrapper">
                <ul class="receipt-items">
                    <!-- Dynamically list items from the cart, grouping duplicates -->
                    <li v-for="(item, index) in shoppingCart" :key="index" class="receipt-item">
                        <span>{{ item.name }}</span>
                        <span>{{ item.quantity }} x {{ formatPrice(item.price) }}</span>
                        <span>{{ formatPrice(item.quantity * item.price) }}</span>
                    </li>
                </ul>
            </div>
            <div class="receipt-total">
                <span>Total:</span>
                <span>Items ({{ this.cartItemCount }})</span>
                <span>{{ formatPrice(cartTotal) }}</span>
            </div>
            <div class="receipt-congratulations">
                CONGRATULATIONS!
            </div>

            <div class="receipt-button-container">
                <button @click="nextGame" class="btn btn-primary">NEXT</button>
            </div>
        </div>
    </div>

</template>
<script>
import Navbar from '../Navbar.vue';
import { storeGameProgress, fetchGameProgress } from '../../controller';
import { updateCoins, completeBuilding } from '../../gameProgress.service';
export default {
    name: 'DepartmentStore',
    components: {
        Navbar,
    },
    data() {
        return {
            isReadTask: false,
            showTask: false,
            showTerminal: false,
            showStalls: false,
            showCart: false,
            building: 'Department Store',
            stallContent: [],
            stalls: [{
                image: '/assets/department-store/stall-1.png',
                position: 'bottom: 1%; left: 23%;z-index:1; ',
                size: '100%',
                items: [
                    { code: 101, name: 'Eyeshadow Palette (Large)', price: 395.00, promo: 0, top: '13%', left: '5%', width: '40%', height: '12%' },
                    { code: 102, name: 'Eyeshadow Palette (Small)', price: 245.00, promo: 0, top: '13%', left: '55%', width: '40%', height: '12%' },
                    { code: 103, name: 'Liquid Blush', price: 395.00, promo: 0, top: '28%', left: '5%', width: '25%', height: '13%' },
                    { code: 104, name: 'Lip Tint', price: 175.00, promo: 0, top: '28%', left: '33%', width: '30%', height: '13%' },
                    { code: 105, name: 'Lip Gloss', price: 225.00, promo: 0, top: '28%', left: '65%', width: '30%', height: '13%' },
                    { code: 106, name: 'Face Serum', price: 470.00, promo: 0, top: '44%', left: '5%', width: '25%', height: '13%' },
                    { code: 107, name: 'Foundation', price: 259.00, promo: 0, top: '44%', left: '33%', width: '30%', height: '13%' },
                    { code: 108, name: 'Concealer', price: 195.00, promo: 0, top: '44%', left: '65%', width: '30%', height: '13%' },
                    { code: 109, name: 'Face Cream', price: 175.00, promo: 0, top: '60%', left: '5%', width: '35%', height: '13%' },
                    { code: 110, name: 'Face Toner', price: 145.00, promo: 0, top: '60%', left: '42%', width: '25%', height: '13%' },
                    { code: 111, name: 'Face Mist', price: 150.00, promo: 0, top: '60%', left: '70%', width: '25%', height: '13%' },
                    { code: 112, name: 'Skincare Set', price: 300.00, promo: 0.10, top: '78%', left: '5%', width: '90%', height: '18%', }
                ]
            },
            {
                image: '/assets/department-store/stall-2.png',
                position: 'bottom: 1%; left: 51%;z-index:1;',
                size: '100%',
                items: [
                    { code: 201, name: 'Perfume', price: 1755.00, promo: 0.20, top: '10%', left: '5%', width: '90%', height: '18%' },
                    { code: 202, name: 'Bag 1 (Pink)', price: 300.00, promo: 0, top: '28%', left: '5%', width: '28%', height: '18%' },
                    { code: 203, name: 'Bag 2 (Peach)', price: 500.00, promo: 0, top: '28%', left: '36%', width: '28%', height: '18%' },
                    { code: 204, name: 'Bag 3 (Quilted)', price: 700.00, promo: 0, top: '28%', left: '67%', width: '28%', height: '18%' },
                    { code: 205, name: 'Coin Purse', price: 200.00, promo: 0, top: '48%', left: '5%', width: '28%', height: '15%' },
                    { code: 206, name: 'Women Wallet', price: 250.00, promo: 0, top: '48%', left: '36%', width: '28%', height: '15%' },
                    { code: 207, name: 'Men Wallet', price: 150.00, promo: 0, top: '48%', left: '67%', width: '28%', height: '15%' },
                    { code: 208, name: 'Scarf 1 (Striped)', price: 400.00, promo: 0, top: '63%', left: '5%', width: '28%', height: '15%' },
                    { code: 209, name: 'Scarf 2 (Yellow)', price: 350.00, promo: 0, top: '63%', left: '36%', width: '28%', height: '15%' },
                    { code: 210, name: 'Scarf 3 (Red)', price: 450.00, promo: 0, top: '63%', left: '67%', width: '28%', height: '15%' },
                    { code: 211, name: 'Cap 1 (Grey)', price: 395.00, promo: 0, top: '78%', left: '5%', width: '28%', height: '12%' },
                    { code: 212, name: 'Cap 2 (Pink)', price: 345.00, promo: 0, top: '78%', left: '36%', width: '28%', height: '12%' },
                    { code: 213, name: 'Cap 3 (Blue)', price: 295.00, promo: 0, top: '78%', left: '67%', width: '28%', height: '12%' },
                    { code: 214, name: 'Belts', price: 145.00, promo: 0, top: '90%', left: '5%', width: '90%', height: '8%' }
                ]
            },
            {
                image: '/assets/department-store/stall-3.png',
                position: 'bottom: 1%; left: 69%; z-index:1;',
                size: '100%',
                items: [
                    { code: 301, name: 'Socks Set 1', price: 245.00, promo: 0, top: '12%', left: '5%', width: '40%', height: '12%' },
                    { code: 302, name: 'Socks Set 2', price: 245.00, promo: 0, top: '12%', left: '55%', width: '40%', height: '12%' },
                    { code: 303, name: 'Yellow Slipper', price: 200.00, promo: 0, top: '25%', left: '5%', width: '28%', height: '15%' },
                    { code: 304, name: 'Blue Slipper', price: 200.00, promo: 0, top: '25%', left: '36%', width: '28%', height: '15%' },
                    { code: 305, name: 'Green Slipper', price: 200.00, promo: 0, top: '25%', left: '67%', width: '28%', height: '15%' },
                    { code: 306, name: 'Red Sneakers', price: 2995.00, promo: 0.50, top: '42%', left: '5%', width: '28%', height: '18%' },
                    { code: 307, name: 'Blue High Top', price: 2995.00, promo: 0.80, top: '42%', left: '36%', width: '28%', height: '18%' },
                    { code: 308, name: 'Blue Low Top', price: 2300.00, promo: 0.80, top: '42%', left: '67%', width: '28%', height: '18%' },
                    { code: 309, name: 'Red Heels', price: 1500.00, promo: 0.10, top: '60%', left: '5%', width: '28%', height: '18%' },
                    { code: 310, name: 'Black Heels', price: 45.00, promo: 0.10, top: '60%', left: '36%', width: '28%', height: '18%' },
                    { code: 311, name: 'Pink Heels', price: 995.00, promo: 0.10, top: '60%', left: '67%', width: '28%', height: '18%' },
                    { code: 312, name: 'Yellow Boots', price: 1450.00, promo: 0.10, top: '78%', left: '5%', width: '28%', height: '20%' },
                    { code: 313, name: 'Brown Boots', price: 1300.00, promo: 0.10, top: '78%', left: '36%', width: '28%', height: '20%' },
                    { code: 314, name: 'Pink Boots', price: 600.00, promo: 0.10, top: '78%', left: '67%', width: '28%', height: '20%' }
                ]
            },
            {
                image: '/assets/department-store/stall-4.png',
                position: 'top: 10%; left: 3%;z-index:1;',
                size: '130%',
                items: [
                    { code: 501, name: 'Tops 1 (Yellow)', price: 200.00, promo: 0, top: '30%', left: '5%', width: '32%', height: '25%' },
                    { code: 502, name: 'Tops 2 (Pink/Brown)', price: 250.00, promo: 0, top: '30%', left: '38%', width: '28%', height: '25%' },
                    { code: 503, name: 'Blouse (Peach/Purple)', price: 275.00, promo: 0, top: '30%', left: '66%', width: '25%', height: '25%' },
                    { code: 504, name: 'Dress (White/Black/Red)', price: 350.00, promo: 0, top: '30%', left: '92%', width: '33%', height: '45%' },
                    /*  { code: 505, name: 'Folded Shirts (Left Stack)', price: 150.00, promo: 0, top: '63%', left: '5%', width: '15%', height: '15%' },
                     { code: 506, name: 'Folded Shirts (Middle Stack)', price: 150.00, promo: 0, top: '65%', left: '21%', width: '15%', height: '13%' },
                     { code: 507, name: 'Folded Shirts (Right Stack)', price: 150.00, promo: 0, top: '68%', left: '37%', width: '13%', height: '10%' } */
                ]
            },
            {
                image: '/assets/department-store/stall-5.png',
                position: 'top: 5%; left: 43%;z-index:1;',
                size: '130%',
                items: [
                    { code: 601, name: 'Shirt', price: 380.00, promo: 0.10, top: '28%', left: '5%', width: '45%', height: '30%' },
                    { code: 602, name: 'Hoodie', price: 200.00, promo: 0, top: '28%', left: '50%', width: '30%', height: '30%' },
                    { code: 603, name: 'Long Sleeve / Suit', price: 450.00, promo: 0, top: '28%', left: '82%', width: '43%', height: '33%' },
                    /*   { code: 604, name: 'Folded Shirts (Left)', price: 120.00, promo: 0, top: '63%', left: '5%', width: '15%', height: '15%' },
                      { code: 605, name: 'Folded Shirts (Middle)', price: 120.00, promo: 0, top: '65%', left: '21%', width: '15%', height: '13%' },
                      { code: 606, name: 'Folded Shirts (Right)', price: 120.00, promo: 0, top: '68%', left: '37%', width: '13%', height: '10%' } */
                ]
            }, {
                image: '/assets/department-store/stall-6.png',
                position: 'top:15%; left: 65%;z-index:1;',
                size: '130%',
                items: [
                    { code: 401, name: 'Long Skirts', price: 500.00, promo: 0.20, top: '22%', left: '3%', width: '68%', height: '35%' },
                    { code: 402, name: 'Pants', price: 1700.00, promo: 0, top: '22%', left: '70%', width: '55%', height: '35%' },
                    { code: 403, name: 'Women\'s Short', price: 400.00, promo: 0, top: '58%', left: '5%', width: '40%', height: '18%' },
                    { code: 404, name: 'Skirts', price: 500.00, promo: 0, top: '58%', left: '46%', width: '38%', height: '18%' },
                    { code: 405, name: 'Men\'s Pants', price: 700.00, promo: 0, top: '58%', left: '85%', width: '40%', height: '22%' }
                ]
            }],
            shoppingCart: [],
            showReceipt: false,
            message: null,
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
        coin() {
            return localStorage.getItem('coin') ?? 0;
        },
        totalCount() {
            return this.shoppingCart.reduce((acc, item) => {
                acc.totalQuantity += item.quantity;
                acc.totalAmount += item.price * item.quantity; // include quantity in price calculation
                return acc;
            }, { totalQuantity: 0, totalAmount: 0 });
        },
        cartItemCount() {
            return this.totalCount.totalQuantity
        },
        cartTotal() {
            return this.totalCount.totalAmount
        },
        expectedBudget() {
            const budgetPlan = localStorage.getItem('budgetPlan')
            const plan = JSON.parse(budgetPlan);
            const budget = plan.find(item => item.name === this.building);
            return budget.amount
        }
    },
    methods: {
        async nextGame() {
            // Deduct coins
            updateCoins(this.cartTotal);

            // Complete current building based on route
            completeBuilding(this.$route.path, '/building/fastfood');

            // Sync progress
            await storeGameProgress();
            await fetchGameProgress();

            // Return to map
            this.$router.push('/map');
        },
        choiceStall(stall) {
            if (this.isReadTask) {
                this.showStalls = true
                this.stallContent = this.stalls[stall]
            } else {
                this.message = "Select the Cashier for the Instruction"
                setTimeout(() => {
                    this.message = null;
                }, 2000);
            }

        },
        closeStall() {
            this.showStalls = false
        },
        tapCart() {
            if (this.isReadTask) {
                this.showCart = true
            } else {
                this.showTask = true
            }
        },
        gameStart() {
            this.isReadTask = true;
            this.showTask = false
        },
        getCartPosition() {
            const cartImage = document.getElementById('cart-target');
            if (!cartImage) return null;

            const rect = cartImage.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2, // Center X
                y: rect.top + rect.height / 2 // Center Y
            };
        },
        addToCartWithAnimation(item, event) {
            if (!this.isReadTask) {
                showMessage("Please read the task first! Click the cart to start.");
                return;
            }
            if (item.promo != 0) {
                this.promoQuestion = item
                this.setEvent = event
                this.showQuestion = true
                return;
            }
            const cartPos = this.getCartPosition();
            if (!cartPos) {
                console.error("Cart target not found for animation.");
                return;
            }

            const startEl = event.currentTarget; // The clicked hotspot div
            const startRect = startEl.getBoundingClientRect();

            // 1. CREATE AND POSITION THE CLONE ELEMENT
            const clone = document.createElement('div');
            clone.classList.add('animating-clone');

            // --- MODIFIED TO USE IMAGE ---
            // Use the item image for the clone
            const initialSize = 50; // Standard size for the flying object
            if (item.image) {
                clone.innerHTML = `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;">`;
            } else {
                // Fallback to text if no image is available
                clone.textContent = item.name.split(' ')[0];
                clone.style.backgroundColor = '#3498db';
            }

            // Set initial size and position (fixed to viewport)
            clone.style.width = initialSize + 'px';
            clone.style.height = initialSize + 'px';

            // Center the clone on the clicked hotspot
            clone.style.left = startRect.left + (startRect.width / 2) - (initialSize / 2) + 'px';
            clone.style.top = startRect.top + (startRect.height / 2) - (initialSize / 2) + 'px';
            clone.style.margin = '0';
            // --- END MODIFIED SECTION ---

            document.body.appendChild(clone);

            // 2. CALCULATE THE MOVEMENT DISTANCE
            const cloneRect = clone.getBoundingClientRect(); // Get the calculated position of the clone

            const startCenterX = cloneRect.left + (cloneRect.width / 2);
            const startCenterY = cloneRect.top + (cloneRect.height / 2);

            const deltaX = cartPos.x - startCenterX;
            const deltaY = cartPos.y - startCenterY;
            // 3. START THE TRANSITION
            // Use requestAnimationFrame to ensure the initial position is rendered before the transition starts
            requestAnimationFrame(() => {
                clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;
                clone.style.image = item.image
                clone.style.opacity = '0';
            });

            // 4. AFTER ANIMATION: Add item to cart and clean up
            requestAnimationFrame(() => {
                // Move and scale down to look like it's landing inside
                clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;
                clone.style.opacity = '0';
            });

            // 4. AFTER ANIMATION: Add item to cart and clean up
            clone.addEventListener('transitionend', () => {
                // Add the item to the cart array *after* the animation
                const findItem = this.shoppingCart.find(itemCart => itemCart.code === item.code);
                if (findItem) {
                    findItem.quantity += 1
                } else {
                    const storeItem = {
                        code: item.code,
                        name: item.name,
                        quantity: 1,
                        price: item.price,
                    }
                    this.shoppingCart.push(storeItem);
                }
                // Simple visual feedback on the cart icon
                const cartEl = document.getElementById('cart-target');
                if (cartEl) {
                    cartEl.style.transition = 'transform 0.1s';
                    cartEl.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        cartEl.style.transform = 'scale(1)';
                    }, 100);
                }

                clone.remove();
            }, { once: true });
        },
        addItemFromCart(item) {
            const index = this.shoppingCart.findIndex(
                i => i.code === item.code
            );

            if (index !== -1) {
                // item already in cart → increase quantity
                this.shoppingCart[index].quantity++;
            } else {
                // item not in cart → add it
                this.shoppingCart.push({
                    ...item,
                    quantity: 1
                });
            }
        },
        removeItemFromCart(item) {
            const index = this.shoppingCart.findIndex(i => i.code === item.code);
            if (index !== -1) {
                const cartItem = this.shoppingCart[index];
                cartItem.quantity--;
                if (cartItem.quantity <= 0) {
                    this.shoppingCart.splice(index, 1);
                }
            }

        },
        getCurrentDate() {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            const yy = String(today.getFullYear()).slice(-2);
            return `${dd}/${mm}/${yy}`;
        }, formatPrice(price) {
            // Ensures price is a number for calculation, then formats
            const numericPrice = typeof price === 'string' ? parseFloat(price.replace('₱', '')) : price;
            return '₱' + numericPrice.toFixed(2);
        },
        showReceiptScreen() {
            if (this.shoppingCart.length === 0) {
                this.showMessage("Your cart is empty! Add some items first.");
                return;
            }
            if (this.expectedBudget != this.cartTotal) {
                if (this.expectedBudget < this.cartTotal) {
                    this.showMessage('Add More Items')
                    return;
                } else {
                    this.showMessage('You have exceeded your grocery budget')
                    return;
                }
            }
            this.showCart = false; // 
            this.showReceipt = true; // 
        },
        showMessage(text) {
            this.message = text;
            setTimeout(() => {
                this.message = null;
            }, 2000);
        },
        submitAnswer() {
            console.log(this.promoQuestion)
            const price = this.promoQuestion.price
            const promo = this.promoQuestion.promo
            const rAnswer = price - (price * promo)
            console.log(price * promo)
            console.log(rAnswer)
            if (rAnswer != this.answer) {
                this.questionError.message = 'Wrong answer try again'
                this.questionError.show = true
                this.answer = ''
            } else {
                // this.promoQuestion.price = rAnswer
                const findItem = this.shoppingCart.find(itemCart => itemCart.code === this.promoQuestion.code);
                if (findItem) {
                    findItem.quantity += 1
                } else {
                    const storeItem = {
                        code: this.promoQuestion.code,
                        name: this.promoQuestion.name,
                        quantity: 1,
                        price: rAnswer,
                    }
                    this.shoppingCart.push(storeItem);
                }
                // Simple visual feedback on the cart icon
                const cartEl = document.getElementById('cart-target');
                if (cartEl) {
                    cartEl.style.transition = 'transform 0.1s';
                    cartEl.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        cartEl.style.transform = 'scale(1)';
                    }, 100);
                }
                this.closeQuestion()
            }
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
        }
    }
}

</script>
<style scoped>
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
    background-image: url('/assets/department-store/store.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
}

.stall {
    position: absolute;
    cursor: pointer;
    transition: all 0.2s ease-out;
    /* Center the lock image */
    display: flex;
    justify-content: center;
    align-items: center;
}

.stall-image {
    width: 15%;
    height: 30%;
}

.cashier {
    position: absolute;
    bottom: 5px;
    left: 10px;
    width: 15%;
    height: 17%;
    z-index: 2;
}

.terminal {
    position: absolute;
    bottom: 10px;
    left: 20px;
    width: 10%;
    z-index: 2;
}

.atm-info {
    background-color: rgba(255, 255, 255, 0.5);
}

.task-content {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 7;
}

.stall-container {
    width: 55%;
    /* Match your image width */
    margin: auto;
}

.selected-stall {
    /*  width: 100%; */
    /* Fill the container */
    display: block;
}

.items-display {
    pointer-events: none;
}

.item-hotspot {
    position: absolute;
    cursor: pointer;
    pointer-events: auto;
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px dashed rgba(255, 255, 255, 0.5);
    transition: transform 0.1s, background-color 0.2s;
}

.item-hotspot:active {
    transform: scale(0.95);
    background-color: rgba(255, 255, 255, 0.4);
}

.debug-label {
    text-align: center;
    font-size: 8px;
    font-weight: 900;
    color: rgb(234, 255, 0);
    pointer-events: none;
    /* Make sure text doesn't block the click */
    /* opacity: 0.5; */
}

.close-task {
    background-color: red;
    position: absolute;
    z-index: 7;
    right: 3%;
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

/* --- ITEM HOTSPOT STYLING --- */
.items-display {
    /* This div overlays the stall image to define clickable areas */
    pointer-events: none;
    /* Allows clicks to pass through by default */
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
</style>
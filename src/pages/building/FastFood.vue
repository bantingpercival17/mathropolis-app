<template>
    <div class="supermarket-container fastfood-bg">
        <Navbar :budgetName="building" :store="true" :tools="enabledTools" :coins="coin" />
        <div v-if="message" class="message-box bg-warning text-white">
            {{ message }}
        </div>
        <div class="fastfood-kiosk" @click="kioskPanel = true"></div>
        <div v-if="isReadTask" class="task-content d-flex justify-content-center align-items-center"
            style="background: rgba(0,0,0,0.7);">
            <div class="stall-content p-4 text-center d-flex flex-column" style="max-width: 500px; height: 90%;">
                <h2 class="text-danger fw-bold mb-3">🍔 HOW TO PLAY</h2>

                <div class="text-start mb-4 overflow-auto" style="max-height: 400px;">
                    <div class="instruction-step mb-3">
                        <h5 class="fw-bold text-dark">1. Tap the Kiosk</h5>
                        <p class="text-muted small">Tap the Kiosk to find some meal and can you select by categories at
                            the top (like 'Rice Meals' or 'Drinks') to
                            filter the menu.</p>
                    </div>



                    <div class="instruction-step mb-3">
                        <h5 class="fw-bold text-dark">2. Add to Cart</h5>
                        <p class="text-muted small">Tap any food item to add it to your tray. You'll see a message when
                            it's added.</p>
                    </div>

                    <div class="instruction-step mb-3">
                        <h5 class="fw-bold text-dark">3. Review & Checkout</h5>
                        <p class="text-muted small">Click the 🛒 Cart icon at the bottom right to see your receipt. Tap
                            <b>CHECKOUT</b> to finish!
                        </p>
                    </div>
                </div>

                <button class="btn btn-danger btn-lg w-100 rounded-pill fw-bold" @click="startGame">
                    GOT IT, LET'S EAT!
                </button>
            </div>
        </div>
        <div v-if="kioskPanel" class="task-content d-flex justify-content-center align-items-center"
            style="background: rgba(0,0,0,0.7);">
            <div class="stall-content p-4 text-center d-flex flex-column" style="max-width: 650px; height: 90%;">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h2 class="text-danger fw-bold m-0">4 SISTER'S MENU</h2>
                    <button class="btn btn-sm btn-outline-secondary" @click="kioskPanel = false">Close</button>
                </div>
                <div class="row">
                    <!-- Food Items -->
                    <div class="col-7">
                        <div class="d-flex gap-2 overflow-auto pb-3 mb-3 no-scrollbar">
                            <div class="paper-bag" @click="openReceipt">
                                <img src="/assets/fastfood/paper-bag.png" alt="Cart" class="img-fluid cursor-pointer">
                                <span v-if="cartItemCount.length > 0"
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {{ this.cartItemCount }}
                                </span>
                            </div>
                            <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
                                :class="['btn rounded-pill text-nowrap', selectedCategory === cat ? 'btn-danger' : 'btn-light border']">
                                {{ cat }}
                            </button>
                        </div>

                        <div class="row g-3 overflow-auto" style="max-height: 65vh;">
                            <!-- Food Items -->
                            <div v-for="(items, catName) in filteredMenu" :key="catName" class="col-12">
                                <h5 class="text-secondary small text-uppercase fw-bold">{{ catName }}</h5>
                                <div class="list-group">
                                    <button v-for="item in items" :key="item.name" @click="addToCart(item)"
                                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 shadow-sm mb-2 rounded">
                                        <span class="fw-semibold">{{ item.name }}</span>
                                        <span class="badge bg-danger rounded-pill">₱{{ item.price.toFixed(2) }}</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Cart Items -->
                        </div>
                    </div>
                    <div class="col-5 col-4 m-0 p-0">
                        <label for="" class="fw-bolder text-center text-danger">FOOD CART</label>
                        <div class="text-start mb-4 overflow-auto" style="height: 130px;">
                            <template v-if="foodCart.length > 0">
                                <div class="instruction-step mb-3 p-1 d-flex justify-content-between align-items-center bg-light rounded-3"
                                    v-for="item in foodCart" :key="item.code">
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
                        <button class="btn btn-danger btn-sm w-100" @click="processPayment">CHECKOUT</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div v-if="showReceipt" class="cash-receipt-overlay" @click.self="showReceipt = false">
        <div class="cash-receipt-container">
            <div class="cash-receipt-header">
                4 SISTER'S OFFICIAL RECEIPT
            </div>

            <div class="receipt-info">
                <div>DATE: {{ new Date().toLocaleDateString() }}</div>
                <div>STALL: {{ building }}</div>
            </div>

            <div class="scrollable-items-wrapper">
                <div v-if="foodCart.length === 0" class="text-center py-4 text-muted">
                    Your cart is empty.
                </div>
                <ul class="receipt-items">
                    <li v-for="(item, index) in foodCart" :key="index" class="receipt-item">
                        <span>{{ item.name }}</span>
                        <div class="d-flex align-items-center gap-2">
                            <span>₱{{ item.price.toFixed(2) }}</span>
                            <button @click="removeFromCart(index)"
                                class="btn btn-sm text-danger p-0 border-0">&times;</button>
                        </div>
                        <!--  <span>{{ item.name }}</span>
                        <span>{{ item.quantity }} x {{ formatPrice(item.price) }}</span>
                        <span>{{ formatPrice(item.quantity * item.price) }}</span>
                        <button @click="removeFromCart(index)"
                            class="btn btn-sm text-danger p-0 border-0">&times;</button> -->
                    </li>
                    <!-- <li v-for="(item, index) in cart" :key="index" class="receipt-item">
                        <span>{{ item.name }}</span>
                        <div class="d-flex align-items-center gap-2">
                            <span>₱{{ item.price.toFixed(2) }}</span>
                            <button @click="removeFromCart(index)"
                                class="btn btn-sm text-danger p-0 border-0">&times;</button>
                        </div>
                    </li> -->
                </ul>
            </div>

            <div class="receipt-total">
                <span>TOTAL:</span>
                <span>₱{{ cartTotal.toFixed(2) }}</span>
            </div>

            <div class="receipt-button-container">
                <button class="btn btn-primary w-100 mb-2" @click="processPayment">CHECKOUT</button>
                <button class="btn btn-secondary  btn-sm" @click="showReceipt = false">Continue to Add Item</button>
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
                    <li v-for="(item, index) in foodCart" :key="index" class="receipt-item">
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
</template>
<script>
import Navbar from '../Navbar.vue';
import { storeGameProgress, fetchGameProgress } from '../../controller';
import { updateCoins, completeBuilding } from '../../gameProgress.service';
export default {
    name: 'FastFood',
    components: {
        Navbar,
    },
    data() {
        return {
            isReadTask: true,
            kioskPanel: false,
            building: 'FastFood',
            showReceipt: false,
            completeTask: false,
            message: null,
            selectedCategory: 'All',
            foodCart: [],
            menuData: {
                "Burgers & Sandwiches": [
                    { code: 101, name: "Cheeseburger", price: 40.00 },
                    { code: 102, name: "Sandwich", price: 50.00 },
                    { code: 103, name: "Burger Steak", price: 120.00 },
                    { code: 104, name: "Burger Combo", price: 250.00 }
                ],
                "Rice Meals": [
                    { code: 201, name: "Chicken Meal", price: 90.00 },
                    { code: 202, name: "Hotdog Meal", price: 80.00 },
                    { code: 203, name: "Fried Rice Meal", price: 200.00 },
                    { code: 204, name: "Chicken Bucket", price: 350.00 }
                ],
                "Pasta & Pizza": [
                    { code: 301, name: "Spaghetti", price: 100.00 },
                    { code: 302, name: "Pizza Slice", price: 70.00 },
                    { code: 303, name: "Family Pizza", price: 400.00 }
                ],
                "Sides & Drinks": [
                    { code: 401, name: "Fries (Small)", price: 30.00 },
                    { code: 402, name: "Softdrinks (Cup)", price: 25.00 },
                    { code: 403, name: "Milkshake", price: 150.00 }
                ]
            }
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
            return this.foodCart.reduce(
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
            const findItem = this.foodCart.find(
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
                this.foodCart.push(storeItem);
            }
        },
        removeFromCart(item) {
            const index = this.foodCart.findIndex(
                i => i.code === item.code
            );

            if (index !== -1) {
                const cartItem = this.foodCart[index];
                cartItem.quantity--;

                if (cartItem.quantity <= 0) {
                    this.foodCart.splice(index, 1);
                }
            }
        },
        formatPrice(price) {
            // Ensures price is a number for calculation, then formats
            const numericPrice = typeof price === 'string' ? parseFloat(price.replace('₱', '')) : price;
            return '₱' + numericPrice.toFixed(2);
        },
        processPayment() {
            if (this.foodCart.length === 0) return;
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
        startGame() {
            this.isReadTask = false; // Hide instructions
            this.showTask = true;    // Show the menu stall
            this.message = "Welcome to 4 Sister's! Start your order.";
            setTimeout(() => { this.message = null }, 3000);
        },
        openReceipt() {
            this.kioskPanel = false
            this.showReceipt = true
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

.fastfood-bg {
    width: 100%;
    height: 100vh;
    background-image: url('/assets/fastfood/fastfood-bg.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
}

.fastfood-kiosk {
    position: absolute;
    bottom: 75px;
    left: 50px;
    width: 10%;
    height: 50%;
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
    border-left: 5px solid #dc3545;
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
    background: #dc3545;
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
</style>
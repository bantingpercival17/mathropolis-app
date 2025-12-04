<template>
    <div class="supermarket-container supermarket-bg">
        <Navbar budgetName="Supermarket" store="true" />
        <div v-if="message" class="message-box bg-warning text-dark">
            {{ message }}
        </div>
        <img v-for="(stall, index) in stalls" :key="index" class="stall stall-image" :style="stall.position"
            @click="choiceStall(index)" :src="stall.image" alt="">
        <img @click="tapCart" src="/assets/supermarket/cart.png" alt="" class="cart">
        <img src="/assets/supermarket/terminal.png" alt="" class="terminal">
        <div v-if="showTask" class=" atm-info task-content">
            <div class="close-task" @click="closeTask">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#fff" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M6 6L18 18" stroke="#fff" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <div class="p-4 align-items-start position-relative z-1">
                <div class="right-content d-flex flex-column gap-4">
                    <!-- Instructions Card -->
                    <div class="card border-0 shadow-lg position-relative"
                        style="width:50%;border: 4px solid #e5e7eb; left: 25%;">
                        <!-- Visual tab on left -->
                        <div class="position-absolute top-0 start-0 mt-4 ms-n3 bg-secondary rounded-end border border-secondary"
                            style="width: 10px; height: 40px; left: -14px;"></div>

                        <div class="card-body p-4">
                            <h6 class="card-title fw-black border-bottom border-dark d-inline-block pb-1 mb-3">
                                TASK 2:
                            </h6>

                            <div class="card-text text-secondary-emphasis">
                                <p>
                                    Your task is to budget of your assigned percentage of your money for supermarket
                                    expenses.
                                </p>

                                <div class="alert alert-info border-start border-info border-4 rounded mb-0 ">
                                    <p class="fw-bold d-flex align-items-center gap-2 mb-2">
                                        Rewards:
                                    </p>
                                    <p class="small mb-1">The Department Store level unlocked.</p>
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
                    <img class="selected-stall" :src="this.stallContent.image" alt="">
                    <div class="items-display position-absolute w-100 h-100" style="top: 0; left: 0;">
                        <div v-for="(item, index) in stallContent.items" :key="index" class="item-hotspot"
                            :data-index="index" @click="addToCartWithAnimation(item, $event)">
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
                            <img id="cart-target" src="/assets/supermarket/cart.png" alt="" style="width: 50%;">
                            <p class="mt-2 text-muted">Items in cart: <span class="fw-bold">{{ cartItemCount
                            }}</span></p>
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

export default {
    name: 'Supermarket',
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
            building: 'SuperMarket',
            stallContent: [],
            stalls: [{
                image: '/assets/supermarket/stall-1.png',
                position: 'bottom: 5%; left: 10%;z-index:1;',
                items: [
                    {
                        code: 11,
                        name: 'Juice Pack (6pcs)',
                        price: 220.00,
                        promo: 0,
                        question: 'A bottle of orange juice costs ₱220. The supermarket gives a <b> 20% discount<b>. What is the new price?',
                        answer: 176,
                        image: '/assets/supermarket/items/item-11.png'
                    },
                    {
                        code: 12,
                        name: 'Coffee Jar',
                        price: 250.00,
                        promo: 0,
                        image: '/assets/supermarket/items/item-12.png'
                    },
                    {
                        code: 13,
                        name: 'Sugar (1kg)',
                        price: 100.00,
                        promo: 0
                    },
                    {
                        code: 13,
                        name: 'Sugar (1kg)',
                        price: 100.00,
                        promo: 0
                    },
                    {
                        code: 14,
                        name: 'Egg (6pcs Tray)',
                        price: 90.00,
                        promo: 0
                    },
                    {
                        code: 14,
                        name: 'Egg (6pcs Tray)',
                        price: 90.00,
                        promo: 0
                    },
                ]
            },
            {
                image: '/assets/supermarket/stall-2.png',
                position: 'bottom: 5%; left: 35%;z-index:1;',
                items: [
                    {
                        code: 21,
                        name: 'Cooking Oil',
                        price: 120.00,
                        promo: 0
                    },
                    {
                        code: 22,
                        name: 'Corned Beef',
                        price: 300.00,
                        promo: 0
                    },
                    {
                        code: 22,
                        name: 'Corned Beef',
                        price: 300.00,
                        promo: 0
                    },
                    {
                        code: 23,
                        name: 'Canned Tuna',
                        price: 35.00,
                        promo: 0
                    },
                    {
                        code: 24,
                        name: 'Instant noodles',
                        price: 25.00,
                        promo: 0
                    },
                    {
                        code: 24,
                        name: 'Instant noodles',
                        price: 25.00,
                        promo: 0
                    },
                ]
            },
            {
                image: '/assets/supermarket/stall-3.png',
                position: 'bottom: 5%; left: 60%;z-index:1;',
                items: [
                    {
                        code: 31,
                        name: 'Fresh Milk',
                        price: 95.00,
                        promo: 0
                    },
                    {
                        code: 32,
                        name: 'Bearbrand Milk',
                        price: 335.00,
                        promo: 0
                    },
                    {
                        code: 33,
                        name: 'Nido Milk',
                        price: 500.00,
                        promo: 0
                    },
                    {
                        code: 34,
                        name: 'Pampers',
                        price: 400.00,
                        promo: 0
                    },
                    {
                        code: 35,
                        name: 'Tissue Roll',
                        price: 20.00,
                        promo: 0
                    },
                    {
                        code: 36,
                        name: 'Wet Wipes',
                        price: 30.00,
                        promo: 0
                    },
                ]
            },
            {
                image: '/assets/supermarket/stall-4.png',
                position: 'bottom: 20%; left: 20%;',
                items: [
                    {
                        code: 41,
                        name: 'Biscuit',
                        price: 40.00,
                        promo: 0
                    },
                    {
                        code: 41,
                        name: 'Biscuit',
                        price: 40.00,
                        promo: 0
                    },
                    {
                        code: 42,
                        name: 'Bread',
                        price: 70.00,
                        promo: 0
                    },
                    {
                        code: 42,
                        name: 'Bread',
                        price: 70.00,
                        promo: 0
                    },
                    {
                        code: 43,
                        name: 'Cereal',
                        price: 200.00,
                        promo: 0
                    },
                    {
                        code: 43,
                        name: 'Cereal',
                        price: 200.00,
                        promo: 0
                    }
                ]
            },
            {
                image: '/assets/supermarket/stall-5.png',
                position: 'bottom: 20%; left: 45%;',
                items: [
                    {
                        code: 51,
                        name: 'Colgate',
                        price: 70.00,
                        promo: 0
                    },
                    {
                        code: 52,
                        name: 'Shampoo (6pcs)',
                        price: 35.00,
                        promo: 0
                    },
                    {
                        code: 53,
                        name: 'Soap Bar',
                        price: 20.00,
                        promo: 0
                    },
                    {
                        code: 54,
                        name: 'Soap Box',
                        price: 50.00,
                        promo: 0
                    },
                    {
                        code: 55,
                        name: 'Surf Powder (2 kg)',
                        price: 220.00,
                        promo: 0
                    },
                    {
                        code: 56,
                        name: 'Surf Fabcon',
                        price: 280.00,
                        promo: 0
                    },
                ]
            }, {
                image: '/assets/supermarket/stall-6.png',
                position: 'bottom: 20%; left: 70%;',
                items: [
                    {
                        code: 61,
                        name: 'Jack’n Jill Chips',
                        price: 45.00,
                        promo: 0
                    },
                    {
                        code: 62,
                        name: 'Jack’n Jill Chips',
                        price: 45.00,
                        promo: 0
                    },
                    {
                        code: 63,
                        name: 'Jack’n Jill Chips',
                        price: 45.00,
                        promo: 0
                    },
                    {
                        code: 64,
                        name: 'Canned Chips',
                        price: 90.00,
                        promo: 0
                    },
                    {
                        code: 65,
                        name: 'Chocolate Bar',
                        price: 35.00,
                        promo: 0
                    },
                    {
                        code: 66,
                        name: 'Chocolate Candies (3pcs)',
                        price: 35.00,
                        promo: 0
                    }
                ]
            }],
            shoppingCart: [],
            showReceipt: false,
            message: null
        }
    },
    computed: {
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
        }
    },
    methods: {
        nextGame() {
            const coin = localStorage.getItem('coin')
            const totalCoin = coin - this.cartTotal
            localStorage.setItem('coin', totalCoin)
            let buildings = JSON.parse(localStorage.getItem('buildings') || '[]');
            const current = buildings.find(item => item.name === 'Supermarket');
            const next = buildings.find(item => item.name === 'Department Store');
            if (current) {
                current.isLocked = true;
                current.isDone = true;
                next.isLocked = false
            }
            localStorage.setItem('buildings', JSON.stringify(buildings));
            // Navigate to the next page after the last instruction
            this.$router.push('/map');
        },
        choiceStall(stall) {
            if (this.isReadTask) {
                this.showStalls = true
                this.stallContent = this.stalls[stall]
            } else {
                this.message = "Select the Cart"
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
            const budgetPlan = localStorage.getItem('budgetPlan')
            if (budgetPlan) {
                const plan = JSON.parse(budgetPlan);
                const budget = plan.find(item => item.name === 'Supermarket');
                const expectedBudget = localStorage.getItem('coin') * (budget.percent / 100)
                console.log(expectedBudget)
                if (this.cartTotal == expectedBudget) {
                    this.showCart = false; // 
                    this.showReceipt = true; // 
                } else {
                    this.showMessage('You have exceeded your grocery budget')

                }
            }

        },
        showMessage(text) {
            this.message = text;
            setTimeout(() => {
                this.message = null;
            }, 2000);
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
    background-image: url('/assets/supermarket/supermarket.png');
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
    width: 20%;
}

.cart {
    position: absolute;
    bottom: 10px;
    right: 20px;
    width: 20%;
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
    width: 58%;
}

/* --- ITEM HOTSPOT STYLING --- */
.items-display {
    /* This div overlays the stall image to define clickable areas */
    pointer-events: none;
    /* Allows clicks to pass through by default */
}

.item-hotspot {
    position: absolute;
    cursor: pointer;
    pointer-events: auto;
    /* Only the hotspots are clickable */
    background-color: rgba(255, 255, 255, 0.2);
    /* Invisible-ish clickable area */
    border-radius: 4px;
    transition: background-color 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
}

.item-hotspot:hover {
    background-color: rgba(255, 255, 255, 0.5);
}

/* Specific positioning for items on the PLACHOLDER stall image (adjust these based on your actual image!) */
.item-hotspot[data-index="0"] {
    top: 10%;
    left: 14%;
    width: 25%;
    height: 13%;
}

.item-hotspot[data-index="1"] {
    top: 22%;
    left: 14%;
    width: 25%;
    height: 13%;
}

.item-hotspot[data-index="2"] {
    top: 35%;
    left: 14%;
    width: 25%;
    height: 13%;
}

.item-hotspot[data-index="3"] {
    top: 48%;
    left: 14%;
    width: 25%;
    height: 13%;
}

.item-hotspot[data-index="4"] {
    top: 58%;
    left: 14%;
    width: 25%;
    height: 13%;
}

.item-hotspot[data-index="5"] {
    top: 74%;
    left: 14%;
    width: 25%;
    height: 13%;
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
}

.cash-receipt-container {
    width: 380px;
    /* Fixed width */
    max-height: 90vh;
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
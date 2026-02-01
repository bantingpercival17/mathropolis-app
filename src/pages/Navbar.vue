<template>
    <header class="app-header">
        <button class="image-button" aria-label="Menu Button">
            <!-- <template v-if="isMap">
                <div class="button-icon text-center me-4">
                    <img class="button-icon" src="/assets/map.png" alt="" @click="$router.push('/map')">
                    <p class="icon-text-badge">MAP</p>
                </div>
                <div v-if="tools?.House" class="button-icon text-center">
                    <img class="button-icon" src="/assets/tools/formula.png" alt="" @click="showFormula = true">
                    <p style="font-size: x-small; background-color: white;border-radius: 10%; font-weight: 900;">
                        FORMULAS
                    </p>
                </div>
                <div v-if="tools?.Bank" class="button-icon ms-4">
                    <img class="button-icon" src="/assets/tools/budget-planning.png" alt="" @click="showBudget = true">
                    <p style="font-size: x-small;background-color: white;border-radius: 10%; font-weight: 900;">BUDGET
                        PLAN
                    </p>
                </div>
            </template> -->
            <div v-if="!isMap" class="button-icon text-center me-4">
                <img class="button-icon" src="/assets/user.png" alt="" @click="showProfile = true">
                <p class=" icon-text-badge">PROFILE</p>
            </div>

        </button>

        <div class="coin-bg">

            <span style="font-size: 16px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">₱
                {{ coins }}
            </span>
        </div>
        <div v-if="isMap" class="button-tools text-center ">
            <img class="button-icon" src="/assets/user.png" alt="" @click="showTools = true">
            <p class=" icon-text-badge">HINTS</p>
        </div>
        <label for="" class="budget-style">{{ budget }}</label>
        <span class="">


            <!--  <div class="progress-container">
                <div class="star-coin"></div>
                <div class="progress-bar-background">
                    <span class="rank-text">₱ {{ coin }}</span>
                </div>
                <label for="" class="budget-style">{{ budget }}</label>
            </div> -->
        </span>
    </header>
    <Profile v-if="showProfile" @close="handleChildClose" @reset="$emit('reset')" :userTools="tools" />
    <Budget v-if="showBudget" @close="handleChildClose" />
    <Formulas v-if="showFormula" @close="handleChildClose" />
    <div v-if="showTools" class="modal-content-tools">
        <div class="d-flex flex-column align-items-center p-4">
            <div class="container-tools">
                <div class="d-flex  align-items-center text-center">
                    <div class="button-icon text-center me-4">
                        <img class="button-icon" src="/assets/map.png" alt="" @click="$router.push('/map')">
                        <p class="icon-text-badge">MAP</p>
                    </div>
                    <div v-if="tools?.House" class="button-icon text-center">
                        <img class="button-icon" src="/assets/tools/formula.png" alt="" @click="showFormulas">
                        <p style="font-size: x-small; background-color: white;border-radius: 10%; font-weight: 900;">
                            FORMULAS
                        </p>
                    </div>
                    <div v-if="tools?.Bank" class="button-icon ms-4">
                        <img class="button-icon" src="/assets/tools/budget-planning.png" alt="" @click="showBudgetPlan">
                        <p style="font-size: x-small;background-color: white;border-radius: 10%; font-weight: 900;">
                            BUDGET
                            PLAN
                        </p>
                    </div>
                </div>
                <button class="btn btn-outline-danger w-100 mb-2" @click="showTools = false">CANCEL</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import Formulas from './tools/Formulas.vue';
import Budget from './tools/Budget.vue';
import Profile from './tools/Profile.vue';

export default {
    name: 'Navbar',
    data() {
        return {
            budget: '',
            showFormula: false,
            showBudget: false,
            showProfile: false,
            iconFormulaShow: false,
            iconBudgetShow: false,
            isMap: false,
            showTools: false
        }
    },
    emits: ['close', 'reset'],
    components: {
        Formulas, Budget, Profile
    },
    props: {
        budgetName: String,
        store: {
            default: false,
            type: Boolean
        },
        tools: Object,
        coins: Number
    },
    mounted() {
        const budgetPlan = localStorage.getItem('budgetPlan')
        if (budgetPlan) {
            const plan = JSON.parse(budgetPlan);
            const budget = plan.find(item => item.name === this.budgetName);
            if (budget) {
                this.budget = budget.percent + "% of " + 5000;
            }
        }
        // Check Mapp
        const route = useRoute();
        if (route.name !== 'Map') {
            this.isMap = true
        }
    },
    methods: {
        handleChildClose() {
            this.showFormula = false
            this.showBudget = false
            this.showProfile = false
        },
        showFormulas() {
            this.showFormula = true
            this.showTools = false
        },
        showBudgetPlan() {
            this.showBudget = true
            this.showTools = false
        }
    }
};
</script>
<style>
.storefront-container {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    width: fit-content;

}

/* --- Storefront Image Placeholder --- */
.storefront-graphic {
    /* Placeholder for the cartoon image area */
    min-height: 550px;
    min-width: 550px;
    /* Height of the store */
    background-color: #e5a452;
    /* Main building color (Orange/Yellow) */
    border: 1px solid #c28843;
    border-radius: 4px;
    position: relative;
    margin-right: 15px;
    /* Space between store and sign */
    overflow: hidden;
    /* Keep internal elements inside */
}

/* Simplified details for the storefront */
.storefront-graphic::before {
    content: 'STORE';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: #c0392b;
    /* Red awning */
    color: white;
    font-size: 8px;
    font-weight: bold;
    text-align: center;
    padding: 2px 0;
    border-bottom: 2px solid white;
}

.storefront-graphic .window {
    /* Simple window simulation */
    position: absolute;
    top: 15px;
    left: 5px;
    width: 15px;
    height: 30px;
    background-color: #9bd7f3;
    /* Light blue window */
}

.storefront-graphic .door {
    /* Simple door simulation */
    position: absolute;
    top: 15px;
    right: 5px;
    width: 15px;
    height: 30px;
    background-color: #7b4f3b;
    /* Dark brown door */
}

.storefront-graphic .grass {
    /* Small green patch */
    width: 15px;
    height: 10px;
    background-color: #70ad47;
    border-radius: 50% / 100% 100% 0 0;
    position: absolute;
    bottom: 0;
    left: 10px;
}


/* --- Calculation Sign Styling --- */
.calculation-sign {
    /* The white box with the text */
    background-color: white;
    padding: 10px 20px;
    border-radius: 3px;
    border: 4px solid #f9c948;
    /* Yellow border */
    line-height: 1;
    /* Ensure text is vertically centered */
}

.calculation-text {
    /* The actual text */
    font-size: 16px;
    font-weight: 900;
    color: black;
    margin: 0;
}

.progress-container {
    /* Simulates the overall scene background */
    display: flex;
    align-items: center;
    padding: 0px;
    /* Optional: Add a subtle city background */

    border-radius: 5px;
    position: relative;
    /* Needed to position the inner elements */
    overflow: hidden;
    /* Ensures elements don't spill out */
    min-height: 100px;
    min-width: 25-.0px;
    /* Give it some vertical space */
}

/* --- Yellow Progress/Banner Bar Styling --- */
.progress-bar-background {
    /* The main yellow rectangular area */
    background-color: #ffcd35;
    /* Bright yellow */
    height: 60px;
    width: 200px;
    border: 3px solid #ffffff;
    border-radius: 5px;
    padding-left: 50px;
    right: 5%;
    /* Make space for the overlapping coin */
    position: absolute;
    z-index: 1;
    /* Keep it below the coin visually */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* --- Overlapping Gold Coin/Badge Styling --- */
.star-coin {
    /* The circular gold element */
    width: 90px;
    height: 90px;
    background-color: #ffaf07;
    /* Gold gradient */
    border-radius: 50%;
    border: 3px solid #ffffff;
    /* Darker gold border */
    position: absolute;
    /* Position it to overlap the progress bar */
    z-index: 2;
    /* Ensure it overlaps the progress bar */
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Star inside the coin (using text/emoji for simplicity) */
.star-coin::before {
    content: '★';
    /* Unicode Star character */
    color: #ffe14d;
    font-size: 65px;
    line-height: -5;
}

/* --- Text Content Styling --- */
.rank-text {
    /* Text to display on the banner */
    color: black;
    font-size: 32px;
    font-weight: bold;
    /* Same as bar height for vertical alignment */
    padding-left: 5px;
    /* Small space after where the coin would end */
}

.budget-style {
    position: absolute;
    right: 50px;
    bottom: 50px;
    font-size: 12px;
    font-weight: bold;
    color: #ffffff;
    background-color: #70ad47;
    padding: 5px;
    border-radius: 5px;
}

.button-tools {
    position: absolute;
    right: 22%;
    top: 5px;
    font-size: 12px;
    font-weight: bold;
    padding: 5px;
    border-radius: 5px;
    z-index: 10;
}

.tool-image {
    width: 15%;
}

.app-header {
    width: 100%;
    display: flex;
    /* Use Flexbox for alignment */
    justify-content: space-between;
    /* Pushes content to the far left and right */
    align-items: center;
    /* Vertically centers the items */
    position: absolute;
    padding: 60px 30px;
    margin: 0;
    /* Padding inside the header */
    height: 50px;
    /* Fixed height for the header */
    z-index: 1;
}

/* 2. Style for the image button */
.image-button {
    border: none;
    /* Remove default button border */
    background: none;
    /* Remove default button background */
    padding: 0;
    /* Remove default padding */
    cursor: pointer;
    /* Change cursor to indicate it's clickable */
    display: flex;
    /* Helps center the image */
    align-items: center;
    text-align: center;

}

.button-icon {
    max-width: 40px;
    /* Size of the image/icon */
    background-size: cover;
    text-align: center;
    /* Placeholder styles - replace with your actual image/icon */
    border-radius: 5px;
    /* Optional: To make it look like a menu icon if you use a real image */
    /* e.g., content: url('path/to/menu-icon.png'); */
}

/* 3. Style for the label/text on the right */
.header-label {
    margin-left: 40%;
    font-size: 1.5em;
    /* Larger font size */
    font-weight: bold;
    color: #ffd700;
    /* A golden color for "Coin Label" */
}

.icon-text-badge {
    font-size: x-small;
    background-color: white;
    border-radius: 10%;
    font-weight: 900;
}

.modal-content-tools {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100vh;
    z-index: 2;
}

.container-tools {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    /* Slightly transparent white */
    padding: 10px 20px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-width: 400px;
    width: 90%;
    border: 3px solid #66bb6a;
    /* Green border like the logo */
}
</style>
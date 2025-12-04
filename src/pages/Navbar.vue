<template>
    <header class="app-header">
        <button class="image-button" aria-label="Menu Button">
            <div v-if="isMap" class="button-icon text-center me-4">
                <img class="button-icon" src="/assets/map.png" alt="" @click="$router.push('/map')">
                <p style="font-size: x-small;">MAP</p>
            </div>
            <div v-if="iconFormulaShow" class="button-icon text-center">
                <img class="button-icon" src="/assets/tools/formula.png" alt="" @click="showFormula = true">
                <p style="font-size: x-small;">FORMULAS</p>
            </div>
            <div v-if="iconBudgetShow" class="button-icon ms-4">
                <img class="button-icon" src="/assets/tools/budget-planning.png" alt="" @click="showBudget = true">
                <p style="font-size: x-small;">BUDGET PLAN</p>
            </div>
        </button>


        <span class="header-label">
            <!-- <div v-if="store" class="storefront-container">
                <div class="calculation-sign">
                    <p class="calculation-text">{{ budget }}</p>
                </div>
            </div> -->
            <div class="progress-container">
                <div class="star-coin"></div>
                <div class="progress-bar-background">
                    <span class="rank-text">₱ {{ coin }}</span>
                </div>
                <label for="" class="budget-style">{{ budget }}</label>
            </div>
        </span>
    </header>
    <!-- <header class="kids-header">
        <div class="header-content">
            <div class="header-icons">
                <div class="icon-item clickable-button" id="budget-instructions-btn">
                    <img class="emoji-icon" src="/assets/tools/formula.png" alt="" @click="showFormula = true">
                    <p>FORMULAS</p>
                </div>
                <div class="icon-item clickable-button" id="formula-logic-btn">
                    <img class="emoji-icon" src="/assets/tools/budget-planning.png" alt="">
                    <p>BUDGET PLAN</p>
                </div>
            </div>
            <div class="score-display float-end">
               
            </div>
        </div>
    </header> -->
    <Budget v-if="showBudget" @close="handleChildClose" />
    <Formulas v-if="showFormula" @close="handleChildClose" />

</template>

<script>
import { useRoute } from 'vue-router';
import Formulas from './tools/Formulas.vue';
import Budget from './tools/Budget.vue';

export default {
    name: 'Navbar',
    data() {
        return {
            coin: 0,
            budget: '',
            showFormula: false,
            showBudget: false,
            iconFormulaShow: false,
            iconBudgetShow: false,
            isMap: false,
        }
    },
    emits: ['close'],
    components: {
        Formulas, Budget
    },
    props: {
        budgetName: String,
        store: {
            default: false,
            type: Boolean
        }
    },
    mounted() {
        this.coin = localStorage.getItem('coin')
        const budgetPlan = localStorage.getItem('budgetPlan')
        if (budgetPlan) {
            const plan = JSON.parse(budgetPlan);
            const budget = plan.find(item => item.name === this.budgetName);
            console.log(budget)
            if (budget) {
                this.budget = budget.percent + "% of " + this.coin;
            }
        }

        const buildings = JSON.parse(localStorage.getItem('buildings'));
        if (buildings) {
            console.log(buildings)
            const home = buildings.find(build => build.name === 'House')
            console.log(home)
            if (home.isDone) {
                this.iconFormulaShow = true
            }
            const budget = buildings.find(build => build.name === 'Bank')
            if (budget.isDone) {
                this.iconBudgetShow = true
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
    min-height: 150px;
    min-width: 250px;
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
    bottom: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
    background-color: #70ad47;
    padding: 5px;
    border-radius: 5px;
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
    /* Padding inside the header */
    height: 50px;
    /* Fixed height for the header */
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
    max-width: 70%;
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
</style>
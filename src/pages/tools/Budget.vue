<template>
    <div class="left-content">
        <div class="d-flex flex-column align-items-center p-4">
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
                                <span class="fw-bold fs-6 ms-1 me-1 text-center">
                                    {{ cat.percent }}
                                </span>
                                <span class="fw-bold fs-5">%</span>
                            </div>
                        </div>
                    </div>
                    <!-- Total & Save -->
                    <div class="border-top border-dark ">
                        <div class="d-flex justify-content-between align-items-center ">
                            <span class="fs-6 fw-black text-uppercase">Total</span>
                            <span class="fs-6 fw-black" :class="totalPercent === 100 ? 'text-success' : 'text-danger'">
                                {{ totalPercent }}%
                            </span>
                        </div>
                    </div>
                    <div class="d-flex flex-column align-items-center ">

                        <button @click="$emit('close')"
                            class="btn btn-danger fx-6 btn-sm rounded-pill fw-black  shadow border-bottom border-danger border-4 d-flex align-items-center gap-2">
                            CLOSE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    name: 'Budget',
    data() {
        return {
            categories: [],
            totalPercent: 100
        }
    },
    mounted() {
        const savedBudget = localStorage.getItem('budgetPlan');
        if (savedBudget) {
            const parsedBudget = JSON.parse(savedBudget);
            this.categories = parsedBudget;
        }
    }
}
</script>
<style scoped>
.left-content {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100vh;
    z-index: 100;
}

/* Clipboard Styles */
.clipboard-clip {
    width: 8rem;
    height: 3rem;
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
    width: 1.5rem;
    height: 1.5rem;
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
    min-height: 500px;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    border-radius: 0.75rem;
    position: relative;
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
@media (max-width:600px) {
    .clipboard-board {
        padding: 1rem;
        max-width: 100%;
        font-size: x-large;
    }

    .paper {
        min-width: 300px;
        min-height: 500px;
    }

    .clipboard-clip {
        width: 10rem;
        height: 3.5rem;
    }

    .clipboard-hole {
        width: 2rem;
        height: 2rem;
    }

}
</style>
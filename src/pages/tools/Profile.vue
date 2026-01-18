<template>
    <div class="left-content">
        <div class="d-flex flex-column align-items-center p-4">
            <div class="container">

                <h3 for="">Hello {{ userName }}!</h3>
                <div class="d-flex  align-items-center text-center">
                    <div v-if="userTools?.House" class="button-icon text-center">
                        <img class="button-icon" src="/assets/tools/formula.png" alt="" @click="showFormula = true">
                        <p style="font-size: x-small; background-color: white;border-radius: 10%; font-weight: 900;">
                            FORMULAS
                        </p>
                    </div>
                    <div v-if="userTools?.Bank" class="button-icon ms-4">
                        <img class="button-icon" src="/assets/tools/budget-planning.png" alt=""
                            @click="showBudget = true">
                        <p style="font-size: x-small;background-color: white;border-radius: 10%; font-weight: 900;">
                            BUDGET
                            PLAN
                        </p>
                    </div>
                </div>
                <button class="btn btn-primary w-100 mb-2" @click="resetGame">RESTART THE GAME</button>
                <button class="btn btn-danger w-100  mb-2" @click="logout">LOGOUT</button>
                <button class="btn btn-outline-danger w-100 mb-2" @click="$emit('close')">CANCEL</button>
            </div>
        </div>
    </div>

</template>
<script>
import Formulas from './Formulas.vue';
import Budget from './Budget.vue';
export default {
    name: 'Profile',
    data() {
        return {
            showFormula: false,
            showBudget: false,
            showProfile: false,
            iconFormulaShow: false,
            iconBudgetShow: false,
        }
    },
    components: {
        Formulas, Budget
    },
    props: {
        userTools: {
            type: Object,
        }
    },
    computed: {
        userName() {
            const account = JSON.parse(localStorage.getItem('account'));
            return account?.user?.name
        }
    },
    mounted() {
        console.log(this.userTools)
    },
    methods: {
        logout() {
            localStorage.clear()
            window.location.reload()
        },
        resetGame() {
            this.$emit('close')
            this.$emit('reset')
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

.container {
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
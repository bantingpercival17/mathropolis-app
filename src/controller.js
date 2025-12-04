import axios from "axios";

const categories = [
    { id: 1, name: 'Supermarket', percent: 50 },
    { id: 2, name: 'Department Store', percent: 10 },
    { id: 3, name: 'Restaurant', percent: 20 },
    { id: 4, name: 'Online Subscription', percent: 10 },
    { id: 5, name: 'Leisure', percent: 10 },
]
const buildings = [
    {
        name: "Bank",
        route: "/building/bank",
        style: "bottom: 40%; left: 7%; width: 15%; height: 20%;",
        isLocked: true,
        isDone: null
    },
    {
        name: "Supermarket",
        route: "building/supermarket",
        style: "top: 14%; left: 23%; width: 15%; height: 20%;",
        isLocked: true,
        isDone: null,
    },
    {
        name: "Restaurant",
        route: "building/fastfood",
        style: "top: 15%; left: 56%; width: 15%; height: 20%;",
        isLocked: true,
        isDone: null
    },
    {
        name: "Subscription",
        route: "/building/online-subscription",
        style: "top: 45%; right: 13%; width: 15%; height: 20%;",
        isLocked: true,
        isDone: null
    },
    {
        name: "House",
        route: "building/house",
        style: "bottom: 35%; left: 40%; width: 15%; height: 20%;",
        isLocked: false,
        isDone: null
    },
    {
        name: "Department Store",
        route: "/building/department-store",
        style: "bottom: 2%; left: 23%; width: 15%; height: 20%;",
        isLocked: true,
        isDone: null
    },
    {
        name: "Amusement",
        route: "/building/amusement",
        style: "bottom: 3%; right: 9%; width: 15%; height: 20%;",
        isLocked: true,
        isDone: null
    },
]
export async function fetchGameProgress() {
    try {
        const data = await axios.get('/student/progress', {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('account') || '{}').token}`,
            },
        }).then((response) => {
            const progressData = response.data.progress;
            localStorage.setItem('budgetPlan', (progressData.budget_plan) || JSON.stringify(categories));
            localStorage.setItem('buildings', (progressData.progress_data) || JSON.stringify(buildings));
            localStorage.setItem('coin', progressData.coins || '0');

        }).catch((error) => {
            console.error('Error fetching progress:', error);
        });
    } catch (error) {
        console.error('Error fetching game progress:', error);
    }
}
export async function storeGameProgress() {

    // Placeholder for storing game progress logic
    const formData = new FormData();
    formData.append('coins', localStorage.getItem('coin') || 0);
    formData.append('budget_plan', localStorage.getItem('budgetPlan') || null);
    formData.append('progress_data', localStorage.getItem('buildings') || JSON.stringify(categories));
    try {
        axios.post('/student/update-progress', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('account') || '{}').token}`,
            },
        }).then((response) => {
            console.log('Game progress updated successfully:', response.data);
        }).catch((error) => {
            console.error('Error updating progress:', error);
        });

    } catch (error) {
        console.error('Error storing game progress:', error);
    }
}
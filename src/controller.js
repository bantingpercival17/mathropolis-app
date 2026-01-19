import axios from "axios";
import { DEFAULT_BUILDINGS, DEFAULT_CATEGORIES } from "./store/gameData";
export async function fetchGameProgress() {
    try {
        const data = await axios.get('/student/progress', {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('account') || '{}').token}`,
            },
        }).then((response) => {
            const progressData = response.data.progress;
            if (progressData) {
                localStorage.setItem('budgetPlan', (progressData.budget_plan) || JSON.stringify(DEFAULT_CATEGORIES));
                localStorage.setItem('buildings', (progressData.progress_data) || JSON.stringify(DEFAULT_BUILDINGS));
                localStorage.setItem('coin', progressData.coins || '0');
            } else {
                localStorage.setItem('budgetPlan', JSON.stringify(DEFAULT_CATEGORIES));
                localStorage.setItem('buildings', JSON.stringify(DEFAULT_BUILDINGS));
                localStorage.setItem('coin', 0);
            }


        }).catch((error) => {
            if (error.status == 401) {
                localStorage.clear()
            }
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
    formData.append('progress_data', localStorage.getItem('buildings') || JSON.stringify(DEFAULT_CATEGORIES));
    try {
        axios.post('/student/update-progress', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('account') || '{}').token}`,
            },
        }).then((response) => {
            console.log('Game progress updated successfully:', response.data);
        }).catch((error) => {
            if (error.status == 401) {
                localStorage.clear()
            }
            console.error('Error updating progress:', error);
        });

    } catch (error) {
        console.log(error.status)
        console.error('Error storing game progress:', error);
    }
}
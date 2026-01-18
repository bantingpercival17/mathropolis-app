const BUILDINGS_KEY = 'buildings';
const COIN_KEY = 'coin';

/**
 * Get buildings from storage or initialize defaults
 */
export function getBuildings(defaultBuildings = []) {
    const stored = localStorage.getItem(BUILDINGS_KEY);
    if (stored) return JSON.parse(stored);

    localStorage.setItem(BUILDINGS_KEY, JSON.stringify(defaultBuildings));
    return [...defaultBuildings];
}

/**
 * Save buildings to storage
 */
export function saveBuildings(buildings) {
    localStorage.setItem(BUILDINGS_KEY, JSON.stringify(buildings));
}

/**
 * Update player coins safely
 */
export function updateCoins(cost = 0) {
    const coin = Number(localStorage.getItem(COIN_KEY)) || 0;
    const newCoin = Math.max(coin - cost, 0);
    localStorage.setItem(COIN_KEY, newCoin);
    return newCoin;
}

/**
 * Complete a building and unlock the next one
 */
/**
 * Lock a completed building and unlock a specific next building
 * @param {string} currentRoute - route of the completed building
 * @param {string|null} unlockRoute - route of the building to unlock next
 */
export function completeBuilding(currentRoute, unlockRoute = null) {
    const buildings = JSON.parse(localStorage.getItem(BUILDINGS_KEY)) || [];

    // Lock & complete current building
    const current = buildings.find(b => b.route === currentRoute);
    if (current) {
        current.isDone = true;
        current.isLocked = true;
    }

    // Unlock selected next building
    if (unlockRoute) {
        const next = buildings.find(b => b.route === unlockRoute);
        if (next) {
            next.isLocked = false;
        }
    }

    localStorage.setItem(BUILDINGS_KEY, JSON.stringify(buildings));
    return buildings;
}

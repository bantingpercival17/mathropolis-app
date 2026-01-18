export const DEFAULT_CATEGORIES = [
    { id: 1, name: 'Supermarket', percent: 50, amount: 2500 },
    { id: 2, name: 'Department Store', percent: 10, amount: 500 },
    { id: 3, name: 'FastFood', percent: 20, amount: 1000 },
    { id: 4, name: 'Online Subscription', percent: 10, amount: 500 },
    { id: 5, name: 'Amusement', percent: 10, amount: 500 },
]

export const DEFAULT_BUILDINGS = [
    {
        name: "Bank",
        route: "/building/bank",
        style: "bottom: 40%; left: 7%; width: 15%; height: 20%;",
        isLocked: true,
        isDone: null
    },
    {
        name: "Supermarket",
        route: "/building/supermarket",
        style: "top: 14%; left: 23%; width: 15%; height: 20%; z-index:10;",
        isLocked: true,
        isDone: null
    },
    {
        name: "Restaurant",
        route: "/building/fastfood",
        style: "top: 15%; left: 56%; width: 15%; height: 20%; z-index:10",
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
        route: "/building/house",
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
    }
];
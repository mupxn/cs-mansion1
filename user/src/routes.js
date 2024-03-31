import HomePage from "./pages/HomePage.vue"
import Bill from "./pages/Bill.vue"
import Info from "./pages/Info.vue"
import PageNotFound from "./pages/PageNotFound.vue"
import Login from "./pages/Login.vue"
import authenticate from "./module/authenticate"
export const routes = [{
        path: '/',
        component: HomePage,
        beforeEnter: async() => {
            const isAuthenticated = await authenticate();
            if (!isAuthenticated) return '/login';
        },
    },
    {
        path: '/bill',
        component: Bill,
        beforeEnter: async() => {
            const isAuthenticated = await authenticate();
            if (!isAuthenticated) return '/login';
        },
    },
    {
        path: '/info',
        component: Info,
        beforeEnter: async() => {
            const isAuthenticated = await authenticate();
            if (!isAuthenticated) return '/login';
        },
    },
    {
        path: '/login',
        component: Login,
        beforeEnter: async() => {
            const isAuthenticated = await authenticate();
            if (isAuthenticated) return '/';
        },
    },
    {
        path: '/:pathMatch(.*)*',
        component: PageNotFound
    }
]

export default routes;
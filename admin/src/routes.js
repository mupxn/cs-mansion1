import HomePage from "./pages/HomePage.vue"
import Bill from "./pages/Bill.vue"
import WaitingBill from "./pages/WaitingBill.vue"
import Room from "./pages/Room.vue"
import User from "./pages/User.vue"
import CreateBill from "./pages/CreateBill.vue"
import RentedHistory from "./pages/RentedHistory.vue"
import PageNotFound from "./pages/PageNotFound.vue"
import Detail from "./pages/Detail.vue"
import Login from "./pages/Login.vue"
import authenticate from "./module/authenticate"
export const routes = [
    {
        path: '/login', component: Login,
        beforeEnter: async () => {
            const isAuthenticated = await authenticate();
            if( isAuthenticated ) return '/';
        },
    },
    {
        path: '/', component: HomePage,
        beforeEnter: async () => {
            const isAuthenticated = await authenticate();
            if( !isAuthenticated ) return '/login';
        },
    },
    {
        path: '/bill', component: Bill,
        beforeEnter: async () => {
            const isAuthenticated = await authenticate();
            if( !isAuthenticated ) return '/login';
        },
    },
    {
        path: '/waitingbill', component: WaitingBill,
        beforeEnter: async () => {
            const isAuthenticated = await authenticate();
            if( !isAuthenticated ) return '/login';
        },
    },
    {
        path: '/room', component: Room,
        beforeEnter: async () => {
            const isAuthenticated = await authenticate();
            if( !isAuthenticated ) return '/login';
        },
    },
    {
        path: '/user', component: User,
        beforeEnter: async () => {
            const isAuthenticated = await authenticate();
            if( !isAuthenticated ) return '/login';
        },
    },
    {
        path: '/create-bill', component: CreateBill,
        beforeEnter: async () => {
            const isAuthenticated = await authenticate();
            if( !isAuthenticated ) return '/login';
        },
    },
    {
        path: '/rented-history', component: RentedHistory,
        beforeEnter: async () => {
            const isAuthenticated = await authenticate();
            if( !isAuthenticated ) return '/login';
        },
    },
    {
        path: '/detail', component: Detail,
        beforeEnter: async () => {
            const isAuthenticated = await authenticate();
            if( !isAuthenticated ) return '/login';
        },
    },
    { 
        path: '/:pathMatch(.*)*', component: PageNotFound 
    }
]

export default routes;
import Vue from "vue";
import VueRouter from "vue-router";
import EmployeeRegistration from "../EmployeeRegistration.vue";
import ConfirmRegistration from "../ConfirmRegistration.vue";
import RaffleDraw from "../RaffleDraw.vue";
import Dashboard from "../Dashboard.vue";


Vue.use(VueRouter);

const routes = [

    {
        path: '/register',
        name: 'EmployeeRegistration',
        component: EmployeeRegistration,
    },
    {
        path: '/confirmation',
        name: 'ConfirmRegistration',
        component: ConfirmRegistration,
    },
    {
        path: '/raffle',
        name: 'RaffleDraw',
        component: RaffleDraw,
    },
    {
        path: '/INGCOdashboard',
        name: 'Dashboard',
        component: Dashboard,
    },
];

const router = new VueRouter({
    routes
});

export default router;

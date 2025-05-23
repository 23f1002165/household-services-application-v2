import LoginPage from "../pages/LoginPage.js";
import CustomerRegisterPage from "../pages/CustomerRegisterPage.js";
import ProfessionalRegisterPage from "../pages/ProfessionalRegisterPage.js";
import AboutPage from "../pages/AboutPage.js";
import OtherServicesPage from "../pages/OtherServicesPage.js";
import CustomerPage from "../pages/CustomerPage.js";
import ProfessionalPage from "../pages/ProfessionalPage.js";
import MyBookingsPage from "../pages/MyBookingsPage.js";
import RecentlyBookedPage from "../pages/RecentlyBookedPage.js";
import ServivceHistoryPage from "../pages/ServiceHistoryPage.js";
import AddServicePage from "../pages/AddServicePage.js";
import AdminPage from "../pages/AdminPage.js";
import CSVPage from "../pages/CSVPage.js";
import HomePage from "../pages/HomePage.js";
import ServicePage from "../pages/ServicePage.js";
import EditServicePage from "../pages/EditServicePage.js";
import ProfessionalProfilePage from "../pages/ProfessionalProfilePage.js";
import CustomerProfilePage from "../pages/CustomerProfilePage.js";


const routes = [
    {path : '/', component : HomePage},
    {path : '/login', component : LoginPage},
    {path : '/register', component : CustomerRegisterPage},
    {path : '/professional/register', component : ProfessionalRegisterPage},
    {path : '/about', component : AboutPage},
    {path : '/other_services', component : OtherServicesPage, meta : {requiresLogin : true, role : "Customer"}},
    {path : '/Customer', component : CustomerPage, meta : {requiresLogin : true, role : "Customer"}},
    {path : '/Customer/bookings', component : MyBookingsPage, meta : {requiresLogin : true, role : "Customer"}},
    {path : '/Professional', component : ProfessionalPage, meta : {requiresLogin : true, role : "Professional"}},
    {path : '/Professional/history', component : ServivceHistoryPage, meta : {requiresLogin : true, role : "Professional"}},
    {path : '/Admin', component : AdminPage, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/Admin/report', component : CSVPage, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/Admin/add_service', component : AddServicePage, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/edit_service/:name', component : EditServicePage, props : true, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/professional_profile/:professional_id', component : ProfessionalProfilePage, props : true, meta : {requiresLogin : true, role : ["Admin", "Professional"]}},
    {path : '/profile/:id', component : CustomerProfilePage, props : true, meta : {requiresLogin : true, role : ["Admin", "Customer"]}},
    {path : '/service/:name', component : ServicePage, props : true, meta : {requiresLogin : true, role : "Customer"}},
    {path : '/mybookings/:name', component : RecentlyBookedPage, props : true, meta : {requiresLogin : true, role : "Customer"}},
]

import store from './store.js'

const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 };
    }
})

router.beforeEach((to, from, next) => {
    const userRole = store.state.role;
    if (to.matched.some((record) => record.meta.requiresLogin)){
        if (!store.state.loggedIn){
            next({path : '/login'})
        } else if (to.meta.role && to.meta.role != store.state.role && !to.meta.role.includes(userRole)){
            alert('Access denied for this role.')
            next({path : '/'})
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
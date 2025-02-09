const Home = {
    template : `<h1> this is home </h1>`
}
import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import CustomerPage from "../pages/CustomerPage.js";
import AddServicePage from "../pages/AddServicePage.js";
import AdminPage from "../pages/AdminPage.js";
import HomePage from "../pages/HomePage.js";
import ServicePage from "../pages/ServicePage.js";

const routes = [
    {path : '/', component : HomePage},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/Customer', component : CustomerPage, meta : {requiresLogin : true}},
    {path : '/Admin', component : AdminPage, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/Admin/add_service', component : AddServicePage, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/service/:name', component : ServicePage, props : true, meta : {requiresLogin : true}},
]

import store from './store.js'

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)){
        if (!store.state.loggedIn){
            next({path : '/login'})
        } else if (to.meta.role && to.meta.role != store.state.role){
            alert('role not authorized')
            next({path : '/'})
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
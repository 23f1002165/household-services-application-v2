const Home = {
    template : `<h1> this is home </h1>`
}
import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import AdminPage from "../pages/AdminPage.js";
import ServicePage from "../pages/ServicePage.js";

const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/home', component : AdminPage},
    {path : '/service/:name', component : ServicePage, props : true},
]

const router = new VueRouter({
    routes
})

export default router;
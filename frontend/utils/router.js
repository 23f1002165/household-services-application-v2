const Home = {
    template : `<h1> this is home </h1>`
}
import LoginPage from "../pages/LoginPage.js";

const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
    {path : '/register', component : Home}
]

const router = new VueRouter({
    routes
})

export default router;
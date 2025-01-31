const Home = {
    template : `<h1> Home </h1>`
}
import Login from "../components/Login.js";
const routes = [
    {path : '/', component : Home},
    {path : '/login', component : Login},
    {path : '/register', component : Register}
]

const router = new VueRouter({
    routes
})
export default router;
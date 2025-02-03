export default {
    template : `
    <div>
        <router-link to='/'>Home</router-link>
        <router-link v-if="!$store.state.loggedIn" to='/login'>Login</router-link>
        <router-link v-if="!$store.state.loggedIn" to='/register'>Register</router-link>

        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/Admin'>Dashboard</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to='/Customer'>Dashboard</router-link>
        
        <button class="btn btn-secondary" v-if="$store.state.loggedIn" @click="$store.commit('logout')">Logout</button>
    </div>
    `
}
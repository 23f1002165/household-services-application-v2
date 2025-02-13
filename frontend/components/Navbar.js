export default {
    template : `
        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm" style="padding: 20px 20px;">
            <div class="container-fluid">
                <a class="navbar-brand align-items-center" href="/">
                    <span style="font-size: 18px; background: black; color: white; padding: 5px 5px; border-radius: 5px;" class="bg-black text-white rounded">A to Z</span>
                    <span class="fw-bold" style="font-weight: 550;">Household Services</span>
                </a>
    
                <div>
                    <router-link v-if="!$store.state.loggedIn" to="/login" style="text-decoration: none; color: black; padding: 8px 16px;">Login</router-link>
                    <!-- Admin Links -->
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to="/Admin" style="text-decoration: none; color: black; padding: 8px 16px;">Dashboard</router-link>
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to="/Admin/add_service" style="text-decoration: none; color: black; padding: 8px 16px;">Services</router-link>
                    <!-- Customer Dashboard -->
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to="/Customer" style="text-decoration: none; color: black; padding: 8px 16px;">Dashboard</router-link>
                    <!-- Logout Button -->
                    <button class="btn btn-dark" v-if="$store.state.loggedIn" @click="$store.commit('logout')">Logout</button>
                </div>
            </div>
        </nav>
 
    
        <div>
            <router-link to='/'>Home</router-link>
            <router-link v-if="!$store.state.loggedIn" to='/login'>Login</router-link>
            <router-link v-if="!$store.state.loggedIn" to='/register'>Register</router-link>

            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/Admin'>Dashboard</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/Admin/add_service'>Service</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to='/Customer'>Dashboard</router-link>
            
            <button class="btn btn-primary" v-if="$store.state.loggedIn" @click="$store.commit('logout')">Logout</button>
        </div>
    `
}
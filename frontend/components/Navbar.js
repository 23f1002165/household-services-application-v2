export default {
    template : `
        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm" style="padding: 20px 20px;">
            <div class="container-fluid">
                <a class="navbar-brand align-items-center" href="/">
                    <span style="font-size: 18px; background: black; color: white; padding: 5px 5px; border-radius: 5px;" class="bg-black text-white rounded">A to Z</span>
                    <span class="fw-bold" style="font-weight: 550;">Household Services</span>
                </a>
                <form @submit.prevent="search">
                    <div v-if="$store.state.loggedIn && $store.state.role == 'Customer'">
                        <input type="text" v-model="name" style="width: 300px; border: 1px solid #ccc; padding: 10px; border-radius: 25px;" placeholder="Search for ‘Kitchen Cleaning’">
                    </div>
                </form>
    
                <div>
                    <router-link v-if="!$store.state.loggedIn" to="/login" style="text-decoration: none; color: black; padding: 8px 16px;">Login</router-link>
                    <!-- Admin Links -->
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to="/Admin" style="text-decoration: none; color: black; padding: 8px 16px;">Dashboard</router-link>
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to="/Admin/add_service" style="text-decoration: none; color: black; padding: 8px 16px;">Services</router-link>
                    <!-- Customer Dashboard -->
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to="/Customer" style="text-decoration: none; color: black; padding: 8px 16px;">Dashboard</router-link>
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to="/Customer/bookings" style="text-decoration: none; color: black; padding: 8px 16px;">My bookings</router-link>
                    <!-- Logout Button -->
                    <button class="btn-link" style="background: none; border: none; padding: 8px 16px; cursor: pointer; text-decoration: none; color: black; font-size: 16px;" v-if="$store.state.loggedIn" @click="logout">Logout</button>
                </div>
            </div>
        </nav>
    `,
    data(){
        return {
            name : null,
        }
    },
    methods: {
        async search(){
            try {
                const res = await fetch(location.origin+`/api/service/${this.name}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authentication-Token' : this.$store.state.auth_token
                        }
                    })
                const data = await res.json()
                if (res.ok) {
                    this.$router.push(`/service/${data.name}`)
                } else {
                    this.$router.push('/other_services')
                }
            } finally {
                this.name = '';  // Clear the search box after the request
            }
        },
        logout() {
            this.$store.commit('logout')
            this.$router.push('/')
        }
    }
}
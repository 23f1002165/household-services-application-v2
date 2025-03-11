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

                <form @submit.prevent="searchProfessional">
                    <div v-if="$store.state.loggedIn && $store.state.role == 'Admin'" style="position: relative;">
                        <input 
                            type="text" 
                            v-model="pname" 
                            @input="fetchSuggestions" 
                            @focus="showDropdown = true"
                            @blur="hideDropdownWithDelay"
                            style="width: 300px; border: 1px solid #ccc; padding: 10px; border-radius: 25px;" 
                            placeholder="Search for ‘Professional’"
                        />
                        <ul 
                            v-if="showDropdown && suggestions.length" 
                            style="position: absolute; background: white; border: 1px solid #ccc; width: 300px; border-radius: 5px; max-height: 200px; overflow-y: auto; padding: 5px; list-style-type: none;"
                        >
                            <li 
                                v-for="professional in suggestions" 
                                :key="professional.id" 
                                @click="selectProfessional(professional)"
                                style="padding: 10px; cursor: pointer;"
                                @mouseover="hoveredProfessional = professional.id" 
                                @mouseleave="hoveredProfessional = null"
                                :style="{ background: hoveredProfessional === professional.id ? '#f0f0f0' : 'white' }"
                            >
                                {{ professional.username }}
                            </li>
                        </ul>
                    </div>
                </form>
    
                <div>
                    <router-link v-if="!$store.state.loggedIn" to="/login" style="text-decoration: none; color: black; padding: 8px 16px;">Login</router-link>
                    <!-- Admin Links -->
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to="/Admin" style="text-decoration: none; color: black; padding: 8px 16px;">Dashboard</router-link>
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to="/Admin/report" style="text-decoration: none; color: black; padding: 8px 16px;">Analytics & Reports</router-link>
                    <!-- Customer Dashboard -->
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to="/Customer" style="text-decoration: none; color: black; padding: 8px 16px;">Dashboard</router-link>
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to="/Customer/bookings" style="text-decoration: none; color: black; padding: 8px 16px;">My bookings</router-link>
                    <button class="btn-link" style="background: none; border: none; padding: 8px 16px; cursor: pointer; text-decoration: none; color: black; font-size: 16px; outline: none;" v-if="$store.state.loggedIn && $store.state.role == 'Customer'" @click="custProfile">Profile</button>
                    <!-- Professional Dashboard -->
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Professional'" to="/Professional" style="text-decoration: none; color: black; padding: 8px 16px;">Dashboard</router-link>
                    <router-link v-if="$store.state.loggedIn && $store.state.role == 'Professional'" to="/Professional/history" style="text-decoration: none; color: black; padding: 8px 16px;">Service History</router-link>
                    <button class="btn-link" style="background: none; border: none; padding: 8px 16px; cursor: pointer; text-decoration: none; color: black; font-size: 16px; outline: none;" v-if="$store.state.loggedIn && $store.state.role == 'Professional'" @click="profProfile">Profile</button>
                    <!-- Logout Button -->
                    <button class="btn-link" style="background: none; border: none; padding: 8px 16px; cursor: pointer; text-decoration: none; color: black; font-size: 16px; outline: none;" v-if="$store.state.loggedIn" @click="logout">Logout</button>
                </div>
            </div>
        </nav>
    `,
    data(){
        return {
            pname: "",
            suggestions: [],
            showDropdown: false,
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
                this.name = '';
            }
        },
        async fetchSuggestions() {
            if (this.pname.length < 2) {
                this.suggestions = [];
                return;
            }
            
            const res = await fetch(location.origin + `/api/user?name=${encodeURIComponent(this.pname)}`, {
                method: "GET",
                headers: {
                    "Authentication-Token": this.$store.state.auth_token,
                },
            });
            const data = await res.json();
            this.suggestions = res.ok ? data : [];
        },
        async searchProfessional() {
            if (!this.pname.trim()) return;
            try {
                const res = await fetch(location.origin + `/api/user?name=${encodeURIComponent(this.pname)}`, {
                    method: "GET",
                    headers: {
                        "Authentication-Token": this.$store.state.auth_token,
                    },
                });
                const data = await res.json();
                if (res.ok && data.length > 0) {
                    this.$router.push(`/professional_profile/${data[0].id}`);
                } else {
                    this.$router.push("/Admin");
                }
            } finally {
                this.pname = "";
                this.showDropdown = false;
            }
        },
        selectProfessional(professional) {
            this.pname = "";
            this.showDropdown = false;
            this.$router.push(`/professional_profile/${professional.id}`);
        },
        hideDropdownWithDelay() {
            setTimeout(() => {
                this.showDropdown = false;
            }, 200);
        },
        profProfile(){
            this.$router.push(`/professional_profile/${this.$store.state.user_id}`)
        },
        custProfile(){
            this.$router.push(`/profile/${this.$store.state.user_id}`)
        },
        logout() {
            this.$store.commit('logout')
            this.$router.push('/')
        }
    },
}
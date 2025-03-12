export default {
    template : `
    <div>
        <div class="text-center my-5">
            <h1 class="fw-bold">Empowered people, empowering people.</h1>
            <h3 class="text-muted">Trained Professionals. Happy Customers.</h3>
        </div>
        <div class="d-flex justify-content-center align-items-center" style="padding: 60px;">
            <div>
                <div v-if="showError" class="alert alert-danger text-center">
                    {{ feedback }}
                </div>
                <div class="card p-4 shadow-lg" style="width: 500px; border-radius: 20px;">
                    
                    <h4 class="text mb-3">Enter your registered email ID</h4>
                    <p class="text text-muted">to continue to A to Z Household Services.</p>
                    <br>

                    <form @submit.prevent="submitLogin">
                        <div class="mb-3">
                            <input type="email" class="form-control" v-model="email" required placeholder="Registered Email ID">
                        </div>

                        <div class="mb-3">
                            <input type="password" class="form-control" v-model="password" required placeholder="Password">
                        </div>

                        <button class="btn btn-primary w-100" type='submit'>Login</button>
                    </form>
                
                    <router-link class="btn btn-link w-100 text-center" to="/register">Create Account?</router-link>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            email : null,
            password : null,
            feedback : null,
            showError: false
        } 
    },
    methods : {
        async submitLogin(){
            const res = await fetch(location.origin+'/login', 
                {
                    method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password})
                })
            const data = await res.json()
            if (res.ok){
                localStorage.setItem('user', JSON.stringify(data))

                this.$store.commit('setUser')
                if (this.$store.state.user_active){
                    this.$router.push(`/${data.role}`)
                }else {
                    alert('You have been restricted from access.')
                    this.$store.commit('logout')
                    this.$router.push('/')
                }
                
            }else {
                this.feedback = data.message
                this.showError = true
                setTimeout(() => {
                    this.showError = false;
                }, 3000);
            }
        }
    }
}
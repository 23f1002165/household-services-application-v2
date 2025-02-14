export default {
    template : `
    <div>
        <div class="text-center my-5">
            <h2 class="fw-bold">Home services and solutions like never experienced before</h2>
            <h3 class="text-muted">Safety Ensured.</h3>
        </div>
        <div class="d-flex justify-content-center align-items-center" style="padding: 60px;">
            <div>
                <div v-if="showError" class="alert alert-danger text-center">
                    {{ feedback }}
                </div>
                <div class="card p-4 shadow-lg" style="width: 500px; border-radius: 20px;">
                    
                    <h4 class="text mb-3">Discover leading home services near you</h4>
                    
                    <br>

                    <form @submit.prevent="customerRegister">
                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="username" required placeholder="Full Name">
                        </div>

                        <div class="mb-3">
                            <input type="email" class="form-control" v-model="email" required placeholder="Email ID">
                        </div>

                        <div class="mb-3">
                            <input type="password" class="form-control" v-model="password" required placeholder="Password">
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="phone_number" required placeholder="Phone Number">
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="address" required placeholder="Address">
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="pincode" required placeholder="Pincode">
                        </div>

                        <button class="btn btn-primary w-100" type='submit'>Register</button>
                    </form>
                
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            username : null,
            email : null,
            password : null,
            phone_number : null, 
            address : null,
            pincode : null,
            feedback : null,
            showError: false
        } 
    },
    methods : {
        async customerRegister(){
            const res = await fetch(location.origin+'/register',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({'username': this.username, 'email': this.email,'password': this.password, 'phone_number': this.phone_number, 'address': this.address, 'pincode': this.pincode}),
                })
            const data = await res.json()
			if (res.ok) {
				this.feedback = data.message
                this.showError = true
                setTimeout(() => {
                    this.showError = false;
                }, 3000);
			} else {
                this.feedback = data.message
                this.showError = true
                setTimeout(() => {
                    this.showError = false;
                }, 3000);
			}
        }
    },
}
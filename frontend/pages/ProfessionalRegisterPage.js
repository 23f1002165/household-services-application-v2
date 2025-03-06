export default {
    template : `
    <div>
        <div class="text-center my-5">
            <h1 class="fw-bold">Join A to Z Household Services to Change Your Life</h1>
            <h3 class="text-muted">Earn More. Earn Respect.</h3>
        </div>
        <div class="d-flex justify-content-center align-items-center" style="padding: 60px;">
            <div>
                <div class="card p-4 shadow-lg" style="width: 500px; border-radius: 20px;">
                    
                    <h4 class="text mb-3">Share your email ID</h4>
                    <p class="text text-muted">and we'll reach out via your account dashboard.</p>
                    <br>

                    <form @submit.prevent="professionalRegister">
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
                            <select class="form-control" v-model="id" required>
                                <option value="" disabled>Select an existing service</option>
                                <option v-for="service in uniqueServices" :key="service.id" :value="service.id">
                                    {{ service.name }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="experience" required placeholder="Experience">
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="phone_number" required placeholder="Phone Number">
                        </div>

                        <div class="mb-3">
                            <input type="file" class="form-control" @change="handleFileUpload" required>
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="address" required placeholder="Address">
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="pincode" required placeholder="Pincode">
                        </div>
                        <div v-if="showError" class="alert alert-danger text-center">
                            {{ feedback }}
                        </div>

                        <button class="btn btn-primary w-100" type='submit'>Join Us</button>
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
            id : "",
            experience : null,
            phone_number : null,
            documents : null,
            address : null,
            pincode : null,
            feedback : null,
            showError: false,
            all_services: []
        } 
    },
    computed: {
        uniqueServices() {
            const seen = new Set();
            return this.all_services.filter(service => {
                if (!seen.has(service.name)) {
                    seen.add(service.name);
                    return true;
                }
                return false;
            });
        }
    },
    methods : {
        handleFileUpload(event) {
            this.documents = event.target.files[0];
        },
        async professionalRegister() {
            let formData = new FormData();
            formData.append("username", this.username);
            formData.append("email", this.email);
            formData.append("password", this.password);
            formData.append("service_type_id", parseInt(this.id));
            formData.append("experience", this.experience);
            formData.append("phone_number", this.phone_number);
            formData.append("address", this.address);
            formData.append("pincode", this.pincode);
            formData.append("documents", this.documents);

            const res = await fetch(location.origin + '/api/professional/register', {
                method: 'POST',
                headers: {
                
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                alert('Professional Request Sent for Approval')
                location.reload();
            } else {
                this.feedback = data.message;
                this.showError = true;
                setTimeout(() => {
                    this.showError = false;
                }, 3000);
            }
        }
    },
    async mounted() {
        const res = await fetch("/api/services");
        this.all_services = await res.json();
    },
}
export default {
    template : `
    <div>
        <div class="text-center my-5">
            <h1 class="fw-bold">Empowered people, empowering people.</h1>
            <h3 class="text-muted">Trained Professionals. Happy Customers.</h3>
        </div>
        <div class="d-flex justify-content-center align-items-center" style="padding: 60px;">
            <div>
                <div class="card p-4 shadow-lg" style="width: 500px; border-radius: 20px;">
                    
                    <h4 class="text mb-3">Enter your registered email ID</h4>
                    <p class="text text-muted">to continue to A to Z Household Services.</p>
                    <br>

                    <form @submit.prevent="addService">
                        <div class="mb-3">
                            <select class="form-control" v-model="selectedService">
                                <option value="" disabled>Select an existing service</option>
                                <option v-for="service in uniqueServices" :key="service.id" :value="service.name">
                                    {{ service.name }}
                                </option>
                                <option value="new">Create New Service</option>
                            </select>
                        </div>

                        <div class="mb-3" v-if="selectedService === 'new'">
                            <input type="text" class="form-control" v-model="name" required placeholder="New Service Name">
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="price" required placeholder="Price">
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="time_required" required placeholder="Time required">
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="description" required placeholder="Description">
                        </div>

                        <button class="btn btn-primary w-100" type='submit'>Add Service</button>
                    </form>
                
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            availableServices: [],
            selectedService: "",
            name : null,
            price : null,
            time_required : null,
            description : null,
        } 
    },
    computed: {
        uniqueServices() {
            const seen = new Set();
            return this.availableServices.filter(service => {
                if (!seen.has(service.name)) {
                    seen.add(service.name);
                    return true;
                }
                return false;
            });
        }
    },
    methods : {
        async fetchServices(){
            const res = await fetch(location.origin+'/api/services', {
                method: 'GET',
                headers: {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            });

            if (res.ok){
                const data = await res.json();
                this.availableServices = data;
            }
        },
        async addService(){
            let serviceName = this.selectedService === 'new' ? this.name : this.selectedService;

            if (!serviceName) {
                alert("Please select or enter a service name.");
                return;
            }
            const res = await fetch(location.origin+'/api/services', 
                {
                    method : 'POST', 
                    headers: {
                        'Authentication-Token' : this.$store.state.auth_token,
                        'Content-Type' : 'application/json'
                    }, 
                    body : JSON.stringify({'name': serviceName, 'price': this.price, 'time_required': this.time_required, 'description': this.description})
                })
            if (res.ok){
                alert(`${serviceName} service added successfully.`);
                this.$router.push('/Admin')
            }
        }
    },
    mounted(){
        this.fetchServices();
    }
}
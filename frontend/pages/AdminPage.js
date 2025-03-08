export default {
    template : `
    <div style="margin: auto;">
        <div style="background-color:rgb(143, 145, 145); padding: 50px; height: 280px;" class="d-flex justify-content-between">
            <div style="max-width: 500px;">
                <h1 class="fw-bold">Empowered people, empowering people.</h1>
                <span class="fw-bold">
                    A hub of skilled professionals and satisfied customers.
                </span>
            </div>
        </div>
        <nav id="navbar" class="navbar navbar-expand-lg navbar-light bg-white" style="border-bottom: 1px solid rgb(143, 145, 145); position: fixed; top: 300px; width: 100%; z-index: 1000; background: white;">
            <div class="container-fluid">
                <ul class="nav nav-underline">
                <li ><a class="nav-link" style="color: #6f42c1; cursor: pointer;" @click="scrollToSection('serviceSection')">Service</a></li>
                <li ><a class="nav-link" style="color: #6f42c1; cursor: pointer;" @click="scrollToSection('professionalSection')">Professional</a></li>
                <li ><a class="nav-link" style="color: #6f42c1; cursor: pointer;" @click="scrollToSection('customerSection')">Customer</a></li>
                <li ><a class="nav-link" style="color: #6f42c1; cursor: pointer;" @click="create_csv">↓ Get Service Request Data</a></li>
                </ul>
            </div>
        </nav>

        <div ref="serviceSection" style="width: 1100px; margin-left: 60px; padding: 20px;">
            <div class="d-flex justify-content-between my-5">
                <h3 class="fw-bold">Service</h3>
                <button @click="$router.push('/Admin/add_service')" class="fw-bold mb-0" style="padding: 1px 2px; border: 1px solid white; background-color: white; color: #008080; border-radius: 5px; outline: none;" >Create new services ></button>
            </div>
            <div class="row mt-3">
                <div v-for="service in uniqueServices" :key="service.name" class="col-md-3 mb-4">
                    <div @click="$router.push('/edit_service/'+service.name)" class="card text-white" style="cursor: pointer; width: 250px; height: 250px; border-radius: 10px; padding: 20px; background-color: #008080;">
                        <div class="card-body" style="margin-top: 80px;">
                            <h4 class="fw-bold" style="font-size: 1.2rem;">{{ service.name }}</h4>
                        </div>
                        <div style="margin-bottom: 2px;">
                            <button class="btn btn-link" style="background: white; border: 1px solid white; border-radius: 25px; color: #008080; font-size: 16px; text-decoration: none; outline: none;">
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div ref="professionalSection" style="width: 1100px; margin-left: 60px; padding: 20px;">
            <h3 class="fw-bold">Professional</h3>
            <div style="overflow-x: auto; overflow-y: hidden; white-space: nowrap; height: 400px; scrollbar-height: 1px; scrollbar-width: thin; scrollbar-color: #888 #f1f1f1;">
                <div class="d-flex" style="margin-top: 30px; gap: 10px;">
                    <div v-for="professional in all_professionals" :key="professional.professional_id">
                        <div @click="$router.push('/professional_profile/'+professional.professional_id)" class="card border-0 shadow-sm" style="width: 350px; height: 200px; cursor: pointer;">
                            <img src="/static/images/Professional.png" style="height: 200px; object-fit: cover;"/>
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ professional.professional.username }}</h5>
                                <p class="card-text mb-0">{{ getServiceName(professional.service_type_id) }}</p>
                                <p class="card-text">
                                <span style="margin: 10px 10px;" class="text-dark" v-if="professional.professional.active">
                                    <span v-if="professional.is_verified">✔️ Verified</span>
                                    <span v-else>🚫 Verfication Declined</span>
                                </span>
                                <span style="margin: 10px 10px;" class="text-dark" v-if="!professional.professional.active">
                                    <span v-if="professional.is_verified">❌ Blocked</span>
                                    <span v-else> ⟳ Approval Process Ongoing</span>
                                </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div ref="customerSection" class="container" style="width: 1300px; padding: 20px; ">
            <h3 class="fw-bold my-5">Customer</h3>
            <div class="row">
                <div v-for="customer in all_customers" class="col-md-6 d-flex align-items-start mb-4" @click="$router.push('/profile/'+customer.id)" style="cursor: pointer;">
                    <div 
                        class="d-flex align-items-center justify-content-center text-white"
                        :style="{ backgroundColor: '#008080', width: '35px', height: '35px', borderRadius: '25px', fontSize: '20px' }">
                        <p style="margin: 0;"> → </p>
                    </div> 
                    <div style="margin-left: 10px;">
                        <h5 class="fw-bold">
                            {{ customer.username }}
                            <span v-if="customer.active">✔️</span>
                            <span v-else>❌</span>
                        </h5>
                        <p class="text-dark">{{ customer.email }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div style="width: 1200px; height: 1px; background-color: rgb(143, 145, 145); margin: 50px auto;"></div>
    </div>
    `,
    data() {
        return {
            all_services : [],
            all_customers : [],
            all_requests : [],
            all_professionals : [],
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
        async create_csv(){
            const res = await fetch(location.origin + '/create-csv', {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            const task_id = (await res.json()).task_id

            const interval = setInterval(async() => {
                const res = await fetch(`${location.origin}/get-csv/${task_id}` )
                if (res.ok){
                    console.log('data is ready')
                    window.open(`${location.origin}/get-csv/${task_id}`)
                    clearInterval(interval)
                }

            }, 100)
            
        },
        handleScroll() {
            const navbar = document.getElementById("navbar");
            let scrollY = window.scrollY;
            let newTop = Math.max(0, 300 - scrollY);
            navbar.style.top = newTop + "px";
        },
        getServiceName(id) {
            const service = this.all_services.find(serv => serv.id === id);
            return service ? service.name : 'Service no longer available';
        },
        async fetchrequests(){
            const res = await fetch(location.origin + '/api/request', {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            this.all_requests = await res.json()
        },
        async fetchprofessionals(){
            const res = await fetch(location.origin + '/api/professional', {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            this.all_professionals = await res.json()
        },
        async fetchcustomers(){
            const res = await fetch(location.origin + '/api/customers', {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            this.all_customers = await res.json()
        },
        scrollToSection(section) {
            const element = this.$refs[section];
            if (element) {
                window.scrollTo({
                    top: element.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        }
        
    },
    async mounted(){
        window.addEventListener("scroll", this.handleScroll);
        const res = await fetch(location.origin + '/api/services', {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        this.all_services = await res.json();
        this.fetchcustomers();
        this.fetchprofessionals();
        this.fetchrequests();
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }
}
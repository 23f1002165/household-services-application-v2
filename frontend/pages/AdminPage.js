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
                <li ><a class="nav-link" style="color: #6f42c1; cursor: pointer;" @click="scrollToSection('professionalSection')">↓ Get Service Request Data</a></li>
                <li ><a class="nav-link" style="color: #6f42c1; cursor: pointer;" @click="scrollToSection('professionalSection')">About</a></li>
                </ul>
            </div>
        </nav>

        <div ref="serviceSection" style="width: 1100px; margin-left: 60px; padding: 20px;">
            <div class="d-flex justify-content-between my-5">
                <h1 class="fw-bold">Service</h1>
                <button @click="$router.push('/Admin/add_service')" class="fw-bold mb-0" style="padding: 1px 2px; border: 1px solid white; background-color: white; color: #008080; border-radius: 5px; outline: none;" >Create new services ></button>
            </div>
            <div class="row mt-3">
                <div v-for="(service, index) in all_services" :key="index" class="col-md-3 mb-4">
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
        <div ref="requestSection" style="width: 1100px; margin-left: 60px; padding: 20px;">
            <h1 class="fw-bold" style="margin-bottom: 30px;">Service Request</h1>
            <div
                v-for="(request, index) in all_requests"
                :key="index"
                class="timeline-item p-4"
                :style="{ 
                        minWidth: '200px',
                        height: '150px', 
                        flex: '0 0 auto', 
                        borderRadius: '8px', 
                        textAlign: 'left',
                        backgroundColor: index % 2 === 0 ? '#E5D0C5' : '#5D3A2D',
                        color: index % 2 === 0 ? '#3D2B1F' : 'white'
                }"
            >
                <div>
                    <h4 class="fw-bold">{{ request.service.name }}</h4>
                    <p>{{ request.service.description }}</p>
                </div>
                <div style="width: 1000px; height: 1px; background-color: black; margin: 5px auto;"></div>
                <div class="d-flex align-items-center justify-content-between">
                    <p>{{ request.customer.username }}</p>
                    <p style="margin-left: 40px;">{{ request.professional.username }}</p>
                    <p style="margin-left: 40px;">{{ request.date_of_request }}</p>
                    <p style="margin-left: 40px;">Job {{ request.status }}</p> 
                </div>
            </div>
        </div>
        <div ref="professionalSection" style="width: 1100px; margin-left: 60px; padding: 20px;">
            <h1 class="fw-bold">Professional</h1>
            <div style="overflow-x: auto; overflow-y: hidden; white-space: nowrap; height: 400px; scrollbar-height: 1px; scrollbar-width: thin; scrollbar-color: #888 #f1f1f1;">
                <div class="d-flex justify-content-between" style="margin-top: 30px; gap: 10px;">
                    <div v-for="professional in all_professionals" :key="professional.professional_id">
                        <div @click="$router.push('/profile/'+professional.professional_id)" class="card border-0 shadow-sm" style="width: 250px; height: 250px; cursor: pointer;">
                            <img src="/static/images/Professional.png" style="height: 200px; object-fit: cover;"/>
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ professional.professional.username }}</h5>
                                <p class="card-text">{{ professional.service_type_id }}</p>
                                <p class="card-text">{{ professional.is_verified }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-for="professional in all_professionals" :key="professional.professional_id">
                        <div @click="$router.push('/Customer')" class="card border-0 shadow-sm" style="width: 250px; height: 250px; cursor: pointer; border: 1px solid #008080;">
                            <img src="/static/images/Professional.png" style="height: 200px; object-fit: cover;"/>
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ professional.professional.username }}</h5>
                                <p class="card-text">{{ professional.service_type_id }}</p>
                                <p class="card-text">{{ professional.is_verified }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-for="professional in all_professionals" :key="professional.professional_id">
                        <div @click="$router.push('/Customer')" class="card border-0 shadow-sm" style="width: 250px; height: 250px; cursor: pointer; border: 1px solid #008080;">
                            <img src="/static/images/Professional.png" style="height: 200px; object-fit: cover;"/>
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ professional.professional.username }}</h5>
                                <p class="card-text">{{ professional.service_type_id }}</p>
                                <p class="card-text">{{ professional.is_verified }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-for="professional in all_professionals" :key="professional.professional_id">
                        <div @click="$router.push('/Customer')" class="card border-0 shadow-sm" style="width: 250px; height: 250px; cursor: pointer; border: 1px solid #008080;">
                            <img src="/static/images/Professional.png" style="height: 200px; object-fit: cover;"/>
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ professional.professional.username }}</h5>
                                <p class="card-text">{{ professional.service_type_id }}</p>
                                <p class="card-text">{{ professional.is_verified }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-for="professional in all_professionals" :key="professional.professional_id">
                        <div @click="$router.push('/Customer')" class="card border-0 shadow-sm" style="width: 250px; height: 250px; cursor: pointer; border: 1px solid #008080;">
                            <img src="/static/images/Professional.png" style="height: 200px; object-fit: cover;"/>
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ professional.professional.username }}</h5>
                                <p class="card-text">{{ professional.service_type_id }}</p>
                                <p class="card-text">{{ professional.is_verified }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div ref="customerSection" class="container py-5" style="width: 1300px; padding: 40px; background-color: #fdeee7;">
            <h1 class="fw-bold text-dark mb-4">Customer</h1>
            
            <div class="row">
                <div v-for="customer in all_customers" class="col-md-6 d-flex align-items-start mb-4">
                    <div 
                        class="d-flex align-items-center justify-content-center text-white"
                        :style="{ backgroundColor: customer.active ? 'green' : 'red', width: '35px', height: '35px', borderRadius: '25px', fontSize: '20px' }">
                        <p style="margin: 0;">@</p>
                    </div>
                    <div style="margin-left: 10px;">
                        <h5 class="fw-bold">
                            {{ customer.username }}
                            <span v-if="customer.active">✔️</span>
                            <span v-else>❌</span>
                        </h5>
                        <p class="text-dark">{{ customer.address }} - {{ customer.pincode }}</p>
                        <p class="text-dark">Call {{ customer.phone_number }}</p>
                    </div>
                </div>
                <div v-for="customer in all_customers" class="col-md-6 d-flex align-items-start mb-4">
                    <div 
                        class="d-flex align-items-center justify-content-center text-white"
                        :style="{ backgroundColor: customer.active ? 'green' : 'red', width: '35px', height: '35px', borderRadius: '25px', fontSize: '20px' }">
                        <p style="margin: 0;">@</p>
                    </div>
                    <div style="margin-left: 10px;">
                        <h5 class="fw-bold">
                            {{ customer.username }}
                            <span v-if="customer.active">✔️</span>
                            <span v-else>❌</span>
                        </h5>
                        <p class="text-dark">{{ customer.address }} - {{ customer.pincode }}</p>
                        <p class="text-dark">Call {{ customer.phone_number }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div style="width: 1200px; height: 5px; background-color: rgb(143, 145, 145); margin: 50px auto;"></div>
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
    methods : {
        handleScroll() {
            const navbar = document.getElementById("navbar");
            let scrollY = window.scrollY;
            let newTop = Math.max(0, 300 - scrollY);
            navbar.style.top = newTop + "px";
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
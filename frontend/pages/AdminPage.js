export default {
    template : `
    <div style="margin: auto; padding: 20px;">
        <div style="margin-left: 30px; max-width: 1100px;" class="d-flex justify-content-between my-5">
            <div style="max-width: 500px;">
                <h1 class="fw-bold">Empowered people, empowering people.</h1>
                <span class="fw-bold">
                    A hub of skilled professionals and satisfied customers.
                </span>
            </div>
        </div>
        <nav id="navbar" class="navbar navbar-expand-lg navbar-light bg-white" style="position: fixed; top: 300px; width: 100%; z-index: 1000; background: white;">
            <div class="container-fluid">
                <ul class="nav nav-underline">
                <li class="nav-item"><a class="nav-link" href="#">Inside UC</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Open positions</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Perks</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Culture</a></li>
                <li class="nav-item"><a class="nav-link active text-primary fw-bold" href="#">UC Journey</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Founders & leadership</a></li>
                </ul>
                <button class="btn btn-primary">View open positions</button>
            </div>
        </nav>

        <div style="width: 1100px; margin-left: 50px; padding: 20px;">
            <div class="d-flex justify-content-between my-5">
                <h1 class="fw-bold">Service</h1>
                <button @click="$router.push('/Customer')" class="fw-bold mb-0" style="padding: 1px 2px; border: 1px solid white; background-color: white; color: black; border-radius: 5px; outline: none;" >Create new services ></button>
            </div>
            <div class="row mt-4">
                <div v-for="(service, index) in all_services" :key="index" class="col-md-3 mb-4">
                    <div class="card text-white" style="width: 250px; height: 250px; border-radius: 10px; padding: 20px; background-color: #008080;">
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

        <div style="overflow-x: auto; white-space: nowrap; padding-bottom: 20px;">
            <div class="timeline d-flex" style="display: flex; gap: 10px;">
                <div
                v-for="(event, index) in timelineData"
                :key="index"
                class="timeline-item text-white p-4"
                :style="{ 
                    minWidth: '250px', 
                    flex: '0 0 auto', 
                    borderRadius: '8px', 
                    textAlign: 'left',
                    backgroundColor: index % 2 === 0 ? '#E5D0C5' : '#5D3A2D',
                    color: index % 2 === 0 ? '#3D2B1F' : 'white'
                }"
                >
                <h4 class="fw-bold">{{ event.year }}</h4>
                <p>{{ event.description }}</p>
                </div>
            </div>
        </div>

        <div style="width: 1100px; margin-left: 50px; padding: 20px;">
            <h1 class="fw-bold">Professional</h1>
            <div class="row" style="margin-top: 30px;">
                <div v-for="professional in all_professionals" :key="professional.professional_id" class="col-md-4">
                    <div @click="$router.push('/Customer')" class="card border-0 shadow-sm" style="width: 300px; height: 200px; cursor: pointer; border: 1px solid #008080;">
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
    `,
    data() {
        return {
            all_services : [],
            all_professionals : [],
            timelineData: [
                { year: "2014", description: "3 friends, a few drinks (or cups of coffee?) and 1 solid idea later, Urban Company (then UrbanClap) was launched as a lead generation marketplace" },
                { year: "Early 2015", description: "Kaching! UC raised $10 million funding and went places-Delhi, Bangalore, Mumbai and Chennai" },
                { year: "Late 2015", description: "UC launched its full-stack model in beauty. This makeover resulted in massive growth, from 0 to $2 million ARR" },
                { year: "2017", description: "All in! The 'full-stack model' was expanded to other categories like Spa, Appliance Repair, Electricians, Plumbers and Carpenters" },
                { year: "2018", description: "UC set out on a new adventure with an international expansion in Dubai & Abu Dhabi" },
                { year: "2019", description: "Even the land down under- Australia" },
                { year: "2020", description: "With more to explore, UC launched in Singapore" },
                { year: "2021", description: "New achievement level unlocked: Unicorn status with a valuation over $2 billion" }
            ]
        }
    },
    methods : {
        async fetchprofessionals(){
            const res = await fetch(location.origin + '/api/professional', {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            this.all_professionals = await res.json()
        }
        
    },
    async mounted(){
        window.addEventListener("scroll", function () {
            const navbar = document.getElementById("navbar");
            navbar.style.top = window.scrollY > 100 ? "0" : "300px";
        });
        const res = await fetch(location.origin + '/api/services', {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        this.all_services = await res.json();
        this.fetchprofessionals();
    }
}
export default {
    props : ['name'],
    template : `
    <div style="margin: auto; padding: 20px;">
        <div style="margin-left: 30px; max-width: 1100px;" class="d-flex justify-content-between my-5">
            <div style="max-width: 500px;">
                <h1 class="fw-bold">{{ all_services[0].name }}</h1>
                <span class="fw-bold">
                    <img src="/static/images/Rating.jpg" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                    {{ averageRating }}
                </span>
            </div>

            <div style="width: 500px; margin-right: 250px; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <div v-for="servname in all_services" :key="servname.id">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="ms-3">
                            <h5 class="fw-bold">{{ servname.description }}</h5>
                            <span class="fw-bold">
                                <img src="/static/images/Rating.jpg" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                                {{ descRating[servname.description] || 'No reviews yet.'}}
                            </span>
                            <p class="fw-bold mb-0">
                                ₹{{ servname.price }} • {{ servname.time_required }} mins
                            </p>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(1, minmax(120px, 1fr));">
                            <img src="/static/images/Home.jpg" class="rounded" style="margin: 0px 10px;" width="120" height="80">
                            <button class="btn-link" style="margin: 5px 0px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;" @click="show(servname)">
                            {{ servname.show ? 'Close' : 'Manage Service' }}
                            </button>
                        </div>
                    </div>
                    <div style="margin: 20px auto;" v-if="servname.show">
                        <p class="text-muted">Manage existing services efficiently by updating or removing outdated listings.</p>
                        
                        <div class="p-3" style="width: 450px; margin: auto; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                            <h6 class="mb-0">Revise Service Information</h6>
                            <form @submit.prevent="editService(servname)">
                                <p class="text-muted">Change Price</p>
                                <div class="mb-3">
                                    <input type="text" rows="3" class="form-control" v-model="servname.price"/>
                                </div>
                                <p class="text-muted">Change Estimated Time</p>
                                <div class="mb-3">
                                    <input type="text" rows="3" class="form-control" v-model="servname.time_required"/>
                                </div>
                                <button class="btn btn-link w-100" type="submit" style="background: #6f42c1; border: 1px solid #6f42c1; border-radius: 5px; color: white; text-decoration: none; font-size: 15px; outline: none;" @click="editService(servname)">
                                Edit Details
                                </button>
                            </form>
                        </div>
                        <button class="btn btn-link w-100" type="submit" style="margin: 20px auto; background:rgb(193, 66, 66); border: 1px solidrgb(193, 66, 66); border-radius: 5px; color: white; text-decoration: none; font-size: 15px; outline: none;" @click="deleteService(servname)">
                            Delete Service
                        </button>
                    </div>
                    
                    <div style="width: 450px; height: 1px; background-color: black; margin: 20px auto;"></div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            all_services: [],
            servreqname : [],
        }
    },
    computed: {
        averageRating() {
            if (!this.servreqname.length) return 'No reviews yet.';
            let total = this.servreqname.reduce((sum, req) => sum + (req.rating || 0), 0);
            return (total / this.servreqname.length).toFixed(1);
        },
        descRating() {
            if (!this.servreqname.length) return 'No reviews yet.';

            let ratingsMap = {};
            this.servreqname.forEach(req => {
                if (req.service.description in ratingsMap) {
                    ratingsMap[req.service.description].total += req.rating || 0;
                    ratingsMap[req.service.description].count += 1;
                } else {
                    ratingsMap[req.service.description] = { total: req.rating || 0, count: 1 };
                }
            });

            Object.keys(ratingsMap).forEach(desc => {
                ratingsMap[desc] = (ratingsMap[desc].total / ratingsMap[desc].count).toFixed(1);
            });

            return ratingsMap;
        },
    },
    methods: {
        show(servname){
            servname.show = !servname.show;
            if (servname.show) {
                servname.price = servname.price;
                servname.time_required = servname.time_required;
            }
        },
        async editService(servname){
            const res = await fetch(`${location.origin}/api/edit_service/${servname.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token
                },
                body: JSON.stringify({'price': servname.price, 'time_required': servname.time_required})
            });
            const data = await res.json()
            if (res.ok) {
                alert('Service edited successfully!');
                location.reload();
            }
            
        },
        async deleteService(servname) {
            if (!confirm(`Are you sure you want to delete the service: ${servname.description}?`)) {
                return;
            }

            const res = await fetch(`${location.origin}/api/delete_service/${servname.id}`, {
                method: 'DELETE',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token,
                }
            });
            const data = await res.json()
            if (res.ok) {
                alert('Service deleted successfully!');
                this.$router.push('/Admin')
            }
        },
        async fetchReviews() {
            const res = await fetch(`${location.origin}/api/service_request/${this.name}`, {
                headers: { 'Authentication-Token': this.$store.state.auth_token }
            });
            if (res.ok) {
                this.servreqname = await res.json();
            }
        },
    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/service/${this.name}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.all_services = await res.json();
            this.all_services = this.all_services.map(servname => ({
                ...servname,
                show: false,
            }))
            this.fetchReviews();
        }
    }
}
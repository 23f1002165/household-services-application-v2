export default {
    props : ['professional_id'],
    template : `
    <div style="margin: auto; padding: 20px;">
            <div style="width: 550px; margin-left: 350px; padding: 20px;">
                <div class="d-flex align-items-center">
                    <h3 class="fw-bold">{{ professional.professional.username }}</h3>
                    <span style="margin: 10px 10px;" class="text-dark" v-if="professional.professional.active">
                        <span v-if="professional.is_verified">✔️ Verified</span>
                        <span v-else>Under process</span>
                    </span>
                    <span style="margin: 10px 10px;" class="text-dark" v-else>❌ Blocked</span>
                </div>
                
                <div style="width: 550px; height: 1px; background-color: black; margin: 20px auto;"></div>
                   
                <div class="d-flex align-items-center">
                    <img src="/static/images/Professional.png" style="width: 90px; height: 90px;"/>
                    <div style="margin: 10px 10px;">
                        <h5 class="fw-bold">{{ servrequests[0].service.name }}</h5>
                        <p class="text-dark">{{ professional.experience }} years of experience</p>
                        <p class="text-muted mb-0">{{ professional.professional.address }} - {{ professional.professional.pincode }}</p>
                        <p class="text-muted mb-0"> 📞 {{ professional.professional.phone_number }}</p>
                    </div>
                </div>
                <p class="fw-bold mb-0">View documents</p>
                <div style="display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr));">
                    <button class="btn-link" style="margin: 5px 0px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;">
                    'Manage Service'
                    </button>
                    <button class="btn-link" style="margin: 5px 0px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;">
                    'Manage Service'
                    </button>
                </div>
    
                <div style="width: 550px; height: 1px; background-color: rgb(228, 228, 228);"></div>
            </div>
            <div style="width: 1100px; height: 5px; background-color: rgb(195, 197, 197); margin: 20px auto;"></div>
        <div style="margin-left: 30px; max-width: 1200px;" class="d-flex justify-content-between my-5">
            <div style="width: 700px;">
                <h3 class="fw-bold">Customer Reviews</h3>
                <span class="fw-bold">
                    <img src="/static/images/Rating.jpg" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                    {{ averageRating }}
                </span>
            </div>
            <div class="d-flex flex-wrap">
                <div v-for="review in filteredRequests" :key="review.id" class="card shadow-sm p-3 m-2" style="width: 400px">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex">
                            <div style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background-color: rgb(228, 231, 231);">
                                <img src="/static/images/Profile.jpg" class="rounded-circle" width="40" height="40">
                            </div>
                            <div class="ms-3" style="margin-left: 10px;">
                                <h6 class="fw-bold">{{ review.customer.username }}</h6>
                                <p class="text-muted">{{ review.review_created_at.split(" ")[0].replace(/,$/, "") }} at {{ review.review_created_at.split(" ")[1] }}{{ review.review_created_at.split(" ")[2] }}</p>
                                
                            </div>
                        </div>
                        <span>⭐ {{ review.rating }}</span>
                    </div>
                    <p class="mt-2">{{ review.comments }}</p>      
                </div>  
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            professional : {},
            servrequests : [],
        }
    },
    computed: {
        filteredRequests() {
            return this.servrequests.filter(request => String(request.professional_id) === String(this.professional_id));
        },
        averageRating() {
            if (!this.filteredRequests.length) return 'No reviews yet.';
            let total = this.filteredRequests.reduce((sum, req) => sum + (req.rating || 0), 0);
            return (total / this.filteredRequests.length).toFixed(1);
        },
    },
    methods: {
        async fetchReviews() {
            const res = await fetch(`${location.origin}/api/servicerequest/${this.professional_id}`, {
                headers: { 'Authentication-Token': this.$store.state.auth_token }
            });
            if (res.ok) {
                this.servrequests = await res.json();
            }
        },
    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/professional/${this.professional_id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.professional = await res.json();
            await this.fetchReviews();
        }
    }
}
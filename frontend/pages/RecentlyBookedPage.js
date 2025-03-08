export default {
    props : ['name'],
    template : `
    <div style="margin: auto; padding: 20px;">
            <div style="width: 550px; margin-left: 350px; padding: 20px;">
                <h3 class="fw-bold">Recently Booked</h3>
                <div style="width: 550px; height: 1px; background-color: black; margin: 20px auto;"></div>
                
                <div v-for="request in filteredRequests" :key="request.id">
                    <div class="d-flex align-items-center">
                        <img src="/static/images/Home.jpg" style="width: 70px; height: 70px;"/>
                        <div style="margin: 10px 10px;">
                            <h3 class="mb-3">{{ request.service.name }}</h3>
                            <p class="text-muted m-0">{{ request.service.description }} • ₹{{ request.service.price }} total amount</p>
                        </div>
                    </div>
                    <div style="width: 550px; height: 1px; background-color: rgb(228, 228, 228);"></div>
                    <div v-if="request.status === 'completed'">
                        <p class="text-muted" style="max-width: 450px;">Service was successfully delivered by the professional on {{ request.date_of_completion.split(" ")[0].replace(/,$/, "") }} at {{ request.date_of_completion.split(" ")[1] }} {{ request.date_of_completion.split(" ")[2] }}</p>
                        <div style="width: 550px; height: 1px; background-color: rgb(228, 228, 228);"></div>
                         
                        <button style="border: none; background-color: white; color: #6f42c1; font-size: 15px; outline: none;" @click="show(request)">
                        {{ request.show ? 'Close' : 'Leave a service review.' }}
                        </button>
                    </div>
                    <div v-if="request.status === 'closed'">
                        <p class="text-muted" style="max-width: 450px;">Service was successfully delivered by the professional on {{ request.date_of_completion.split(" ")[0].replace(/,$/, "") }} at {{ request.date_of_completion.split(" ")[1] }} {{ request.date_of_completion.split(" ")[2] }}</p>
                        <h6 class="mb-0">Your experience with the service</h6>
                        <div class="mb-3">
                            <span v-for="star in 5" :key="star" style="font-size: 24px; margin-right: 5px;">
                            <i :class="star <= request.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary'"></i>
                            </span>
                        </div>
                        <p class="text-muted">{{ request.comments || 'No comments available.' }}</p>
                        <button style="border: none; background-color: white; color: #6f42c1; font-size: 15px; outline: none;" @click="show(request)">
                        {{ request.show ? 'Close' : 'Edit your feedback' }}
                        </button>
                              
                    </div>
                    <div v-if="request.status === 'cancelled'">
                        <p class="text-muted">Service cancellation occurred on {{ request.date_of_completion.split(" ")[0].replace(/,$/, "") }} at {{ request.date_of_completion.split(" ")[1] }} {{ request.date_of_completion.split(" ")[2] }}</p>
                        <div style="width: 550px; height: 1px; background-color: rgb(228, 228, 228);"></div>
                        <div class="d-flex justify-content-between" @click="$router.push('/service/'+request.service.name)" style="width: 550px; margin: 10px 10px; gap: 10px; cursor: pointer;">
                            <div>
                                <img src="/static/images/File.png" style="width: 20px; height: 20px; object-fit: cover;">
                                <button style="border: none; background-color: white; color: black; font-size: 15px; outline: none;">
                                Book again
                                </button>
                            </div>  
                            <p class="fw-bold" style="margin-right: 50px;">></p>
                        </div>
                    </div>
                    <div style="margin: 20px auto;" v-if="request.show">
                        <div class="p-3" style="width: 550px; margin: auto; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                            <h6 class="mb-0">Rate your service experience</h6>
                            <form @submit.prevent="closeRequest(request)">
                                <div class="mb-3">
                                    <span v-for="star in 5" :key="star" style="font-size: 24px; cursor: pointer; margin-right: 5px;" @click="request.rating=star">
                                    <i :class="star <= request.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary'"></i>
                                    </span>
                                </div>
                                <p class="text-muted">Write a review</p>
                                <div class="mb-3">
                                    <textarea rows="3" class="form-control" v-model="request.review" placeholder="Share your experience..."></textarea>
                                </div>
                                <button class="btn btn-link w-100" type="submit" style="background: #6f42c1; border: 1px solid #6f42c1; border-radius: 5px; color: white; text-decoration: none; font-size: 15px; outline: none;">
                                Submit Review
                                </button>
                            </form>
                        
                        </div>
                    </div>
                    <div style="width: 550px; height: 5px; background-color: rgb(195, 197, 197); margin: 20px auto;"></div>
                </div>
                
            </div>
    </div>
    `,
    data(){
        return {
            all_requests : [],
        }
    },
    methods: {
        show(request){
            request.show = !request.show;
            if (request.show) {
                request.rating = request.rating || null;
                request.review = request.comments || null;
            }
        },
        async closeRequest(request){
            if (!request.rating) {
                alert("Please provide a rating.");
                return;
            }
            const today = new Date().toLocaleDateString("en-GB", { 
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
            const res = await fetch(`${location.origin}/api/request/close/${request.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({'rating': request.rating, 'comments': request.review, 'review_created_at': today, 'status': 'closed'})
                })
            const data = await res.json()
            if(res.ok){
                alert('Review submitted successfully!');
                location.reload();
            }
        },
    },
    computed: {
        filteredRequests() {
          return this.all_requests.filter(request => {
            return request.service && request.service.name === this.name && (request.status === 'closed' || request.status === 'cancelled' || request.status === 'completed');
          });
        }
    },

    async mounted(){
        const res = await fetch(`${location.origin}/api/request/service/${this.$store.state.user_id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.all_requests = await res.json()
            this.all_requests = this.all_requests.map(request => ({
                ...request,
                show: false,
            }))
        }
    }
}
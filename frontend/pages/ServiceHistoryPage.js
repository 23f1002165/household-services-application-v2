export default {
    template : `
    <div style="margin: auto; padding: 20px;">
            <div style="width: 550px; margin-left: 350px; padding: 20px;">
                <h3 class="fw-bold">Service History</h3>
                <div style="width: 550px; height: 1px; background-color: black; margin: 20px auto;"></div>
                <div class="text-center" v-if="filteredRequests.length === 0">
                    <h3 class="fw-bold">No completed services yet.</h3>
                    <p class="text-muted m-0">Looks like you haven’t served any customers yet.</p>
                    <div style="color: #6f42c1; cursor: pointer;" @click="$router.push('/Professional')">Deliver excellent service to keep customers happy →</div>
                </div>
                <div v-for="request in filteredRequests" :key="request.id">   
                    <div class="d-flex align-items-center">
                        <img src="/static/images/Home.jpg" style="width: 70px; height: 70px;"/>
                        <div style="margin: 10px 10px;">
                            <h3 class="mb-3">{{ request.service.name }}</h3>
                            <p class="text-muted m-0">{{ request.service.description }}</p>
                        </div>
                    </div>
                    <div style="width: 550px; height: 1px; background-color: rgb(228, 228, 228);"></div>
                    <div v-if="request.status === 'closed'">
                        <p class="text-muted" style="max-width: 450px;">Successfully provided service to the customer {{ request.date_of_completion.split(" ")[0].replace(/,$/, "") }} at {{ request.date_of_completion.split(" ")[1] }} {{ request.date_of_completion.split(" ")[2] }}</p>
                        <h6 class="mb-0">Your service was reviewed and rated.</h6>
                        <div class="mb-3">
                            <span v-for="star in 5" :key="star" style="font-size: 24px; margin-right: 5px;">
                            <i :class="star <= request.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary'"></i>
                            </span>
                        </div>
                        <p class="text-muted">{{ request.comments || 'No reviews available.' }}</p>
                    </div>
                    <div v-if="request.status === 'completed'">
                        <p class="text-muted" style="max-width: 450px;">Successfully provided service to the customer {{ request.date_of_completion.split(" ")[0].replace(/,$/, "") }} at {{ request.date_of_completion.split(" ")[1] }} {{ request.date_of_completion.split(" ")[2] }}</p>
                        <h6 class="mb-0">Your service hasn’t received any reviews yet.</h6>
                    </div>
                    <div v-if="request.status === 'cancelled'">
                        <p class="text-muted">Service cancellation took place on {{ request.date_of_completion.split(" ")[0].replace(/,$/, "") }} at {{ request.date_of_completion.split(" ")[1] }} {{ request.date_of_completion.split(" ")[2] }}</p>
                        <p class="mb-0">Apologies, the customer has canceled the service.</p>
                    </div>
                    <div style="width: 550px; height: 5px; background-color: rgb(195, 197, 197); margin: 20px auto;"></div>
                </div>
            </div>
    </div>
    `,
    data(){
        return {
            servrequests : [],
        }
    },
    computed: {
        filteredRequests() {
            return this.servrequests.filter(request => {
                return (
                    request.professional_id === this.$store.state.user_id && (request.status === 'cancelled' || request.status === "closed")
                );
            })
        }
    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/servicerequest/${this.$store.state.user_id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.servrequests = await res.json()
        }
    }
}
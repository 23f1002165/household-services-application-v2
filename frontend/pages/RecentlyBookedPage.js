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
                            <p class="text-muted m-0">Slot {{ request.date_of_request }} • ₹{{ request.service.price }}</p>
                        </div>
                    </div>
                    <div style="width: 550px; height: 1px; background-color: rgb(228, 228, 228);"></div>   
                    <p class="text-muted m-0" style="margin: 10px 10px;">• {{ request.service.description }}</p>
                    
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
        
    },
    computed: {
        filteredRequests() {
          return this.all_requests.filter(request => {
            return request.service && request.service.name === this.name && (request.status === 'closed' || request.status === 'cancelled');
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
        }
    }
}
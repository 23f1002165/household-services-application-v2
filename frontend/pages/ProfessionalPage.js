export default {
    template : `
    <div style="margin: auto; padding: 20px;">
        <div style="margin-left: 30px; max-width: 1100px;" class="d-flex justify-content-between my-5">
            <div style="margin-top: 50px; max-width: 400px;">
                <h3 class="fw-bold">Your Skills, Their Satisfaction.</h3>
                <p class="text-muted">Elevate At-Home Service!</p>
                <img src="/static/images/Home.jpg" style="margin-left: 30px; width: 250px; height: 150px; border-radius: 5px;">
            </div>
            
            <div style="width: 500px; margin-right: 200px; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <div v-for="request in filteredRequests" :key="request.id">
                    <div class="d-flex align-items-center">
                        <div>
                            <div style="margin: 10px 10px;">
                                <h3 class="mb-3">{{ request.service.description }}</h3>
                                <p class="text-muted m-0">Slot {{ request.date_of_request }} • ₹{{ request.service.price }}</p>
                            </div>
                            <div style="width: 250px; height: 1px; background-color: rgb(228, 228, 228);"></div>   
                            <p class="mb-0" style="margin: 10px 10px;"> • {{ request.customer.username }}</p>
                            
                            <p class="mb-0" style="margin: 2px 20px;">{{ request.customer.address }} - {{ request.customer.pincode }}</p>
                                
                            <p class="mb-0" style="margin: 2px 20px;">{{ request.customer.phone_number }}</p>
                            
                        </div>
                        <div v-if="request.status === 'requested' || request.status === 'declined'">
                            <div style="display: grid; grid-template-columns: repeat(1, minmax(120px, 1fr));">
                                <img src="/static/images/Home.jpg" class="rounded" width="120" height="80">
                                <button class="btn-link" style="margin: 5px 20px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;" @click="acceptRequest(request)">
                                    Accept 
                                </button>
                            </div>
                        </div>
                        <div v-if="request.status === 'assigned'">
                            <div style="display: grid; grid-template-columns: repeat(1, minmax(120px, 1fr));">
                                <img src="/static/images/Home.jpg" class="rounded" width="120" height="80">
                                <button class="btn-link" style="margin: 5px 20px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;" @click="rejectRequest(request)">
                                    Decline 
                                </button>
                            </div>
                        </div>
                    </div>
                      
                    <div style="width: 450px; height: 1px; background-color: black; margin: 20px auto;"></div>
                </div>
            </div>
        </div>
        <div style="width: 1100px; height: 5px; background-color: rgb(195, 197, 197); margin: 100px auto;"></div>
        <footer style="background-color: #f8f9fa; padding: 30px; margin-top: 40px;">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <h5>Company</h5>
                    <ul style="list-style: none; padding: 0; color: #666;">
                    <li @click="$router.push('/about')" style="cursor: pointer;">About us</li>
                    </ul>
                </div>
            </div>
        </footer>
    </div>
    `,
    data(){
        return {
            servrequests : [],
        }
    },
    methods: {
        async acceptRequest(request) {
            const [date, slot, suffix] = request.date_of_request.split(" ");
            const res = await fetch(`${location.origin}/api/request/edit/${request.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({'professional_id': this.$store.state.user_id,'date_of_request': request.date_of_request, 'date_of_completion': null, 'status': 'assigned'})
                })
            const data = await res.json()
            if(res.ok){
                this.$router.push('/Professional')
                alert(`Get ready! Your service is set for  ${date} at ${slot} ${suffix}.`);
            }
        },
        async rejectRequest(request) {
            const [date, slot, suffix] = request.date_of_request.split(" ");
            const res = await fetch(`${location.origin}/api/request/edit/${request.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({'professional_id': this.$store.state.user_id, 'date_of_request': request.date_of_request, 'date_of_completion': null, 'status': 'declined'})
                })
            const data = await res.json()
            if(res.ok){
                this.$router.push('/Professional')
                alert(`We regret to inform you that your service scheduled for ${date} at ${slot} ${suffix} has been declined.`);
            }
        }
    },
    computed: {
        filteredRequests() {
            return this.servrequests.filter(request => {
                return (
                    (request.professional_id === null && request.status === 'requested') || 
                    (request.professional_id === this.$store.state.user_id && request.status === 'assigned') ||
                    (request.professional_id !== this.$store.state.user_id && request.status === 'declined')
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

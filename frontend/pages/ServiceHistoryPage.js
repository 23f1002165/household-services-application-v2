export default {
    template : `
    <div style="margin: auto; padding: 20px;">
            <div style="width: 550px; margin-left: 350px; padding: 20px;">
                <h3 class="fw-bold">Service History</h3>
                <div style="width: 550px; height: 1px; background-color: black; margin: 20px auto;"></div>
                <div class="text-center" v-if="servrequests.length === 0">
                    <h3 class="fw-bold">No services completed yet.</h3>
                    <p class="text-muted m-0">Looks like you haven’t done any services for customers</p>
                    <div style="color: #6f42c1; cursor: pointer;" @click="$router.push('/Professional')">Satisfy customers through your services →</div>
                </div>
                <div v-for="request in servrequests" :key="request.id">   
                    <div class="d-flex align-items-center">
                        <img src="/static/images/Home.jpg" style="width: 70px; height: 70px;"/>
                        <div style="margin: 10px 10px;">
                            <h3 class="mb-3">{{ request.service.name }}</h3>
                            <p class="text-muted m-0">Slot {{ request.date_of_request }} • ₹{{ request.service.price }}</p>
                        </div>
                    </div>
                    <div style="width: 550px; height: 1px; background-color: rgb(228, 228, 228);"></div>   
                </div>
                <div style="width: 550px; height: 5px; background-color: rgb(195, 197, 197); margin: 20px auto;"></div>
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
                    request.professional_id === this.$store.state.user_id && request.status === 'completed'
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
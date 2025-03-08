export default {
    template : `
    <div style="margin: auto; padding: 20px;">
        <div style="margin-left: 30px; max-width: 1100px;" class="d-flex justify-content-between my-5">
            <div style="margin-top: 50px; max-width: 400px;">
                <h3 class="fw-bold">Your Skills, Their Satisfaction.</h3>
                <p class="text-muted">Elevate At-Home Service!</p>
                <img src="/static/images/Home.jpg" style="margin-left: 30px; width: 250px; height: 150px; border-radius: 5px;">
            </div>
            
            <div style="width: 600px; margin-right: 100px; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <div v-if="!professional.is_verified" class="text-center">
                    <h3 class="fw-bold">Verification declined.</h3>
                    <p class="text-muted m-0">Upgrade your expertise, refine your resume, and reapply for verification.</p>
                    <img src="/static/images/NotFound.jpg" style="width: 300px; height: 300px; object-fit: cover; border-radius: 5px;">
                </div>
                <div v-else>
                    <div class="text-center" v-if="filteredRequests.length === 0">
                        <h3 class="fw-bold">No active service requests.</h3>
                        <p class="text-muted m-0">It seems like you have no service requests. Enjoy your day!</p>
                        <img src="/static/images/NotFound.jpg" style="width: 300px; height: 300px; object-fit: cover; border-radius: 5px;">
                    </div>
                    <div v-for="request in filteredRequests" :key="request.id">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <div style="margin: 10px 20px;">
                                    <h3 class="mb-3">{{ request.service.description }}</h3>
                                    <p class="text-muted m-0">Slot {{ request.date_of_request }} • ₹{{ request.service.price }}</p>
                                </div>
                                <div style="margin: 10px 20px; width: 250px; height: 1px; background-color: rgb(228, 228, 228);"></div>
                                <div class="d-flex" style="margin: 10px 20px;">   
                                    <img src="/static/images/Profile.jpg" class="rounded" style="margin: 10px 5px;" width="30" height="30">
                                    <div>
                                        <p class="mb-0" style="margin: 10px 5px;">{{ request.customer.username }}</p>
                                        <p class="mb-0" style="margin: 2px 5px;">{{ request.customer.address }} - {{ request.customer.pincode }}</p>
                                        <p class="mb-0" style="margin: 2px 5px;"> • <span style="color: #6f42c1;">{{ request.customer.phone_number }}</span></p>
                                    </div>
                                </div>
                        
                            </div>
                            <div v-if="request.status === 'requested' || request.status === 'declined'">
                                <div style="display: grid; grid-template-columns: repeat(1, minmax(120px, 1fr));">
                                    <img src="/static/images/Home.jpg" class="rounded" width="160" height="100">
                                    <button class="btn-link" style="margin: 5px 5px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;" @click="acceptRequest(request)">
                                        Accept Service
                                    </button>
                                </div>
                            </div>
                            <div v-if="request.status === 'assigned'">
                                <div style="display: grid; grid-template-columns: repeat(1, minmax(120px, 1fr));">
                                    <img src="/static/images/Home.jpg" class="rounded" width="160" height="100">
                                    <button class="btn-link" style="margin: 5px 5px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;" @click="rejectRequest(request)">
                                        Decline Service
                                    </button>
                                </div>
                            </div>
                            <div v-if="request.status === 'started'">
                                <div style="display: grid; grid-template-columns: repeat(1, minmax(120px, 1fr));">
                                    <img src="/static/images/Home.jpg" class="rounded" width="160" height="100">
                                    <button class="btn-link" style="margin: 5px 5px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;" @click="requestOTP(request)">
                                    {{ request.otp ? 'Close' : 'End Service' }}
                                    </button>
                                </div>
                            </div> 
                        </div>
                        <div style="margin: 20px auto;" v-if="request.otp">
                            <div class="p-3" style="width: 550px; margin: auto; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                                <h5 class="text-center mt-2">Enter verification code</h5>
                                <div class="d-flex justify-content-center gap-2">
                                    <form @submit.prevent="endRequest(request)">
                                        <input v-for="(digit, index) in otp" :key="index" v-model="otp[index]" 
                                            class="text-center" style="width: 40px; height: 40px; text-align: center; font-size: 1.2rem;" type="text" maxlength="1"
                                            @input="moveToNext(index)" ref="otpInput"/>
                                    </form>
                                </div>
                                <button class="btn btn-link w-100 mt-3" :disabled="!isOtpFilled" style="background: #6f42c1; border: 1px solid #6f42c1; border-radius: 5px; color: white; text-decoration: none; font-size: 15px; outline: none;" @click="endRequest(request)">
                                    End Service
                                </button>
                            </div>
                        </div>
                      
                        <div style="width: 550px; height: 1px; background-color: black; margin: 20px auto;"></div>
                    </div>
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
            professional: {},
            servrequests : [],
            otp: ['', '', '', ''],
        }
    },
    computed: {
        isOtpFilled() {
            return this.otp.every(digit => digit !== '');
        },
        filteredRequests() {
            return this.servrequests.filter(request => {
                return (
                    (request.professional_id === 0 && request.status === 'requested') || 
                    (request.professional_id === this.$store.state.user_id && request.status === 'assigned') ||
                    (request.professional_id === this.$store.state.user_id && request.status === 'started') ||
                    (request.professional_id !== this.$store.state.user_id && request.status === 'declined')
                );
            })
        }
    },
    methods: {
        requestOTP(request){
            request.otp = !request.otp;
        },
        moveToNext(index) {
            if (this.otp[index] && index < 5) {
              this.$refs.otpInput[index + 1].focus();
            }
        },
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
                location.reload();
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
                location.reload();
            }
        },
        async endRequest(request) {
            if (this.otp.join('') === `${request.id.toString().charAt(0)}${request.service_id}${request.customer_id}${request.professional_id}`) {
                const today = new Date().toLocaleDateString("en-GB", { 
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                });
                const res = await fetch(`${location.origin}/api/request/edit/${request.id}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authentication-Token': this.$store.state.auth_token
                        },
                        body: JSON.stringify({'professional_id': this.$store.state.user_id, 'date_of_request': request.date_of_request, 'date_of_completion': today, 'status': 'completed'})
                    })
                const data = await res.json()
                if(res.ok){
                    this.$router.push('/Professional')
                    alert(`The ${request.service.description} service was successfully offered to ${request.customer.username}.`);
                    location.reload();
                }
            }else {
                alert("The verification code is incorrect. Please try again.")
            }
        },
        async fetchProfessional() {
            const res = await fetch(`${location.origin}/api/professional/${this.$store.state.user_id}`, {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            if (res.ok){
                this.professional = await res.json();
            }
        },
    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/servicerequest/${this.$store.state.user_id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.servrequests = await res.json()
            this.servrequests = this.servrequests.map(request => ({
                ...request,
                otp: false,
            })),
            await this.fetchProfessional();
        }
    }
}

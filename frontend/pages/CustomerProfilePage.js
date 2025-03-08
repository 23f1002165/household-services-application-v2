export default {
    props : ['id'],
    template : `
    <div style="margin: auto; padding: 20px;">
            <div style="width: 550px; margin-left: 350px; padding: 20px;">
                <div class="d-flex align-items-center">
                    <h3 class="fw-bold">{{ customer.username }}</h3>
                    <span style="margin: 10px 10px;" class="text-dark" v-if="customer.active">✔️ Active</span>
                    <span style="margin: 10px 10px;" class="text-dark" v-else>❌ Inactive</span>
                </div>
                
                <div style="width: 550px; height: 1px; background-color: black; margin: 20px auto;"></div>
                   
                <div class="d-flex align-items-center">
                    <img src="/static/images/Professional.png" style="width: 90px; height: 90px;"/>
                    <div style="margin: 10px 10px;">
                        <h5 class="fw-bold">{{ customer.email }}</h5>
                        <p class="text-muted mb-0">{{ customer.address }} - {{ customer.pincode }}</p>
                        <p class="text-muted mb-0"> 📞 {{ customer.phone_number }}</p>
                    </div>
                </div>
                
                <div v-if="userRole=='Admin'" style="display: grid; grid-template-columns: repeat(1, minmax(120px, 1fr));">
                    <button @click="deactivateProfile" class="btn-link" style="margin: 5px 0px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;">
                    {{ customer.active? 'Deactivate Customer Profile' : 'Activate Customer Profile' }}
                    </button>
                </div>

                <div v-if="userRole === 'Customer'">
                    <button @click="toggleEditProfile" class="btn btn-link w-100" style="margin: 5px 0px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;">
                        {{ isEditing ? 'Close' : 'Edit Profile' }}
                    </button>
                </div>

                <div v-if="isEditing">
                    <p class="text-muted">Refresh your location and phone number.</p>
                    <div class="p-3" style="width: 450px; margin: auto; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h6 class="mb-10">Get Quality Home Services in Your Area.</h6>
                        <form @submit.prevent="submitEditProfile">
                            <div class="mb-3">
                                <input type="text" class="form-control" v-model="editedProfile.address" required placeholder="Address">
                            </div>

                            <div class="mb-3">
                                <input type="text" class="form-control" v-model="editedProfile.pincode" required placeholder="Pincode">
                            </div>

                            <div class="mb-3">
                                <input type="text" class="form-control" v-model="editedProfile.phone_number" required placeholder="Phone Number">
                            </div>

                            <button class="btn btn-link w-100" type="submit" style="background: #6f42c1; border: 1px solid #6f42c1; border-radius: 5px; color: white; text-decoration: none; font-size: 15px; outline: none;">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
    
                <div style="width: 550px; height: 1px; background-color: rgb(228, 228, 228);"></div>
            </div>
            <div v-if="userRole=='Admin'" style="width: 1100px; height: 5px; background-color: rgb(195, 197, 197); margin: 20px auto;"></div>
            <div v-if="userRole=='Admin'" style="width: 1100px; margin-left: 60px; padding: 20px;">
                <h3 class="fw-bold" style="margin-bottom: 30px;">Service Request</h3>
                <div v-if="servrequests.length === 0">
                    <p class="text-muted m-0">The customer is yet to book a service.</p>
                </div>
                <div
                    v-for="(request, index) in servrequests"
                    :key="index"
                    class="timeline-item p-4"
                    :style="{ 
                            minWidth: '200px',
                            height: '150px', 
                            flex: '0 0 auto', 
                            borderRadius: '8px', 
                            textAlign: 'left',
                            border: (request.status === 'closed' || request.status === 'cancelled') ? '1px solid #E5D0C5' : '1px solid #5D3A2D',
                            color: (request.status === 'closed' || request.status === 'cancelled') ? 'rgb(120, 75, 58)' : 'black'

                    }"
                >
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <h4 class="fw-bold">{{ request.service.name }}</h4>
                            <p>{{ request.service.description }}</p>
                        </div>
                        <div class="mb-3">
                            <span v-for="star in 5" :key="star" style="font-size: 15px; margin-right: 5px;">
                            <i :class="star <= request.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary'"></i>
                            </span>
                        </div>
                    </div>
                    <div style="width: 1000px; height: 1px; background-color: black; margin: 5px auto;"></div>
                    <div class="d-flex align-items-center" style="display: flex; gap: 10px;">
                        <p style="flex: 3; "><img src="/static/images/Profile.jpg" class="rounded-circle" width="40" height="40">
                        {{ request.professional.username || 'No service expert assigned.' }}</p>
                        <p style="flex: 1; ">{{ request.date_of_request }}</p>
                        <p style="flex: 1; text-align: center;">Job {{ request.status }}</p> 
                    </div>
                </div>
            </div>
    </div>
    `,
    data(){
        return {
            userRole : this.$store.state.role,
            customer : {},
            servrequests : [],
            isEditing: false,
            editedProfile: {
                phone_number: '',
                address: '',
                pincode: '',
            }
        }
    },
    methods : {
        toggleEditProfile() {
            this.isEditing = !this.isEditing;
            if (this.isEditing) {
                this.editedProfile = {
                    phone_number: this.customer.phone_number || '',
                    address: this.customer.address || '',
                    pincode: this.customer.pincode || '',
                };
            }
        },
        async deactivateProfile() {
            const res = await fetch(location.origin+`/status/customer/${this.id}`, {
                method: 'GET',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                    
                }
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                location.reload()
            }
        },  
        async fetchrequests(){
            const res = await fetch(`${location.origin}/api/customer_request/${this.id}`, {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            this.servrequests = await res.json()
        },
        async submitEditProfile() {
            const res = await fetch(`${location.origin}/api/profile/edit/${this.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token
                },
                body: JSON.stringify({'phone_number': this.editedProfile.phone_number, 'address': this.editedProfile.address, 'pincode': this.editedProfile.pincode})
            });
            const data = await res.json()
            if (res.ok) {
                alert('Profile edited successfully!');
                location.reload();
            }
        },
    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/customer/${this.id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.customer = await res.json();
            this.fetchrequests();
        }
    }
}
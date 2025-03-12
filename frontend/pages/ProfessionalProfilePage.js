export default {
    props : ['professional_id'],
    template : `
    <div style="margin: auto; padding: 20px;">
            <div style="width: 550px; margin-left: 350px; padding: 20px;">
                <div class="d-flex align-items-center">
                    <h3 class="fw-bold">{{ professional.professional.username }}</h3>
                    <span style="margin: 10px 10px;" class="text-dark" v-if="professional.professional.active">
                        <span v-if="professional.is_verified">✔️ Verified</span>
                        <span v-else>🚫 Verfication Declined</span>
                    </span>
                    <span style="margin: 10px 10px;" class="text-dark" v-if="!professional.professional.active">
                        <span v-if="professional.is_verified">❌ Blocked</span>
                        <span v-else> ⟳ Approval Process Ongoing</span>
                    </span>
                </div>
                
                <div style="width: 550px; height: 1px; background-color: black; margin: 20px auto;"></div>
                   
                <div class="d-flex align-items-center">
                    <img src="/static/images/Professional.png" style="width: 90px; height: 90px;"/>
                    <div style="margin: 10px 10px;">
                        <h5 class="fw-bold">{{ professional.professional.email }}</h5>
                        <p class="fw-bold">{{ getServiceName(professional.service_type_id) }} • {{ professional.experience }} years of experience</p>
                        
                        <p class="text-muted mb-0">{{ professional.professional.address }} - {{ professional.professional.pincode }}</p>
                        <p class="text-muted mb-0"> 📞 {{ professional.professional.phone_number }}</p>
                    </div>
                </div>
                <div v-if="professional.is_verified">
                    <p class="fw-bold">Hired on {{ professional.confirmed_at }}</p>
                </div>
                <h6 class="mb-0">Overall service rating.</h6>
                <div class="mb-3">
                    <span v-for="star in 5" :key="star" style="font-size: 24px; margin-right: 5px;">
                        <i v-if="star <= Math.floor(averageRating)" class="bi bi-star-fill text-warning"></i>
                        <i v-else-if="star - 0.5 <= averageRating" class="bi bi-star-half text-warning"></i>
                        <i v-else class="bi bi-star text-secondary"></i>
                    </span>
                </div>
                <div v-if="professional.professional.username!=='Professional IITM'">
                    <button @click="downloadDocument" class="btn btn-link" style="color: #6f42c1; font-size: 15px; outline: none; text-decoration: none;">
                        Download Document
                    </button>
                </div>
                <div v-if="userRole=='Admin' && !professional.is_verified" style="display: grid; grid-template-columns: repeat(2, minmax(280px, 1fr));">
                    <button  @click="verifyProfile" class="btn-link" style="margin: 5px 0px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;">
                    Authenticate Professional
                    </button>
                    <button  @click="denyProfile"class="btn-link" style="margin: 5px 10px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;">
                    Deny Professional
                    </button>
                </div>

                <div v-if="userRole=='Admin' && professional.is_verified">
                    <button @click="deactivateProfile" class="btn btn-link w-100" style="margin: 5px 0px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;">
                    {{ professional.professional.active? 'Restrict Service Professional' : 'Authenticate Professional' }}
                    </button>
                </div>

                <div v-if="userRole === 'Professional'">
                    <button @click="toggleEditProfile" class="btn btn-link w-100" style="margin: 5px 0px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;">
                        {{ isEditing ? 'Close' : 'Edit Profile' }}
                    </button>
                    <div v-if="!professional.is_verified">        
                        <button @click="reRequest" class="btn btn-link w-100" style="margin: 5px 0px; background: #6f42c1; border: 1px solid #6f42c1; color: white; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; font-size: 16px; outline: none;">
                        Request re-verification
                        </button>
                    </div>
                </div>

                <div v-if="isEditing">
                    <p class="text-muted">Refine your abilities to enhance customer happiness.</p>
                    <div class="p-3" style="width: 450px; margin: auto; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h6 class="mb-10">Your Skills, Their Satisfaction.</h6>
                        <form @submit.prevent="submitEditProfile">
                            <div class="mb-3">
                                <select class="form-control" v-model="editedProfile.service_type_id" required>
                                    <option value="" disabled>Select an existing service</option>
                                    <option v-for="service in uniqueServices" :key="service.id" :value="service.id">
                                        {{ service.name }}
                                    </option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <input type="text" class="form-control" v-model="editedProfile.experience" required placeholder="Experience">
                            </div>

                            <div class="mb-3">
                                <input type="text" class="form-control" v-model="editedProfile.phone_number" required placeholder="Phone Number">
                            </div>

                            <div class="mb-3">
                                <input type="file" class="form-control" @change="handleFileUpload">
                                <p v-if="editedProfile.document_name" class="mt-2">File in Use : {{ editedProfile.document_name }}</p>
                            </div>

                            <div class="mb-3">
                                <input type="text" class="form-control" v-model="editedProfile.address" required placeholder="Address">
                            </div>

                            <div class="mb-3">
                                <input type="text" class="form-control" v-model="editedProfile.pincode" required placeholder="Pincode">
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
        <div v-if="userRole=='Admin'" style="margin-left: 30px; max-width: 1200px;" class="d-flex justify-content-between my-5">
            <div style="width: 700px;">
                <h3 class="fw-bold">Customer Reviews</h3>
                <div v-if="filteredRequests.length === 0">
                    <p class="text-muted m-0">The professional is yet to serve a customer.</p>
                </div>
                <div v-else class="fw-bold">
                    <img src="/static/images/Rating.jpg" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                    {{ averageRating }}
                </div>
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
                    <p class="mt-2">{{ review.comments || 'No comments available.' }}</p>      
                </div>  
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            userRole : this.$store.state.role,
            professional: {},
            servrequests: [],
            all_services: [],
            isEditing: false,
            editedProfile: {
                service_type_id: '',
                experience: '',
                phone_number: '',
                address: '',
                pincode: '',
                documents: null,
                document_name: ''
            }
        }
    },
    computed: {
        filteredRequests() {
            return this.servrequests.filter(request => String(request.professional_id) === String(this.professional_id) && request.status === 'closed');
        },
        averageRating() {
            if (!this.filteredRequests.length) return 'No reviews yet.';
            let total = this.filteredRequests.reduce((sum, req) => sum + (req.rating || 0), 0);
            return (total / this.filteredRequests.length).toFixed(1);
        },
        uniqueServices() {
            const seen = new Set();
            return this.all_services.filter(service => {
                if (!seen.has(service.name)) {
                    seen.add(service.name);
                    return true;
                }
                return false;
            });
        },
    },
    methods: {
        toggleEditProfile() {
            this.isEditing = !this.isEditing;
            if (this.isEditing) {
                this.editedProfile = {
                    service_type_id: this.servrequests.length ? this.servrequests[0].service.id : '',
                    experience: this.professional.experience || '',
                    phone_number: this.professional.professional.phone_number || '',
                    address: this.professional.professional.address || '',
                    pincode: this.professional.professional.pincode || '',
                    documents: null,
                    document_name: this.professional.documents || '',
                };
            }
        },
        getServiceName(id) {
            const service = this.all_services.find(serv => serv.id === id);
            return service ? service.name : 'Service no longer available';
        },
        async downloadDocument() {
            const response = await fetch(`${location.origin}/uploads/${this.professional.documents}`, {
                method: 'GET',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = this.professional.documents;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);
        },
        handleFileUpload(event) {
            this.editedProfile.documents = event.target.files[0];
        },
        async reRequest() {
            const res = await fetch(location.origin + '/re_verify', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'id' : parseInt(this.professional_id)}),
            });

            if (res.ok) {
                alert('Profile Sent for re-verification');
                this.$store.commit('logout')
                this.$router.push('/')
            }
        },
        async submitEditProfile() {
                let formData = new FormData();
                formData.append("service_type_id", parseInt(this.editedProfile.service_type_id));
                formData.append("experience", this.editedProfile.experience);
                formData.append("phone_number", this.editedProfile.phone_number);
                formData.append("address", this.editedProfile.address);
                formData.append("pincode", this.editedProfile.pincode);
                if (this.editedProfile.documents) {
                    formData.append("documents", this.editedProfile.documents);
                }

                const res = await fetch(`${location.origin}/api/edit_profile/${this.professional_id}`, {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: formData
                });

                if (res.ok) {
                    alert('Profile updated successfully!');
                    this.isEditing = false;
                    location.reload();
                }
        },
        async verifyProfile() {
            const res = await fetch(location.origin+`/verify/professional/${this.professional_id}`, {
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
        async denyProfile() {
            const res = await fetch(location.origin+`/deny/professional/${this.professional_id}`, {
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
        async deactivateProfile() {
            const res = await fetch(location.origin+`/status/professional/${this.professional_id}`, {
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
        async fetchReviews() {
            const res = await fetch(`${location.origin}/api/servicerequest/${this.professional_id}`, {
                headers: { 'Authentication-Token': this.$store.state.auth_token }
            });
            if (res.ok) {
                this.servrequests = await res.json();
            }
        },
        async fetchServices() {
            const res = await fetch("/api/services");
            this.all_services = await res.json();
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
            await this.fetchServices();
        }
    }
}
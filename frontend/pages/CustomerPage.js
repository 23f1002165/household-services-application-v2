export default {
    template: `
    <div style="margin: auto; padding: 20px;">
        <div style="margin-left: 80px; max-width: 1100px; margin-top: 20px;" class="my-5">
            <h1 class="fw-bold">Discover Leading Home Services Near Me</h1>
            <div style="margin-top: 40px; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <p class="text-muted">Tailored Services To Meet Your Needs</p>
                
                <div style="display: grid; grid-template-columns: repeat(3, minmax(200px, 1fr)); gap: 40px; margin-top: 20px; justify-content: center;">
                    <div v-for="service in uniqueServ" :key="service.id" :name="service.name">
                        <div @click="$router.push('/service/'+service.name)" style="cursor: pointer; padding: 15px; display: flex; align-items: center; border-radius: 10px; background-color: #f8f9fa; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);">
                            <img src="/static/images/Home.jpg" style="width: 50px; height: 50px; margin-right: 15px;">
                            <span style="font-size: 16px; font-weight: 500;">{{ service.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <h5 style="margin-top: 100px;">Recently Booked</h5>
            <div style="margin-top: 10px; padding: 20px; border-radius: 10px;">
                <div class="text-center" v-if="uniqueServices.length === 0" style="text-align: center; display: flex; flex-direction: column; align-items: center;">
                    <h3 class="fw-bold">No bookings yet.</h3>
                    <p class="text-muted m-0">Looks like you haven’t experienced quality services at home.</p>
                    <p>Explore our services.</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, minmax(120px, 1fr)); justify-content: center; gap: 40px; margin-top: 20px;">
                      
                    <div v-for="service in uniqueServices" :key="service.uniqueKey" style="text-align: center; display: flex; flex-direction: column; align-items: center;">
                        <div @click="$router.push('/mybookings/'+service.name)" style="cursor: pointer; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background-color: rgb(228, 231, 231);">
                            <img src="/static/images/Cart.jpg" style="width: 50px; height: 50px;">
                        </div>
                        <div style="cursor: pointer; margin-top: 10px; font-size: 14px; font-weight: 500;">{{ service.name }}</div>
                        <div style="width: 60px; height: 1px; background-color: black; margin: 5px auto;"></div>
                    </div>
                </div>
            </div>
        </div>
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
        return{
            all_services : [],
            all_requests : []
        }
    },
    methods : {
        async fetchrequests(){
            const res = await fetch(`${location.origin}/api/request/service/${this.$store.state.user_id}`, {
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            if (res.ok){
                this.all_requests = await res.json()
            }
        }
    },
    computed: {
        uniqueServices() {
            const seen = new Set();
            return this.all_requests
                .filter(request => ['closed', 'completed', 'cancelled'].includes(request.status))
                .filter(request => {
                    if (!seen.has(request.service.name)) {
                        seen.add(request.service.name);
                        return true;
                    }
                    return false;
                })
                .map(request => ({
                    ...request.service,
                    uniqueKey: `${request.service.name}-${request.id}`
                }));
        },
        uniqueServ() {
            const seen = new Set();
            return this.all_services.filter(service => {
                if (!seen.has(service.name)) {
                    seen.add(service.name);
                    return true;
                }
                return false;
            });
        }
    },
    async mounted(){
        const res = await fetch(location.origin + '/api/services', {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })

        this.all_services = await res.json()
        this.fetchrequests();
    }
}
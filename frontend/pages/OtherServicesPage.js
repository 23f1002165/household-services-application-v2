export default {
    template: `
        <div style="margin: auto; padding: 20px;">
            <div style="margin-left: 50px; max-width: 1100px;" class="d-flex align-items-center justify-content-between my-5">
                <div style="max-width: 500px;">
                    <h1 class="fw-bold">We're sorry, we couldn't find what you were looking for!</h1>
                    <img src="/static/images/NotFound.jpg" style="width: 300px; height: 300px; object-fit: cover; border-radius: 5px;">
                </div>
                <div style="margin-top: 40px; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                    <p class="text-muted">Explore other services present</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, minmax(200px, 1fr)); gap: 40px; margin-top: 20px; justify-content: center;">
                        <div v-for="service in all_services" :key="service.id" :name="service.name">
                            <div @click="$router.push('/service/'+service.name)" style="cursor: pointer; padding: 15px; display: flex; align-items: center; border-radius: 10px; background-color: #f8f9fa; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);">
                                <img src="/static/images/Home.jpg" style="width: 50px; height: 50px; margin-right: 15px;">
                                <span style="font-size: 16px; font-weight: 500;">{{ service.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data(){
        return{
            all_services : []
        }
    },
    methods : {

    },
    async mounted(){
        const res = await fetch(location.origin + '/api/services', {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })

        this.all_services = await res.json()
    }
}
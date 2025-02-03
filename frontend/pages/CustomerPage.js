import ServiceCard from "../components/ServiceCard.js"

export default {
    template :`
    <div>
        <h1> Services </h1>
        <ServiceCard v-for="service in all_services" :name="service.name" :price="service.price" :description="service.description" :id="service.id" />
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
    },
    components : {
        ServiceCard,
    }
}
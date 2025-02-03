export default {
    template : `
    <div>
        <input placeholder="name"  v-model="name"/>  
        <input placeholder="price"  v-model="price"/>
        <input placeholder="time_required"  v-model="time_required"/>
        <input placeholder="description"  v-model="description"/>
        <button @click="submitLogin"> Add </button>
    </div>
    `,
    data(){
        return {
            email : null,
            password : null,
            role : null,
        } 
    },
    methods : {
        async submitLogin(){
            const res = await fetch(location.origin+'/api/services', 
                {
                    method : 'POST', 
                    headers: {
                        'Authentication-Token' : this.$store.state.auth_token,
                        'Content-Type' : 'application/json'
                    }, 
                    body : JSON.stringify({'name': this.name, 'price': this.price, 'time_required': this.time_required, 'description': this.description})
                })
            if (res.ok){
                console.log('service added')
            }
        }
    }
}
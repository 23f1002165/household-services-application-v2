export default {
    props : ['name'],
    template : `
    <div>
        <h1> {{servname.name}} service page </h1>
    </div>
    `,
    data(){
        return {
            servname : {},
        }
    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/service/${this.name}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.servname = await res.json()
        }
    }
}
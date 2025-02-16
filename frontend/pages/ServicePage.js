export default {
    props : ['name'],
    template : `
    <div style="margin: auto; padding: 20px;">
        <div style="margin-left: 30px; max-width: 1100px;" class="d-flex justify-content-between my-5">
            <div style="max-width: 500px;">
                <h1 class="fw-bold">{{ servname.name }}</h1>
                <span class="fw-bold">
                    <img src="/static/images/Rating.jpg" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                    {{ servname.rating || '4.7'}}
                </span>
            </div>

            <div style="width: 500px; margin-right: 250px; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="ms-3">
                        <h5 class="fw-bold">{{ servname.description }}</h5>
                        <span class="fw-bold">
                            <img src="/static/images/Rating.jpg" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                            {{ servname.rating || '4.7'}}
                        </span>
                        <p class="fw-bold mb-0">
                            ₹{{ servname.price }} • {{ servname.time_required }} mins
                        </p>
                    </div>
                    <div class="ms-3">
                        <p><img src="/static/images/Home.jpg" class="rounded" width="120" height="80" style="object-fit: cover;"></p>
                        <button class="btn btn-outline-primary px-4 py-2 fw-bold" @click="bookService">
                            Add
                        </button>
                    </div>
                </div>
                <div style="width: 450px; height: 1px; background-color: black; margin: 20px auto;"></div>
            </div>
        </div>
        <div style="width: 1100px; height: 5px; background-color: rgb(195, 197, 197); margin: 100px auto;"></div>
        <div style="margin-left: 30px; max-width: 1200px;" class="d-flex justify-content-between my-5">
            <div style="width: 700px;">
                <h3 class="fw-bold">Customer Reviews</h3>
                <span class="fw-bold">
                    <img src="/static/images/Rating.jpg" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                    {{ servname.rating || '4.7'}}
                </span>
            </div>
            <div class="d-flex flex-wrap">
                <div v-for="review in serv.reviews" :key="review.id" class="card shadow-sm p-3 m-2" style="width: 48%;">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex">
                            <div style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background-color: rgb(228, 231, 231);">
                                <img src="/static/images/Profile.jpg" class="rounded-circle" width="40" height="40">
                            </div>
                            <div class="ms-3" style="margin-left: 10px;">
                                <h6 class="fw-bold">{{ review.name }}</h6>
                                <p class="text-muted">{{ review.date }}</p>
                                
                            </div>
                        </div>
                        <span>⭐ {{ review.rating }}</span>
                    </div>
                    <p class="mt-2">{{ review.comment }}</p>      
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
        return {
            servname : {},
            serv: {
                rating: 4.71,
                total_reviews: 19000,
                star_breakdown: {
                    5: 17000,
                    4: 527,
                    3: 269,
                    2: 276,
                    1: 828
                },
                reviews: [
                    { id: 1, name: 'Gaurav', date: 'October 2024', rating: 5, comment: 'Nice work done by Raaja... Keep it up' },
                    { id: 2, name: 'Shricharana', date: 'October 2024', rating: 5, comment: 'Excellent service. Good interaction. Excellent cleaning.' },
                    { id: 3, name: 'Anil', date: 'September 2024', rating: 5, comment: 'Irfan is really hardworking, he went the extra mile.' },
                    { id: 4, name: 'Ishav', date: 'September 2024', rating: 5, comment: 'Nice experience.' },
                    { id: 5, name: 'Vaibhav', date: 'September 2024', rating: 5, comment: 'Excellent service.' }
                ]
            }
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
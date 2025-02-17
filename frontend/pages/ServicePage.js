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
                    <div style="display: grid; grid-template-columns: repeat(1, minmax(120px, 1fr));">
                        <img src="/static/images/Home.jpg" class="rounded" width="120" height="80">
                        <button class="btn-link" style="margin: 5px 20px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;" @click="slotSelection">
                            {{ showSlots ? 'Close' : 'Add' }}
                        </button>
                    </div>
                </div>

                <div style="margin: 20px auto;" v-if="showSlots">
                    <p class="text-muted">Service at the earliest available time slot</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, minmax(20px, 70px)); gap: 10px;">
                        <button v-for="(date, index) in availableDates"
                            class="btn-link"
                            :style="{
                                borderRadius: '8px',
                                padding: '10px 15px',
                                background: selectedDate === date.formatted ? '#e0d6fc' : '#fff',
                                border: selectedDate === date.formatted ? '1px solid #6f42c1' : '1px solid #ccc',
                                textDecoration: 'none',
                                color: 'black',
                                transition: '0.3s',
                                outline: 'none',
                            }"
                            @click="changeDate(date.formatted)"
                        >
                            {{ date.day }} {{ date.date }}
                        </button>
                    </div>
                    <p style="margin: 20px auto;" class="text-muted" >Select start time of service</p>
                    <div style="display: grid; grid-template-columns: repeat(3, minmax(120px, 1fr)); gap: 10px; justify-content: center;">
                        <button v-for="slot in availableSlots"
                            class="btn-link"
                            :style="{
                                borderRadius: '8px',
                                padding: '10px 15px',
                                background: selectedSlot === slot.time ? '#e0d6fc' : '#fff',
                                border: selectedSlot === slot.time ? '1px solid #6f42c1' : '1px solid #ccc',
                                textDecoration: 'none',
                                color: slot.disabled ? 'gray' : 'black',
                                transition: '0.3s',
                                outline: 'none',
                            }"
                            @click="if (!slot.disabled) selectedSlot = slot.time"
                            :disabled="slot.disabled"
                        >
                            {{ slot.time }}
                        </button>
                    </div>
                    <button class="btn mt-4 w-100" style="background: #6f42c1; border: 1px solid #6f42c1; border-radius: 5px; color: white; font-size: 16px" :disabled="!selectedSlot" @click="proceedToCheckout">
                        Proceed to Checkout
                    </button>
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
                <div v-for="review in serv.reviews" class="card shadow-sm p-3 m-2" style="width: 48%;">
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
                reviews: [
                    { id: 1, name: 'Gaurav', date: 'October 2024', rating: 5, comment: 'Nice work done by Raaja... Keep it up' },
                    { id: 2, name: 'Shricharana', date: 'October 2024', rating: 5, comment: 'Excellent service. Good interaction. Excellent cleaning.' },
                    { id: 3, name: 'Anil', date: 'September 2024', rating: 5, comment: 'Irfan is really hardworking, he went the extra mile.' },
                    { id: 4, name: 'Ishav', date: 'September 2024', rating: 5, comment: 'Nice experience.' },
                    { id: 5, name: 'Vaibhav', date: 'September 2024', rating: 5, comment: 'Excellent service.' }
                ]
            },
            showSlots: false,
            selectedSlot: null,
            availableDates: this.generateNextThreeDays(),
            availableSlots: [],
            selectedDate: null,
        }
    },
    methods: {
        slotSelection(){
            this.showSlots = !this.showSlots;
            this.selectedSlot = null;
            if (this.showSlots) {
                this.availableSlots = this.generateAvailableSlots(this.selectedDate);
            }
        },
        generateNextThreeDays(){
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            let dateArray = [];
            for (let i = 0; i < 3; i++) {
              let newDate = new Date();
              newDate.setDate(newDate.getDate() + i);
              dateArray.push({
                day: days[newDate.getDay()],
                date: newDate.getDate(),
                formatted: newDate.toISOString().split("T")[0],
              });
            }
            return dateArray;
        },
        generateAvailableSlots(selectedDate) {
            const now = new Date();
            const selectedDay = new Date(selectedDate);
            const isToday = now.toDateString() === selectedDay.toDateString();
            const slots = [];
            let hour = 9, minute = 0;
            while (hour < 18 || (hour === 18 && minute === 0)) {
                let formattedTime = `${hour}:${minute === 0 ? "00" : "30"} ${hour >= 12 ? "PM" : "AM"}`;
                if (isToday && (hour < now.getHours() || (hour === now.getHours() && minute < now.getMinutes()))) {
                    slots.push({ time: this.convertTo12HourFormat(formattedTime), disabled: true });
                } else {
                    slots.push({ time: this.convertTo12HourFormat(formattedTime), disabled: false });
                }
                minute = minute === 0 ? 30 : 0;
                if (minute === 0) hour++;
            }
            return slots;
        },
        changeDate(newDate) {
            this.selectedDate = newDate;
            this.availableSlots = this.generateAvailableSlots(newDate);
        },
        convertTo12HourFormat(time) {
            const [hours, minutes] = time.split(":");
            const period = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 || 12;
            return `${formattedHours}:${minutes}`;
        },
        async proceedToCheckout(){
            const res = await fetch(location.origin+'/api/request/service',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({'service_id': this.servname.id, 'customer_id': this.$store.state.user_id, 'date_of_request': `${this.selectedDate} ${this.selectedSlot}`})
                })
            const data = await res.json()
            if(res.ok){
                this.$router.push('/Customer/bookings')
                alert(`Proceeding with service on ${this.selectedDate} at ${this.selectedSlot}`);
            }
        },
    },
    created() {
        this.selectedDate = this.availableDates[0].formatted;
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
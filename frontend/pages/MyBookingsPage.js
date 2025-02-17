export default {
    template : `
    <div style="margin: auto; padding: 20px;">
            <div style="width: 550px; margin-left: 350px; padding: 20px;">
                <h3 class="fw-bold">My Bookings</h3>
                <div style="width: 550px; height: 1px; background-color: black; margin: 20px auto;"></div>   
                <div v-for="request in all_requests" :key="request.id" v-if="request.status === 'requested' || request.status === 'assigned'">   
                    <div class="d-flex align-items-center">
                        <img src="/static/images/Home.jpg" style="width: 70px; height: 70px;"/>
                        <div style="margin: 10px 10px;">
                            <h3 class="mb-3">{{ request.service.name }}</h3>
                            <p class="text-muted m-0">Slot {{ request.date_of_request }} • ₹{{ request.service.price }}</p>
                        </div>
                    </div>
                    <div style="width: 550px; height: 1px; background-color: rgb(228, 228, 228);"></div>   
                    <p class="text-muted m-0" style="margin: 10px 10px;">• {{ request.service.description }}</p>
                    <div v-if="request.status === 'requested'">
                        <div class="d-flex justify-content-between" style="width: 550px; margin: 10px 10px; gap: 10px;">
                            <button v-if="!request.show" class="w-50" style="padding: 10px 20px; border: 1px solid #e0e0e0; background-color: white; color: black; border-radius: 5px; font-size: 15px; outline: none;" @click="slotSelection(request)" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='white'">
                            {{ request.showSlots ? 'Close' : 'Reshedule this booking' }}
                            </button>
                            <button v-if="!request.showSlots && !request.show" class="btn btn-link w-50"style="background: #6f42c1; border: 1px solid #6f42c1; border-radius: 5px; color: white; text-decoration: none; font-size: 15px; outline: none;" @click="closeRequest(request)">
                            Cancel this Booking
                            </button>
                        </div>
                    </div>
                    <div v-if="request.status === 'assigned'">
                        <div class="d-flex align-items-center" style="width: 550px; margin: 10px 10px; gap: 10px;">
                            <p class="fw-bold mb-0">Technician Assigned</p>
                            <button v-if="!request.showSlots" style="padding: 10px 20px; border: none; background-color: white; color: #6f42c1; font-size: 15px; outline: none;" @click="show(request)">
                            {{ request.show ? 'Close' : 'View Details' }}
                            </button>
                        </div>
                        <div class="d-flex justify-content-between" style="width: 550px; margin: 10px 10px; gap: 10px;">
                            <button v-if="!request.show" class="w-50" style="padding: 10px 20px; border: 1px solid #e0e0e0; background-color: white; color: black; border-radius: 5px; font-size: 15px; outline: none;" @click="slotSelection(request)" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='white'">
                            {{ request.showSlots ? 'Close' : 'Reschedule this booking' }}
                            </button>
                            <button v-if="!request.showSlots && !request.show" class="btn btn-link w-50"style="background: #6f42c1; border: 1px solid #6f42c1; border-radius: 5px; color: white; text-decoration: none; font-size: 15px; outline: none;" @click="closeRequest(request)">
                            Cancel this Booking
                            </button>
                        </div>
                    </div>
                    <div style="margin: 20px auto;" v-if="request.show">
                        <p class="text-muted">Service at the earliest available time slot</p>
                    </div>

                    <div style="margin: 20px auto;" v-if="request.showSlots">
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
                        <button class="btn mt-4 w-100" style="background: #6f42c1; border: 1px solid #6f42c1; border-radius: 5px; color: white; font-size: 16px" :disabled="!selectedSlot" @click="proceedToCheckout(request)">
                            Reschedule
                        </button>
                    </div>
                    <div style="width: 550px; height: 5px; background-color: rgb(195, 197, 197); margin: 20px auto;"></div>
                </div>
                
            </div>
    </div>
    `,
    data(){
        return {
            all_requests : [],
            selectedSlot: null,
            availableDates: this.generateNextThreeDays(),
            availableSlots: [],
            selectedDate: null,
        }
    },
    methods: {
        slotSelection(request) {
            request.showSlots = !request.showSlots;
            if (request.showSlots) {
                this.selectedDate = request.date_of_request.split(" ")[0];
                this.selectedSlot = null;
                this.availableSlots = this.generateAvailableSlots(this.selectedDate);
            }
        },
        show(request) {
            request.show = !request.show;
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
        async closeRequest(request){
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
                    body: JSON.stringify({'date_of_request': request.date_of_request, 'date_of_completion': today, 'status': 'closed'})
                })
            const data = await res.json()
            if(res.ok){
                this.$router.push('/Customer/bookings')
                alert('Booking cancelled. We hope to see you again in the future');
            }
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
        async proceedToCheckout(request){
            const res = await fetch(`${location.origin}/api/request/edit/${request.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({'date_of_request': `${this.selectedDate} ${this.selectedSlot}`, 'date_of_completion': null, 'status': 'requested'})
                })
            const data = await res.json()
            if(res.ok){
                this.$router.push('/Customer/bookings')
                alert(`Proceeding with service on ${this.selectedDate} at ${this.selectedSlot}`);
            }
        },
        
    },

    async mounted(){
        const res = await fetch(`${location.origin}/api/request/service/${this.$store.state.user_id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.all_requests = await res.json()
            this.all_requests = this.all_requests.map(request => ({
                ...request,
                showSlots: false,
                show: false
            }))
        }
    }
}
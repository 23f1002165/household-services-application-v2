export default {
    props : ['name'],
    template : `
    <div style="margin: auto; padding: 20px;">
        <div style="margin-left: 30px; max-width: 1100px;" class="d-flex justify-content-between my-5">
            <div style="max-width: 500px;">
                <h1 class="fw-bold">{{ all_services[0].name }}</h1>
                <span class="fw-bold">
                    <img src="/static/images/Rating.jpg" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                    {{ averageRating }}
                </span>
            </div>

            <div style="width: 500px; margin-right: 250px; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <div v-for="servname in all_services" :key="servname.id">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="ms-3">
                            <h5 class="fw-bold">{{ servname.description }}</h5>
                            <span class="fw-bold">
                                <img src="/static/images/Rating.jpg" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                                {{ descRating[servname.description] || 'No reviews yet.'}}
                            </span>
                            <p class="fw-bold mb-0">
                                ₹{{ servname.price }} • {{ servname.time_required }} mins
                            </p>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(1, minmax(120px, 1fr));">
                            <img src="/static/images/Home.jpg" class="rounded" width="120" height="80">
                            <button class="btn-link" style="margin: 5px 20px; background: none; border: 1px solid #6f42c1; border-radius: 5px; padding: 8px 16px; cursor: pointer; text-decoration: none; color: #6f42c1; font-size: 16px; outline: none;" @click="slotSelection(servname.id)">
                                {{ selectedServiceId === servname.id && (showSlots || showPaymentPortal) ? 'Close' : 'Add' }}
                            </button>
                        </div>
                    </div>

                    <div style="margin: 20px auto;" v-if="selectedServiceId === servname.id && showSlots">
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
                            Proceed to Payment
                        </button>
                    </div>
                    <div v-if="showPaymentPortal && selectedServiceId === servname.id" style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h6 class="mb-10">Payment Details</h6>
                        <p>
                        <label>Card Number</label>
                        <input type="text" v-model="payment.cardNumber" class="form-control mb-2" placeholder="1234 5678 9101 1121" @input="validateCardNumber">
                        <small v-if="errors.cardNumber" style="color: red;">{{ errors.cardNumber }}</small>
                        </p>
                        <p>
                        <label>Expiry Date</label>
                        <input type="text" v-model="payment.expiryDate" class="form-control mb-2" placeholder="MM/YY" @input="validateExpiryDate">
                        <small v-if="errors.expiryDate" style="color: red;">{{ errors.expiryDate }}</small>
                        </p>
                        <p>
                        <label>CVV</label>
                        <input type="text" v-model="payment.cvv" class="form-control mb-2" placeholder="123" @input="validateCVV">
                        <small v-if="errors.cvv" style="color: red;">{{ errors.cvv }}</small>
                        </p>
                        <button class="btn w-100 mt-3" style="background: #6f42c1; color: white;" 
                            @click="confirmPayment(servname.id)" 
                            :disabled="!isFormValid">
                            Confirm Payment
                        </button>
                    </div>

                    <div style="width: 450px; height: 1px; background-color: black; margin: 20px auto;"></div>
                </div>
            </div>
        </div>
        <div style="width: 1100px; height: 5px; background-color: rgb(195, 197, 197); margin: 100px auto;"></div>
        <div style="margin-left: 30px; max-width: 1200px;" class="d-flex justify-content-between my-5">
            <div style="width: 700px;">
                <h3 class="fw-bold">Customer Reviews</h3>
                <span class="fw-bold">
                    <img src="/static/images/Rating.jpg" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                    {{ averageRating }}
                </span>
            </div>
            <div class="d-flex flex-wrap">
                <div v-for="review in servreqname" :key="review.id" class="card shadow-sm p-3 m-2" style="width: 400px">
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
                    <p class="mt-2">{{ review.comments || 'No comments available.'}}</p>      
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
            all_services: [],
            servreqname : [],
            selectedServiceId: null,
            showPaymentPortal: false,
            showSlots: false,
            selectedSlot: null,
            availableDates: this.generateNextThreeDays(),
            availableSlots: [],
            selectedDate: null,
            payment: {
                cardNumber: "",
                expiryDate: "",
                cvv: ""
            },
            errors: {
                cardNumber: "",
                expiryDate: "",
                cvv: ""
            }
        }
    },
    computed: {
        averageRating() {
            if (!this.servreqname.length) return 'No reviews yet.';
            let total = this.servreqname.reduce((sum, req) => sum + (req.rating || 0), 0);
            return (total / this.servreqname.length).toFixed(1);
        },
        descRating() {
            if (!this.servreqname.length) return 'No reviews yet.';

            let ratingsMap = {};
            this.servreqname.forEach(req => {
                if (req.service.description in ratingsMap) {
                    ratingsMap[req.service.description].total += req.rating || 0;
                    ratingsMap[req.service.description].count += 1;
                } else {
                    ratingsMap[req.service.description] = { total: req.rating || 0, count: 1 };
                }
            });

            Object.keys(ratingsMap).forEach(desc => {
                ratingsMap[desc] = (ratingsMap[desc].total / ratingsMap[desc].count).toFixed(1);
            });

            return ratingsMap;
        },
        isFormValid() {
            return (
                !this.errors.cardNumber &&
                !this.errors.expiryDate &&
                !this.errors.cvv &&
                this.payment.cardNumber.length === 19 &&
                this.payment.expiryDate.length === 5 &&
                this.payment.cvv.length === 3
            );
        }
    },
    methods: {
        slotSelection(serviceId){
            if (this.selectedServiceId === serviceId) {
                this.selectedServiceId = null;
                this.showSlots = false;
                this.showPaymentPortal = false;
            } else {
                this.selectedServiceId = serviceId;
                this.showSlots = true;
                this.showPaymentPortal = false;
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
        proceedToCheckout(){
            this.showSlots = false;
            this.showPaymentPortal = true;
        },
        validateCardNumber() {
            const regex = /^\d{4} \d{4} \d{4} \d{4}$/;
            if (!regex.test(this.payment.cardNumber)) {
                this.errors.cardNumber = "Card number must be 16 digits (XXXX XXXX XXXX XXXX)";
            } else {
                this.errors.cardNumber = "";
            }
        },
        validateExpiryDate() {
            const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!regex.test(this.payment.expiryDate)) {
                this.errors.expiryDate = "Enter a valid date (MM/YY)";
            } else {
                this.errors.expiryDate = "";
            }
        },
        validateCVV() {
            const regex = /^\d{3}$/;
            if (!regex.test(this.payment.cvv)) {
                this.errors.cvv = "CVV must be 3 digits";
            } else {
                this.errors.cvv = "";
            }
        },
        async confirmPayment(serviceId) {
            const res = await fetch(location.origin+'/api/request/service',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({'service_id': serviceId, 'customer_id': this.$store.state.user_id, 'date_of_request': `${this.selectedDate} ${this.selectedSlot}`})
                })
            const data = await res.json()
            if(res.ok){
                alert('Payment Successful! Your service request is confirmed.');
                this.showPaymentPortal = false;
                this.$router.push('/Customer/bookings')
            }
        },
        async fetchReviews() {
            const res = await fetch(`${location.origin}/api/service_request/${this.name}`, {
                headers: { 'Authentication-Token': this.$store.state.auth_token }
            });
            if (res.ok) {
                this.servreqname = await res.json();
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
            this.all_services = await res.json()
            this.fetchReviews();
        }
    }
}
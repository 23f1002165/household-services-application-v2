export default {
    template: `
        <div style="margin: auto; padding: 20px;">
            <div style="margin-left: 30px; max-width: 1100px;" class="my-5">
                <div style="max-width: 500px;">
                    <h3 class="fw-bold">Overall Customer Ratings</h3>
                </div>
                <div class="container" style="width: 500px; margin-right: 250px; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                    <div class="text-center " v-if="all_requests.length === 0" style="width: 400px; height: 400px;">
                        <h3 class="fw-bold">Analytics and reports</h3>
                        <p class="text-muted m-0">will be available once customers start booking services.</p>
                    </div>    
                    <div v-else class="charts-container" style="width: 400px; height: 400px;">
                        <div class="chart-box">
                            <canvas ref="ratingsChart"></canvas>
                        </div>
                    </div>
                </div>
                <div style="width: 1000px; height: 1px; background-color: black; margin: 20px auto;"></div>
                <div style="max-width: 500px;" class="my-5">
                    <h3 class="fw-bold">Service Requests Summary</h3>
                </div>
                <div class="container" style="width: 600px; height: 500px; margin-right: 200px; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                    <div class="text-center" v-if="all_requests.length === 0" style="width: 500px; height: 300px;">
                        <h3 class="fw-bold">Analytics and reports</h3>
                        <p class="text-muted m-0">will be available once customers start booking services.</p>
                    </div>    
                    <div v-else class="charts-container" style="width: 500px; height: 300px;">
                        <div class="chart-box">
                            <canvas ref="requestsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div style="width: 1100px; height: 5px; background-color: rgb(195, 197, 197); margin: 50px auto;"></div>
        </div>
    `,
    data() {
        return {
            all_requests: [],
            ratingsData: [],
            requestsData: [],
            ratingsChartInstance: null,
            requestsChartInstance: null,
        }
    },
    methods : {
        async fetchStats() {
            const res = await fetch(`${location.origin}/api/request`, {
                headers: {
                    'Authentication-Token' : this.$store.state.auth_token
                },
            });
            const data = await res.json();
            this.all_requests = data;

            const ratingCounts = [0, 0, 0, 0, 0];
            data.forEach((req) => {
                if (req.rating!=null) {
                    if (req.rating >= 1 && req.rating <= 5) {
                        ratingCounts[req.rating - 1]++;
                    }
                }
            });
            this.ratingsData = ratingCounts;
    
            const statusCounts = { requested: 0, assigned: 0, declined: 0, completed: 0, cancelled: 0, closed: 0, started: 0 };
            data.forEach((req) => {
              if (statusCounts.hasOwnProperty(req.status)) {
                statusCounts[req.status]++;
              }
            });
            this.requestsData = Object.values(statusCounts);
    
            this.$nextTick(() => this.renderCharts());
        
        },
        renderCharts(){
            if (this.ratingsChartInstance) this.ratingsChartInstance.destroy();
            if (this.requestsChartInstance) this.requestsChartInstance.destroy();

            const ratingsCanvas = this.$refs.ratingsChart;
            const requestsCanvas = this.$refs.requestsChart;

            if (ratingsCanvas) {
                this.ratingsChartInstance = new Chart(ratingsCanvas, {
                    type: "pie",
                    data: {
                        labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
                        datasets: [
                            {
                                data: this.ratingsData,
                                backgroundColor: ["#FF0000", "#FF6384", "#36A2EB", "#4BC0C0", "#9966FF"],
                            },
                        ],
                    },
                    options: {
                        aspectRatio: 1.1,
                    },
                });
            }
        
            if (requestsCanvas) {
                this.requestsChartInstance = new Chart(requestsCanvas, {
                    type: "bar",
                    data: {
                        labels: ["Requested", "Assigned", "Declined", "Completed", "Cancelled", "Closed", "Started"],
                        datasets: [
                            {
                                data: this.requestsData,
                                backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0", "#FFCE56", "#9966FF", "#8A2BE2", "#FF6384"],
                            },
                        ],
                    },
                    options: {
                        aspectRatio: 1.1,
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                        scales: {
                            x: {
                                grid: { display: false }
                            },
                            y: {
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1,
                                },
                                grid: { display: false }
                            }
                        }
                    },
                });
            }
        },
    },
    async mounted(){
        this.fetchStats();
    }
}
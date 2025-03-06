export default {
  template: `
    <div style="margin: auto; padding: 20px;">
      <div style="margin-left: 50px; max-width: 1100px;" class="d-flex align-items-center justify-content-between my-5">
        <div style="max-width: 500px;">
          <h1 class="fw-bold">Home services at your doorstep</h1>
          <div style="margin-top: 20px; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
            <p class="text-muted">What are you looking for?
              <span style="margin-left: 180px;">
                <button @click="$router.push('/Customer')" style="padding: 10px 20px; border: 1px solid #e0e0e0; background-color: white; color: black; border-radius: 5px; font-size: 14px;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='white'">See all</button>
              </span>
            </p>
          
            <div style="display: flex; gap: 20px; margin-top: 20px;">
              <div @click="$router.push('/service/Plumbing')" style="flex: 1; padding: 15px; display: flex; align-items: center; border-radius: 10px; background-color: #f8f9fa; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);">
                <img src="/static/images/Plumbing.jpg" style="width: 50px; height: 50px; margin-right: 15px;">
                <span style="font-size: 16px; font-weight: 500;">Plumbing</span>
              </div>
              <div @click="$router.push('/service/AC')" style="flex: 1; padding: 15px; display: flex; align-items: center; border-radius: 10px; background-color: #f8f9fa; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);">
                <img src="/static/images/AC.jpg" style="width: 50px; height: 50px; margin-right: 15px;">
                <span style="font-size: 16px; font-weight: 500;">AC & Appliance Repair</span>
              </div>
            </div>

          </div>
        </div>
        <div >
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <img src="/static/images/Home.jpg" style="width: 250px; height: 250px; object-fit: cover; border-radius: 5px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <img src="/static/images/WashingMachine.jpeg" style="width: 250px; height: 250px; object-fit: cover; border-radius: 5px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <img src="/static/images/Cleaning.jpg" style="width: 250px; height: 250px; object-fit: cover; border-radius: 5px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <img src="/static/images/Chimney.jpg" style="width: 250px; height: 250px; object-fit: cover; border-radius: 5px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
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
          <div>
            <h5>For customers</h5>
            <ul style="list-style: none; padding: 0; color: #666;">
              <li @click="$router.push('/Customer')" style="cursor: pointer;">Book a service</li>  
            </ul>
          </div>
          <div>
            <h5>For partners</h5>
            <ul style="list-style: none; padding: 0; color: #666;">
              <li @click="$router.push('/professional/register')" style="cursor: pointer;">Register as a professional</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  `,
}

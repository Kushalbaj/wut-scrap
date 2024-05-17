const puppeteer = require("puppeteer");
const axios = require('axios');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const timeout = 30000; // 30 seconds timeout

    await page.goto("http://tns.uswut.com/main/index.do", {
      waitUntil: "networkidle2",
      timeout: timeout
    });

    // Login
    await page.type("#pUsrId", "ADAS", { timeout: timeout });
    await page.type("#pUsrPwd", "adaexpress1", { timeout: timeout });
    await Promise.all([
      page.click('img[src="/resource/img/img_input_login.gif"]', { timeout: timeout }),
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: timeout }),
    ]);

    console.log("Logged in successfully.");

    // Get cookies
    const cookies = await page.cookies();

    // Format cookies for axios
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    // Define booking numbers
    const bookingNumbers = ['66612577', 'YCH24110365'];

    // Fetch data for each booking number
    for (const number of bookingNumbers) {
      try {
        const response = await axios.get(`http://tns.uswut.com/uiArp06Action/searchBookingStatusList.do?bkgNo=${number}&acssHis=USTIW,0245APP,0346047,ADAS%20API`, {
          headers: {
            'Cookie': cookieString
          },
          timeout: timeout
        });
        console.log(`Data for booking number ${number}:`, response.data);
      } catch (axiosError) {
        console.error(`Error fetching data for booking number ${number}:`, axiosError);
      }
    }

    // Close the browser
    // await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

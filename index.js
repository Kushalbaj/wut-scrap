const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const bookingNumbers = ["66612577", "YCH24110365"]; 
const timeout = 5000; 

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://tns.uswut.com/main/index.do", {
      waitUntil: "networkidle2",
    });
    
    // Login
    await page.type("#pUsrId", "ADAS");
    await page.type("#pUsrPwd", "adaexpress1");
    await Promise.all([
      page.click('img[src="/resource/img/img_input_login.gif"]'),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);
    console.log("Logged in successfully.");

    // Get cookies
    const cookies = await page.cookies();
    const cookieString = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

    // Loop through each booking number
    for (const bookingNumber of bookingNumbers) {
      try {
        // Make HTTP request to get booking status page HTML
        const response = await axios.get(
          `http://tns.uswut.com/uiArp06Action/searchBookingStatusList.do?bkgNo=${bookingNumber}&acssHis=USTIW,0245APP,0346047,ADAS%20API`,
          {
            headers: { Cookie: cookieString },
            timeout: timeout,
          }
        );

        // Load HTML response into Cheerio
        const $ = cheerio.load(response.data);

        // Extract script content containing the result variable
        const scriptContent = $('script')
          .filter((i, el) => $(el).html().includes('var result'))
          .html();

        // Extract the value assigned to the result variable using regex
        const match = scriptContent.match(/var result\s*=\s*(.*?);/);

        // Check if result variable is found
        if (match && match.length > 1) {
          // Parse the result variable value as JSON
          const result = JSON.parse(match[1]);

          // Output the result
          console.log(`Booking Number: ${bookingNumber}`);
          console.log("Result:", result);
        } else {
          console.log(`Booking Number: ${bookingNumber}`);
          console.log("Result variable not found.");
        }
      } catch (error) {
        console.error(`Error fetching data for booking number ${bookingNumber}:`, error);
      }
    }

    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

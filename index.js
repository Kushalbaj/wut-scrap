const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  try {
    // Set timeout for HTTP requests
    const timeout = 30000; // 30 seconds timeout

    // Define booking numbers
    const bookingNumbers = ['66612577', 'YCH24110365', 'DALA39650500','DALA23989200',
    'RICEK6767300',
    'RICEG5961300'];

    // Define session cookie
    const cookie = 'APPJSESSIONID=E0eFynI5Q_JfQeVMt8IaUgA5xX3zokhMwQm5RH1ZvVbMZKeAEE2i!1428823613!-1040080703';

    // Set headers for HTTP requests
    const headers = {
      'Cookie': cookie
    };

    // Loop through each booking number
    for (const bookingNumber of bookingNumbers) {
      // Make HTTP request to get booking status page HTML
      const response = await axios.get(`http://tns.uswut.com/uiArp06Action/searchBookingStatusList.do?bkgNo=${bookingNumber}&acssHis=USTIW,0245APP,0346047,ADAS%20API`, {
        headers: headers,
        timeout: timeout
      });

      // Load HTML response into Cheerio
      const $ = cheerio.load(response.data);

      // Extract script content containing the result variable
      const scriptContent = $('script')
        .filter((i, el) => $(el).html().includes('var result'))
        .html();
        // console.log(scriptContent);

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
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

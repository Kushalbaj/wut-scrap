const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
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

    // Go to Export Inquiry
    await page.waitForSelector("#menu", { timeout: 60000 });
    await page.evaluate(() => {
      const exportInquiry = Array.from(
        document.querySelectorAll("#nav li a")
      ).find((el) => el.innerText.includes("Export Inquiry"));
      if (exportInquiry) {
        exportInquiry.click();
      } else {
        throw new Error("Export Inquiry link not found");
      }
    });
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    console.log("Navigated to Export Inquiry.");

    // Step 4: Insert Booking numbers into the booking field
    const bookingNumbers = ['66612577', 'YCH24110365'];
    await page.type('#bkgNos', { timeout: 30000 });
    await page.evaluate((bookingNumbers) => {
        const bookingNumbersInput = document.querySelector('#bkgNos');
        bookingNumbersInput.value = bookingNumbers.join('\n');
    }, bookingNumbers);

    // Step 5: Click the submit button
    await page.click('a[href="javascript:Submit_OnClick();"]');

    // Wait for navigation to complete
    await page.waitForNavigation();


    // Close the browser
    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

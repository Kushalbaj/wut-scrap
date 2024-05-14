const puppeteer = require("puppeteer");

(async () => {
  try{
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("http://tns.uswut.com/main/index.do");

  //   await page.screenshot({ path: "example.png", fullPage: true });
  //   await page.pdf({ path: "example.pdf", format: "A4" });

  //   const html = await page.content();
  //   console.log(html);

  //   const title = page.evaluate(() => document.title);
  //   console.log(await title);

  //    const text = await page.evaluate(() => document.body.innerText);
  //    console.log(text);

  // const links = await page.evaluate(() => Array.from(document.body.querySelectorAll('a'), (e) => e.href));
  // console.log(links);

  await page.type('#pUsrId', 'ADAS'); 
  await page.type('#pUsrPwd', 'adaexpress1'); 

  await page.click('img[src="/resource/img/img_input_login.gif"]');

  await page.click('a[href="javascript:getContentUrl(&quot;/uiArp05Action/openScreen.do&quot;)"]');
  
  
  await page.waitForNavigation();

  // await browser.close();
  }catch(error){
    console.error('An error occurred: ', error);
  }
})();

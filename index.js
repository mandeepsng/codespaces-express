const express = require('express')
const path = require('path');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.get('/ul-to-pdf', (req, res) => {
  res.render('index');
})

app.get('/demo', (req, res) => {
  res.send('Hello Mandeep !')
})

app.post('/convert-to-pdf', async (req, res) => {
  const url = req.body.url;

  try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Set a white background
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
      await page.evaluate(() => {
          document.body.style.backgroundColor = 'white';
      });

      // Wait for a moment to ensure styles are applied
      await page.waitForTimeout(1000);

      // Generate PDF
      const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          displayHeaderFooter: false  // Set to true if you want headers and footers
      });

      // Close the browser
      await browser.close();

      // Set the response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

      // Send the PDF as the response
      res.send(pdfBuffer);

      console.log(`PDF sent for URL: ${url}`);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

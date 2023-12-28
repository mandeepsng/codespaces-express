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
  res.send('demo testing!')
})

app.post('/convert-to-pdf', async (req, res) => {
  const url = req.body.url ;  // Default URL if not provided
  const outputPath = req.body.output || 'output.pdf';  // Default output path if not provided

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

      // Generate PDF
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

      // Close the browser
      await browser.close();

      // Set the response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${outputPath}`);

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

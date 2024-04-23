var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const axios = require('axios');
const https = require('https');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/scan', async function(req, res, next) {


  async function performVulnerabilityScan(url) {
    const results = [];
    try {
      // Fetch the URL with axios to inspect headers and SSL/TLS certificate
      const response = await axios.get(url, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false // This allows checking insecure SSL/TLS configurations
        })
      });
  
      // 1. Check for Security Headers
      const headers = response.headers;
      const requiredHeaders = ['x-frame-options', 'content-security-policy', 'x-content-type-options'];
      requiredHeaders.forEach(header => {
        if (!headers[header]) {
          results.push({ description: `Missing ${header} header.` });
        }
      });
  
      // 2. SSL/TLS Configuration
      if (response.request.socket) {
        const cert = response.request.socket.getPeerCertificate();
        if (cert && (new Date(cert.valid_to) < new Date())) {
          results.push({ description: 'SSL/TLS certificate expired.' });
        }
        if (cert && cert.bits < 2048) {
          results.push({ description: 'SSL/TLS certificate uses weak encryption (less than 2048 bits).' });
        }
      }
  
      // 3. Common Files and Directories Exposure
      const commonPaths = ['/admin', '/login', '/.git', '/wp-admin'];
      for (let path of commonPaths) {
        try {
          const pathResponse = await axios.get(`${url}${path}`);
          if (pathResponse.status === 200) {
            results.push({ description: `Sensitive directory or file exposed: ${path}` });
          }
        } catch (error) {
          // Ignore errors as these indicate non-existence which is good
        }
      }
    } catch (error) {
      results.push({ description: `Failed to fetch URL: ${url}. Error: ${error.message}` });
    }
  
    return results;
  }

  const data = await performVulnerabilityScan(req.body.url)
  console.log(data)
  res.json({data,success:true})

});

/* GET Scrape page. */
router.post('/scrape', function(req, res, next) {
  async function scrapeWebsiteDetails(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto(url, { waitUntil: 'networkidle2' });
  
    // Extracting various types of information using page.evaluate
    const data = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img')).map(img => img.src);
      const cssFiles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href);
      const jsFiles = Array.from(document.querySelectorAll('script[src]')).map(script => script.src);
      const title = document.title;
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
      const emails = document.body.innerHTML.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g) || [];
  
      // Identify and add more selectors or patterns for other important info as needed
      // Example: const phoneNumber = 'Your logic to extract phone numbers';
  
      return {
        title,
        description,
        keywords,
        images,
        cssFiles,
        jsFiles,
        emails,
        // Include more extracted data here as needed
      };
    });
  
    await browser.close();
  
    return data;
  }

  scrapeWebsiteDetails(req.body.url).then(details => {
    console.log("Data fetched");
  res.json({data:details, success:true})
});
});

module.exports = router;

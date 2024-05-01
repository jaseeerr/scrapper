var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const axios = require('axios');
const https = require('https');
const ffmpeg = require('fluent-ffmpeg');
const youtubeDl = require('youtube-dl-exec');
ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Scan V OLD page. */
router.post('/scanold', async function(req, res, next) {


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

/* GET Scan V page. */
router.post('/scan', async function(req, res, next) {


  async function followRedirects(url, visited = []) {
    try {
        const response = await axios.get(url, {
            maxRedirects: 5, // Disable automatic redirects
            validateStatus: status => status < 400,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
          } // Accept all status codes under 400
        });
        // If no redirect, return the final URL and the chain
        return {
            finalUrl: response.request.res.responseUrl || url,
            visited
        };
    } catch (error) {
        if (error.response && (error.response.status === 301 || error.response.status === 302)) {
            const location = error.response.headers.location;
            visited.push({
                url: url,
                redirectTo: location,
                status: error.response.status
            });
            return followRedirects(location, visited); // Recursively follow redirects
        } else {
            // Return the error if it's not a redirect
            return {
                error: "Failed to fetch URL",
                details: error.message,
                visited
            };
        }
    }
}


  async function performVulnerabilityScan(url) {
    const results = [];
    const agent = new https.Agent({
      rejectUnauthorized: false // Allows checking of insecure SSL/TLS configurations
    });
  
    try {
      const response = await axios.get(url, { httpsAgent: agent });
  
      // Check for Security Headers
      checkSecurityHeaders(response.headers, results);
  
      // SSL/TLS Configuration
      checkSSLCertificate(response.request.socket, results);
  
      // Common Files and Directories Exposure
      await checkCommonPathsExposure(url, results);
  
    } catch (error) {
      results.push({ description: `Failed to fetch URL: ${url}. Error: ${error.message}` });
    }
  
    return results;
  }
  
  function checkSecurityHeaders(headers, results) {
    const requiredHeaders = {
      'x-frame-options': 'X-Frame-Options',
      'content-security-policy': 'Content-Security-Policy',
      'x-content-type-options': 'X-Content-Type-Options',
      'strict-transport-security': 'Strict-Transport-Security'
    };
  
    for (const header in requiredHeaders) {
      if (!headers[header]) {
        results.push({ description: `Missing ${requiredHeaders[header]} header.` });
      }
    }
  }
  
  function checkSSLCertificate(socket, results) {
    if (socket) {
      const cert = socket.getPeerCertificate();
      if (cert) {
        if (new Date(cert.valid_to) < new Date()) {
          results.push({ description: 'SSL/TLS certificate expired.' });
        }
        if (cert.bits < 2048) {
          results.push({ description: 'SSL/TLS certificate uses weak encryption (less than 2048 bits).' });
        }
      }
    }
  }
  
  async function checkCommonPathsExposure(url, results) {
    const commonPaths = ['/admin', '/login', '/.git', '/wp-admin'];
    for (let path of commonPaths) {
      try {
        const pathResponse = await axios.get(`${url}${path}`, { httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
        if (pathResponse.status === 200) {
          results.push({ description: `Sensitive directory or file exposed: ${path}` });
        }
      } catch (error) {
        // Ignore errors as these indicate non-existence which is good
      }
    }
  }

  const data = await performVulnerabilityScan(req.body.url)
  const links = await followRedirects(req.body.url)
  console.log(links)
  console.log(data)
  res.json({data,finalUrl:links.finalUrl,success:true})

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
    
    res.json({data:details, success:true})
    
});
});

/* GET Audio data. */
router.post('/getAudio', async function(req, res, next) {
  

  const { url } = req.body;
  try {
      const videoInfo = await youtubeDl(url, {
          dumpSingleJson: true,
          noPlaylist: true,
      });

      // Set response headers for audio streaming
      res.contentType('audio/mpeg');

      // Use fluent-ffmpeg to process the video URL directly and stream audio
      ffmpeg({ source: videoInfo.url })
          .audioCodec('libmp3lame')
          .toFormat('mp3')
          .on('error', (err) => {
              console.error('An error occurred:', err.message);
              res.status(500).send('Error processing audio');
          })
          .on('end', () => {
              console.log('Audio conversion finished.');
          })
          .pipe(res, { end: true });  // Pipe the output directly to the response object
  } catch (error) {
      console.error('Error processing your request:', error);
      res.status(500).json({ message: 'Error processing your request' });
  }
});


/* GET END LINKS. */
router.post('/check-redirects', async (req, res) => {
  const { url } = req.body;

  async function followRedirects(url, visited = []) {
    try {
        const response = await axios.get(url, {
            maxRedirects: 0, // Disable automatic redirects
            validateStatus: status => status < 400 // Accept all status codes under 400
        });
        // If no redirect, return the final URL and the chain
        return {
            finalUrl: response.request.res.responseUrl || url,
            visited
        };
    } catch (error) {
        if (error.response && (error.response.status === 301 || error.response.status === 302)) {
            const location = error.response.headers.location;
            visited.push({
                url: url,
                redirectTo: location,
                status: error.response.status
            });
            return followRedirects(location, visited); // Recursively follow redirects
        } else {
            // Return the error if it's not a redirect
            return {
                error: "Failed to fetch URL",
                details: error.message,
                visited
            };
        }
    }
}


  const result = await followRedirects(url);
  res.json(result);
});

module.exports = router;

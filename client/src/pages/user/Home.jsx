import React, { useState } from 'react';
import axios from "axios";
import { SERVER_URL } from '../../config/url';
import toast,{Toaster} from "react-hot-toast"
function WebsiteScraper() {
  const [url, setUrl] = useState('');
  const [assets, setAssets] = useState(null);
  const [scanResult,setScanResult] = useState([])
  const [finalUrl,setFinalUrl] = useState(null)

  const handleScrape = async () => {
    try {
       
        await scanV()
        toast.loading("Scaning for assets")
      const response = await axios.post(`${SERVER_URL}/scrape`, { url }); // Ensure you send the URL
      console.log(response);
      toast.dismiss()
      if (response.data.success) {
            toast.success("Files Found")
        setAssets(response.data.data);
      } else {
        console.error('Failed to fetch assets');
      }
    } catch (error) {
        toast.error("Error")
      console.error('Error during fetch:', error);
    }
    
  };

  const scanV = async ()=>{
    try {
        toast.loading("Scaning for Vulnerabilities")
        const response = await axios.post(`${SERVER_URL}/scan`, { url }); // Ensure you send the URL
        console.log(response);
        toast.dismiss()
        if (response.data.success) {
          setScanResult(response.data.data);
          setFinalUrl(response.data.finalUrl)
        } else {
          console.error('Failed to fetch assets');
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
  }

  const getFileName = (url) => {
    return url.substring(url.lastIndexOf('/') + 1) || "Unknown";
  };

  return (

    <>
      <Toaster position="top-center" />

      <div className="container mx-auto px-4">
        <div className="flex justify-center mt-10">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
            className="form-input px-4 py-2 w-full max-w-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
          />
          <button
            onClick={handleScrape}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 ease-in-out"
          >
            Scan URL
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-10">
          {scanResult.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vulnerability Scan Results</h2>
              <ul className="list-disc pl-5 space-y-2">
              {finalUrl && 
                 <li className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                  Final URL : <br />
                <span className='text-xs'>
                {finalUrl}
                </span>
               </li>
                }
                {scanResult.map((result, index) => (
                  <li key={index} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    {result.description}
                  </li>
                ))}
                
              </ul>
            </div>
          )}

          {assets && (
            <div className="bg-white shadow rounded-lg p-6 w-full max-w-4xl">
              <h3 className="text-lg font-semibold mb-4">Assets</h3>
              {[['JS Files', assets.jsFiles], ['CSS Files', assets.cssFiles], ['Images', assets.images]].map(([label, files], idx) => (
                <div key={idx} className="mt-4">
                  <strong>{label}:</strong>
                  <ul className="list-decimal pl-5 space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="break-all">
                        <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">
                          {getFileName(file)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WebsiteScraper;

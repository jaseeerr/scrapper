import React, { useState } from 'react';
import axios from "axios";
import { SERVER_URL } from '../../config/url';
import toast, { Toaster } from "react-hot-toast";

function WebsiteScraper1() {
  const [url, setUrl] = useState('');
  const [jsFiles, setJsFiles] = useState([]);
  const [cssFiles, setCssFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [scanResult, setScanResult] = useState([]);
  const [finalUrl, setFinalUrl] = useState(null);
  const [title,setTitle] = useState(null)
  const [description,setDescription] = useState(null)
  const [keywords,setKeywords] = useState(null)
  const [email,setEmail] = useState([])

  // title,
  // description,
  // keywords,

  const handleScrape = async () => {
    try {
      setJsFiles([])
setCssFiles([])
setImages([])
setScanResult([])
setEmail([])
setFinalUrl(null)
setTitle(null)
setDescription(null)
setKeywords(null)
      await scanV();
      toast.loading("Scanning for assets");
      const response = await axios.post(`${SERVER_URL}/scrape`, { url }); // Ensure you send the URL
      console.log(response);
      toast.dismiss();
      if (response.data.success) {
        toast.success("Files Found");
        console.log(response)
        const { jsFiles, cssFiles, images,keywords,description,title ,emails } = response.data.data;
        setJsFiles(jsFiles);
        setCssFiles(cssFiles);
        setImages(images);
        setKeywords(keywords)
        setDescription(description)
        setTitle(title)
        setEmail(emails)
      } else {
        console.error('Failed to fetch assets');
      }
    } catch (error) {
      toast.error("Error");
      console.error('Error during fetch:', error);
    }
  };

  const scanV = async () => {
    try {
      toast.loading("Scanning for Vulnerabilities");
      const response = await axios.post(`${SERVER_URL}/scan`, { url }); // Ensure you send the URL
      console.log(response);
      toast.dismiss();
      if (response.data.success) {
        setScanResult(response.data.data);
        setFinalUrl(response.data.finalUrl);
      } else {
        console.error('Failed to fetch assets');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

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
                    <span className='text-xs flex flex-wrap'>
                      {finalUrl}
                    </span>
                  </li>
                }
                 {description &&
                  <li className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                    Description : <br />
                    <span className='text-xs flex flex-wrap'>
                      {description}
                    </span>
                  </li>
                }

               {email &&
                  <li className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                    Emails : <br />
                    <span className='text-xs flex flex-wrap'>
                      {email.map((x)=><p>{x + " , "}</p>)}
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

          {jsFiles.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6 w-full max-w-4xl">
              <h3 className="text-lg font-semibold mb-4">JS Files</h3>
              {/* <ul className="list-decimal pl-5 space-y-2">
                {jsFiles.map((file, index) => (
                  <li key={index} className="break-all">
                    <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">
                      {getFileName(file)}
                    </a>
                  </li>
                ))}
              </ul> */}

              <div className='flex flex-wrap mx-2'>
              {jsFiles.map((file, index) => (
                  <a href={file} className='ml-3' target='_blank'>
                    <span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60" fill="rgba(240,187,64,1)"><path d="M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM13.3344 16.055C14.0531 16.6343 14.7717 16.9203 15.4904 16.913C15.9304 16.913 16.2677 16.8323 16.5024 16.671C16.7297 16.517 16.8434 16.297 16.8434 16.011C16.8434 15.7177 16.7297 15.4683 16.5024 15.263C16.2677 15.0577 15.8241 14.8523 15.1714 14.647C14.3867 14.4197 13.7817 14.1263 13.3564 13.767C12.9384 13.4077 12.7257 12.9053 12.7184 12.26C12.7184 11.6513 12.9824 11.1417 13.5104 10.731C14.0237 10.3203 14.6801 10.115 15.4794 10.115C16.5941 10.115 17.4887 10.3863 18.1634 10.929L17.3934 12.128C17.1221 11.9153 16.8104 11.7613 16.4584 11.666C16.1064 11.556 15.7911 11.501 15.5124 11.501C15.1311 11.501 14.8267 11.5707 14.5994 11.71C14.3721 11.8493 14.2584 12.0327 14.2584 12.26C14.2584 12.5093 14.3977 12.722 14.6764 12.898C14.9551 13.0667 15.4317 13.2537 16.1064 13.459C16.9204 13.701 17.4997 14.0237 17.8444 14.427C18.1891 14.8303 18.3614 15.3437 18.3614 15.967C18.3614 16.605 18.1157 17.155 17.6244 17.617C17.1404 18.0717 16.4364 18.31 15.5124 18.332C14.3024 18.332 13.2904 17.969 12.4764 17.243L13.3344 16.055ZM7.80405 16.693C8.03872 16.8397 8.32105 16.913 8.65105 16.913C8.99572 16.913 9.28172 16.814 9.50905 16.616C9.73639 16.4107 9.85005 16.055 9.85005 15.549V10.247H11.3351V15.835C11.3131 16.7003 11.0637 17.3237 10.5871 17.705C10.3157 17.9323 10.0187 18.0937 9.69605 18.189C9.37339 18.2843 9.06172 18.332 8.76105 18.332C8.21105 18.332 7.72339 18.2367 7.29805 18.046C6.84339 17.8407 6.46205 17.4777 6.15405 16.957L7.18805 16.11C7.37872 16.3667 7.58405 16.561 7.80405 16.693Z"></path></svg>
                  <p className='text-center hover:text-blue-500'>  JS FILE</p>
                  </span>
                  </a>
                ))}
               
              </div>
            </div>
          )}

          {cssFiles.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6 w-full max-w-4xl">
              <h3 className="text-lg font-semibold mb-4">CSS Files</h3>
              {/* <ul className="list-decimal pl-5 space-y-2">
                {cssFiles.map((file, index) => (
                  <li key={index} className="break-all">
                    <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">
                      {getFileName(file)}
                    </a>
                  </li>
                ))}
              </ul> */}

              <div className='flex flex-wrap mx-2'>
              {cssFiles.map((file, index) => (
                  <a href={file} className='ml-3' target='_blank'>
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="60" height="60" viewBox="0 0 100 100">
<path d="M51.958,98c-0.58,0-1.16-0.078-1.724-0.232l-27.742-7.702c-2.593-0.72-4.495-3.004-4.735-5.685	l-6.179-69.304c-0.16-1.813,0.451-3.621,1.677-4.962C14.485,8.77,16.233,8,18.053,8h67.895c1.821,0,3.569,0.771,4.798,2.115	c1.225,1.339,1.837,3.147,1.677,4.959L86.236,84.37c-0.24,2.683-2.145,4.967-4.739,5.686l-27.803,7.709	C53.124,97.921,52.542,98,51.958,98z" opacity=".35"></path><path fill="#f2f2f2" d="M49.958,96c-0.58,0-1.16-0.078-1.724-0.232l-27.742-7.702c-2.593-0.72-4.495-3.004-4.735-5.685	L9.578,13.077c-0.16-1.813,0.451-3.621,1.677-4.962C12.485,6.77,14.233,6,16.053,6h67.895c1.821,0,3.569,0.771,4.798,2.115	c1.225,1.339,1.837,3.147,1.677,4.959L84.236,82.37c-0.24,2.683-2.145,4.967-4.739,5.686l-27.803,7.709	C51.124,95.921,50.542,96,49.958,96z"></path><polygon fill="#2b59a1" points="83.947,12.5 77.762,81.792 49.958,89.5 22.231,81.803 16.053,12.5"></polygon><path fill="#40396e" d="M49.958,91c-0.135,0-0.27-0.019-0.401-0.055L21.83,83.249c-0.602-0.167-1.037-0.689-1.093-1.312	l-6.179-69.303c-0.037-0.419,0.104-0.835,0.388-1.146C15.23,11.177,15.632,11,16.053,11h67.895c0.421,0,0.822,0.177,1.106,0.488	c0.284,0.311,0.425,0.726,0.388,1.146l-6.186,69.292c-0.056,0.622-0.491,1.145-1.094,1.312l-27.804,7.709	C50.228,90.982,50.093,91,49.958,91z M23.634,80.635l26.324,7.309l26.402-7.32L82.308,14H17.692L23.634,80.635z"></path><polygon fill="#2785bd" points="72.467,77.38 77.771,17.957 50,17.957 50,83.608"></polygon><polygon fill="#d9eeff" points="50,43.957 51,47.957 50,51.957 30.94,51.957 30.23,43.957"></polygon><polygon fill="#d9eeff" points="50,26.957 51,30.957 50,34.957 29.441,34.957 28.72,26.957"></polygon><polygon fill="#d9eeff" points="51,69.957 50,74.796 32.55,69.967 31.39,56.957 39.92,56.957 40.5,63.397 50,65.957"></polygon><path fill="#f2f2f2" d="M50,26.957v8h11.969l-0.807,9H50c-0.009-0.002-0.008,8-0.008,8h10.485l-1.027,11.44L50,65.957v8.84	l17.4-4.83l0.12-1.44l2-22.37l0.21-2.29l1.5-16.91H50z"></path>
</svg>                  <p className='text-center hover:text-blue-500'>  CSS FILE</p>
                  </span>
                  </a>
                ))}
               
              </div>


            </div>
          )}

          {images.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6 w-full max-w-4xl">
              <h3 className="text-lg font-semibold mb-4">Images</h3>
              {/* <ul className="list-decimal pl-5 space-y-2">
                {images.map((file, index) => (
                  <li key={index} className="break-all">
                    <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">
                      {getFileName(file)}
                    </a>
                  </li>
                ))}
              </ul> */}

              <div className='flex flex-wrap mx-2'>
              {images.map((file, index) => (
                  <a href={file} className='ml-3 my-4' target='_blank'>
                    <span>
                     <img src={file} alt="" className='w-28 h-28' />                
                     <p className='text-center hover:text-blue-500'>  IMAGE FILE</p>
                  </span>
                  </a>
                ))}
               
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WebsiteScraper1;

import React, { useState } from 'react';
import { SERVER_URL } from '../../config/url';

const DownloadAudioPage = () => {
    const [url, setUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadLink, setDownloadLink] = useState('');

    const handleInputChange = (event) => {
        setUrl(event.target.value);
        setDownloadLink(''); // Reset download link on URL change
    };

    const handleDownload = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch(`${SERVER_URL}/getAudio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            const data = await response.json();
            if (response.ok) {
                setDownloadLink(data.downloadUrl);
            } else {
                throw new Error(data.message || 'Failed to extract audio');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process the URL. Please make sure it is correct.');
        }
        setIsProcessing(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Download Audio from URL</h1>
                <input
                    type="text"
                    placeholder="Enter YouTube URL here..."
                    value={url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded focus:outline-none focus:ring"
                />
                <button
                    onClick={handleDownload}
                    disabled={isProcessing}
                    className={`w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isProcessing ? 'Processing...' : 'Fetch Audio'}
                </button>
                {downloadLink && (
                    <a
                        href={downloadLink}
                        download
                        className="w-full px-4 py-2 text-center text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:ring"
                    >
                        Download
                    </a>
                )}
            </div>
        </div>
    );
};

export default DownloadAudioPage;

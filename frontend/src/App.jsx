import React, { useState } from 'react';
import axios from 'axios';
export default function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShortenUrl = async (e) => {
    //e.preventDefault(); // prevent page reload
   axios.post('http://localhost:8080/api/short', { originalUrl })
   .then((res)=>{
    setShortUrl(res.data);
    console.log('"api response"',res.data);
  })
   .catch((err)=>{
    console.error('Error shortening URL:', err);
   })
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-purple-600 bg-[repeating-linear-gradient(45deg,#6c63ff,#6c63ff_10px,#5a54d1_10px,#5a54d1_20px)]">

      <div className='bg-gray-200 p-8 rounded-lg shadow-md w-full max-w-lg'>
        <h1 className='text-3xl font-bold mb-6 text-blue-600 text-center'>URL Shortener</h1>
        
        <div onSubmit={handleShortenUrl} className='flex flex-col space-y-4'>
          <input
            type="text"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Enter URL"
            required
            className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={handleShortenUrl}
            type="submit"
            className='bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200'
          >
            Shorten URL
          </button>

          {
            shortUrl && (
              <div className='mt-4 p-4 bg-green-100 border border-green-400 rounded-lg'>
                <p className='text-green-800 ml-38'>Shortened URL:</p>
                <a href={shortUrl?.shortUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className='text-blue-600 underline  justify-center items-center ml-25 break-all'>
                  {shortUrl?.shortUrl}
                </a>
                {shortUrl && <img src={shortUrl.qrCodeimg} 
                alt="QR Code" 
                className="mt-4 w-32 h-32 ml-35" />}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
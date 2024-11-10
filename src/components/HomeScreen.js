import React from 'react'
import { Link } from 'react-router-dom';

const HomeScreen = () => {
return (
    <>
        <div className="overflow-auto">
            <div className='flex w-full justify-between'>
                <div className="px-32 mt-12 w-1/3">
                    <Link to="/search">
                        <div className="border border-indigo-500 hover:bg-indigo-100 py-4 text-center font-semibold flex justify-center items-center rounded-full">
                            <span>Try entering Name</span>
                        </div>
                    </Link>
                </div>
                <div className="px-32 mt-12 w-1/3">
                    <Link to="/chatbot">
                    <div className="border border-indigo-500 hover:bg-indigo-100 py-4 text-center font-semibold flex justify-center items-center rounded-full">
                        <span>Try using Chatbot</span>
                    </div>
                    </Link>
                </div>
                <div className="px-32 mt-12 w-1/3">
                    <Link to="/ocr">
                    <div className="border border-indigo-500 hover:bg-indigo-100 py-4 text-center font-semibold flex justify-center items-center rounded-full">
                        <span>Try using Scanner</span>
                    </div>
                    </Link>
                </div>
                </div>
        </div>
  </>
  )
}

export default HomeScreen
import Link from 'next/link';
import React from 'react'

const NavBar = () => {
  return (
    <div className='bg-gray-200'>
    <div className='container mx-auto'>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-white-900 mb-4 md:mb-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span className="ml-3 text-xl">Tailblocks</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-end">
          <Link href="/" className="mr-5 hover:text-gray-900">Home</Link>
          <Link href="/articles" className="mr-5 hover:text-gray-900">Articles</Link>
          <Link href="/products" className="mr-5 hover:text-gray-900">Product</Link>
          <Link href="/contactUs" className="mr-5 hover:text-gray-900">Contact Us</Link>
        </nav>
        </div>
      </header>
    </div>
    </div>
  )
}

export default NavBar

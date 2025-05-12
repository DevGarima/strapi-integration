import Link from 'next/link';
import React from 'react'

const Promotion = (props) => {
  const { data: promotionData = [] } = props || {};
  const strapi_url = process.env.NEXT_PUBLIC_STRAPI_URL;

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 h-auto text-white overflow-hidden">
      {promotionData.map((promotion, index) => (
        <Link href={`/${promotion?.link || ''}`} key={index}>
        <div className="relative" key={index}>
          <img
            src={`${strapi_url}/admin/${promotion?.banner?.url}`}
            alt={`Banner ${index + 1}`}
            className="object-cover object-center w-full"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
            <h1 className="text-5xl font-bold leading-tight mb-4">{promotion?.title}</h1>
            <p className="text-lg text-gray-300 mb-8">{promotion?.description}</p>
          </div>
        </div>
        </Link>
      ))}
    </div>
  )
}

export default Promotion

'use client'; // Mark this file as a Client Component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const strapi_url = process.env.NEXT_PUBLIC_STRAPI_URL;

async function fetchProducts() {
  const response = await fetch(`${strapi_url}/api/products`);
  const data = await response.json();

  return data.data;
}

export default function Products() {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    }

    getProducts();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-4">
          {(products || []).map((product, index) => {
            const { shopifyProduct = {} } = product;
            return (
              <div className="p-4 md:w-1/3" key={`product-${index}`}>
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                  <img
                    className="lg:h-48 md:h-36 w-full object-contain object-center"
                    src={
                      shopifyProduct?.images?.length
                        ? shopifyProduct?.images[0].src
                        : `${strapi_url}/admin/${product?.image?.[0]?.url}`
                    }
                    alt="product"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                      CATEGORY: {product?.categories?.[0]?.name}
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      {shopifyProduct?.title}
                    </h1>
                    <p
                      key={`product-description-${index}`}
                      dangerouslySetInnerHTML={{
                        __html: shopifyProduct.body_html || '',
                      }}
                    ></p>
                    <div className="flex items-center flex-wrap">
                      <Link
                        href={`/products/${product?.slug || ''}`}
                        className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
                      >
                        Buy Now
                        <svg
                          className="w-4 h-4 ml-2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                      <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                        {shopifyProduct?.variants[0]?.inventory_quantity} in stock
                      </span>
                      <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                        Price: {shopifyProduct?.variants[0]?.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
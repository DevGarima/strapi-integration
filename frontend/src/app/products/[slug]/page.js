'use client'; // Mark this file as a Client Component

import React, { useState, useEffect, use } from 'react';

const strapi_url = process.env.NEXT_PUBLIC_STRAPI_URL;

async function getProductBySlug(slug) {
  const response = await fetch(`${strapi_url}/api/products?filters[slug][$eq]=${slug}&populate=*`);
  const data = await response.json();
  return data.data[0]; // Assuming the slug is unique and returns one product
}

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams; // Extract slug from the dynamic route
  const [product, setProduct] = useState(null); // State to store the product
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    async function getProduct() {
      setLoading(true);
      const fetchedProduct = await getProductBySlug(slug);
      setProduct(fetchedProduct);
      setLoading(false);
    }

    getProduct();
  }, [slug]); // Re-run the effect if the slug changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  const { shopifyProduct = {} } = product;
  const sizes = product.size ? [product.size] : [];

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img
            alt="ecommerce"
            className="lg:w-1/3 w-full lg:h-auto h-12 object-cover object-center rounded"
            src={
              shopifyProduct?.images?.length
                ? shopifyProduct?.images[0].src
                : `${strapi_url}/admin/${product?.image?.[0]?.url}`
            }
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {shopifyProduct?.title}
            </h1>
            <p
              key={`product-description-${slug}`}
              dangerouslySetInnerHTML={{ __html: shopifyProduct.body_html || '' }}
            ></p>
            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              <div className="flex">
                <span className="mr-3">Available Quantity</span>
                {shopifyProduct?.variants[0]?.inventory_quantity}
              </div>
              <div className="flex ml-6 items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <select className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
                    {sizes.map((size, index) => (
                      <option key={`size-${index}`} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">
                Price: {shopifyProduct?.variants[0]?.price}
              </span>
              <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                Buy Now
              </button>
            </div>
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              CATEGORY: {product?.categories?.[0]?.name}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
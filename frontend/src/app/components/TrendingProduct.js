import Link from "next/link";

export default function TrendingProduct(props) {
  const { data: trendingData } = props || {};
  const { products } = trendingData[0] || {};
  const strapi_url = process.env.NEXT_PUBLIC_STRAPI_URL;

  return (
    <section className="text-gray-600 body-font">
      <h1 className="title-font text-2xl font-bold text-gray-900 ml-10 decoration-indigo-500 mt-4">
        More to Shop
      </h1>
      <hr className="border-grey-500 border-t-2 w-1/4 ml-10 mt-2 mb-4" />
      <div className="container py-3 mx-auto">
        <div className="flex flex-wrap -m-1">
          {
            products?.map((product, index) => {
              const { shopifyProduct } = product || {};
              return (
                <div className="p-4 md:w-1/3" key={`trending-${index}`}>
                  <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden bg-gray-50">
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
                    <Link href={`/products/${product?.slug || ''}`}>
                      <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      {shopifyProduct?.title}
                      </h1>
                    </Link>
                    <p
                      key={`product-description-${index}`}
                      dangerouslySetInnerHTML={{
                      __html: shopifyProduct?.body_html || '',
                      }}
                    ></p>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </section>
  );
}
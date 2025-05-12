import Link from "next/link";

export default function FeatureSection(props) {
  const { data: featuredData = [] } = props || {};
  const strapi_url = process.env.NEXT_PUBLIC_STRAPI_URL;

  return (
    <div className="flex flex-wrap mx-auto w-full justify-center">
      {(featuredData || []).map((item, index) => {
        const { title, description, icon = {}, buttonLabel, buttonLink } = item || {};

        // Extract text from description if it's an object
        const descriptionText = Array.isArray(description)
          ? description
              .flatMap((desc) => desc.children || [])
              .filter((child) => child.type === "text")
              .map((child) => child.text)
              .join(" ")
          : description;

        return (
          <div
            className="p-4 lg:w-[32%] md:w-[45%] sm:w-[94%] w-[100%]"
            key={`featured-${index}`}
          >
            <div
              className="h-[500px] bg-gray-100 bg-opacity-75 rounded-lg overflow-hidden relative flex items-center justify-center text-center"
              style={{
                backgroundImage: `url(${strapi_url}/admin/${icon?.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Adjusted overlay for better visibility */}
              <div className=" bg-opacity-40 absolute inset-0"></div>
              <div className="relative z-10 text-white px-6">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-300 mb-2">
                  {item.category || "CATEGORY"}
                </h2>
                <h1 className="title-font sm:text-2xl text-xl font-bold mb-4">
                  {title || "Default Title"}
                </h1>
                <p className="leading-relaxed text-base mb-4">
                  {descriptionText || "Default description for this feature section."}
                </p>
                <Link
                  href={`/${buttonLink}`}
                  className="text-white inline-flex items-center md:mb-2 lg:mb-0"
                >
                    {buttonLabel}
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
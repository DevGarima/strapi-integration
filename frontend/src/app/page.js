import DynamicComponent from "./components/DynamicComponent";

const strapi_url = process.env.NEXT_PUBLIC_STRAPI_URL;

async function fetchHomePage() {
  const response = await fetch(`${strapi_url}/api/homepage/custom`, {
    headers: {
      "Content-Type": "application/json",
    },
  });  

  const data = await response.json();
  return data;
}


export default async function HomePage() {
  const homepage = await fetchHomePage() || [];

  const finalSections = homepage.reduce((acc, item) => {
    const componentType = item.__component;
      const existingGroup = acc.find((group) => group.__component === componentType);
  
    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      acc.push({
        __component: componentType,
        items: [item],
      });
    }
  
    return acc;
  }, []);

  return (
    <main>
      {finalSections?.map((component, index) => (
        <DynamicComponent key={index} component={component?.items} componentName={component?.__component} />
      ))}
    </main>
  );
}
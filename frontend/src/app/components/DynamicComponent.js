import Home from "./Home";
import FeatureSection from "./FeatureSection";
import TrendingProduct from "./TrendingProduct";
import Promotion from "./Promotion";

export default function DynamicComponent(props) {
  const { component, componentName } = props;
  switch (componentName) {
    case "shared.home":
      return <Home data={component[0]}/>;
    case "shared.feature-section":
      return <FeatureSection data={component} />;
    case "shared.promotion":
      return <Promotion data={component} />;
    case "shared.trending-products":
      return <TrendingProduct data={component} />;
    default:
      return null;
  }
}
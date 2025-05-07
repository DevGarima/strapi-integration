import Home from "./Home";
import FeatureSection from "./FeatureSection";

export default function DynamicComponent(props) {
  const { component, componentName } = props;
  switch (componentName) {
    case "shared.home":
      return <Home data={component[0]}/>;
    case "shared.feature-section":
      return <FeatureSection data={component} />;
    default:
      return null;
  }
}
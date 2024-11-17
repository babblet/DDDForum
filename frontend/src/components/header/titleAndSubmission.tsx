import { Link } from "react-router-dom";

export const TitleAndSubmission = () => (
  <div id="title-container">
    <h1>Domain-Driven Designers</h1>
    <h3>Where awesome domain driven designers are made</h3>
    <Link to={"/submit"}>submit</Link>
  </div>
);

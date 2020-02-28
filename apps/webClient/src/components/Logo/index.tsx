import React from "react";

interface Props {}

const logo = `${process.env.PUBLIC_BUCKET}/fd-logo.png`;

const Logo: React.FC<Props> = ({}) => {
  // inline is temporary, will change with SVG
  return <img src={logo} alt="Future Days" style={{ height: "100px" }} />;
};

export default Logo;

import React from "react";
import { Divider } from "antd";
import { Socials, BottomLinks } from ".";

export default function Footer() {
  return (
    //prettier-ignore
    <div className="container mx-auto mt-20 mb-3">
      <Socials />
      <Divider style={{ backgroundColor: "black" }} />
      <BottomLinks/>
    </div>
  );
}

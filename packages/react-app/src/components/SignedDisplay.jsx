import { Alert, Button } from "antd";
import React, { useState, useEffect } from "react";

function SignatureDisplay({
  NETWORKCHECK,
  address,
  localChainId,
  selectedChainId,
  targetNetwork,
  USE_NETWORK_SELECTOR,
  ready,
  ready2,
  sData,
  uMessage,
}) {
  const [visit, setVisit] = useState(localStorage.getItem("visited-profile") === "true");
  const [closed, setClosed] = useState(false);

  let signatureDisplay = "";
  if (ready && address && sData && visit == false && closed == false) {
    const filteredData = sData.filter(entry => entry.recipient.includes(address));
    if (filteredData[0] && filteredData[0].recipient.includes(address) == true && filteredData[0].msg != uMessage) {
      signatureDisplay = (
        <div
          className="absolute w-1/2 xs:w-1/3 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 bg-green-400 left top-14 text-2xs sm:text-sm md:text-md mx-2 sm:mx-8 sm:my-4 rounded overflow-hidden content-center shadow-2xl px-5 py-3"
          style={{ zIndex: 2, position: "absolute", padding: 8 }}
        >
          <div>
            <a className="absolute top-0 left-1 sm:left-2 text-black" onClick={() => setClosed(true)}>
              x
            </a>
          </div>
          👀 Message, anon!
          <div className="text-white my-2">
            Visit your{" "}
            <a href="/profile" rel="noreferrer" onClick={localStorage.setItem("visited-profile", true)}>
              Profile
            </a>{" "}
            <br /> to update your token!
          </div>
        </div>
      );
    } else {
      const signatureDisplay = "";
    }
  } else {
    signatureDisplay = USE_NETWORK_SELECTOR ? null : (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }} />
    );
  }

  return signatureDisplay;
}

export default SignatureDisplay;

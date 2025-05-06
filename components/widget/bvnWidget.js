import React from "react";
import Dojah from "react-dojah";

const BvnWidget = () => {
  const appID = process.env.NEXT_DOJAH_APPID;

  const publicKey = process.env.NEXT_DOJAH_API_KEY;

  const type = "custom";

  const config = {
    widget_id: process.env.NEXT_DOJAH_WIDGET_ID, //this is generated from easyonboard here https://app.dojah.io/easy-onboard
  };

  const userData = {
    first_name: "ola", //Optional
    last_name: "John", //Optional

    email: "ola@gmail.com", //optional
  };

  const govData = {
    bvn: "22477978394",
  };

  const metadata = {
    user_id: "121",
  };

  /**
   * @param {String} type
   * This method receives the type
   * The type can only be one of:
   * loading, begin, success, error, close
   * @param {String} data
   * This is the data from doja
   */
  const response = (type, data) => {
    console.log(type, data);
    if (type === "success") {
    } else if (type === "error") {
    } else if (type === "close") {
    } else if (type === "begin") {
    } else if (type === "loading") {
      console.log(data);
    }
  };

  // The Dojah library accepts 3 props and
  // initiliazes the doja widget and connect process
  return (
    <Dojah
      response={response}
      appID={appID}
      publicKey={publicKey}
      type={type}
      config={config}
      userData={userData}
      govData={govData}
      metadata={metadata}
    />
  );
};

export default BvnWidget;

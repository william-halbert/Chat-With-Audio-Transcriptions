import React from "react";
import Header from "./HeaderLanding";

export default function Pricing() {
  const giveCredits = true;
  const sectionStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px",
    borderRadius: "25px",
    minWidth: "15vw",
    justifyContent: "start",
    boxShadow: "1px 1px 15px rgba(0,123,255, .8)",
    margin: "24px",
    paddingTop: "10vh",
    paddingBottom: "10vh",
    textAlign: "center",
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: "16vh" }}></div>
      <div style={{ marginLeft: "5vw", marginRight: "5vw" }}>
        <h1 style={{ fontSize: "42px" }}>Usage-Based </h1>
        <ul>
          <li style={{ fontSize: "28px", marginTop: "4px" }}>
            Transcriptions and chats (OpenAI APIs) are usage-based costs,
            charged per request
          </li>
          <li style={{ fontSize: "28px", marginTop: "4px" }}>
            Buy credits to be able to use these functionalities
          </li>
          <li style={{ fontSize: "28px", marginTop: "4px" }}>
            For example, a 40-minute lecture with 5 questions would be $1 worth
            of credits
          </li>
        </ul>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "90vw",
          marginLeft: "5vw",
          marginTop: "8vh",
        }}
      >
        {giveCredits ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px",
                borderRadius: "25px",
                minWidth: "15vw",
                justifyContent: "start",
                margin: "24px",
                paddingTop: "10vh",
                paddingBottom: "10vh",
                textAlign: "center",
                boxShadow: "1px 1px 15px rgba(221,221,221, .8)",
              }}
            >
              <h1 style={{ fontSize: "54px" }}>Free</h1>
              <h2 style={{ fontSize: "30px", maxWidth: "250px" }}>
                $0.50 in credit upon signing up
              </h2>
            </div>
          </>
        ) : (
          ""
        )}
        <div style={sectionStyle}>
          <h1 style={{ fontSize: "54px" }}>$0.02</h1>
          <h2 style={{ fontSize: "30px", maxWidth: "250px" }}>
            per minute of audio
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "25px",
            justifyContent: "center",
            margin: "24px",

            textAlign: "center",
            padding: "10vh 5vw",
            boxShadow: "1px 1px 15px rgba(0,123,255, .8)",
            width: "400px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "36px " }}>$0.005 /</h1>
            <h1 style={{ fontSize: "24px " }}>1k tokens input</h1>
            <h1 style={{ fontSize: "36px ", marginTop: "24px" }}>$0.007 /</h1>
            <h1 style={{ fontSize: "24px" }}>1k tokens output</h1>
          </div>
        </div>
      </div>
    </>
  );
}

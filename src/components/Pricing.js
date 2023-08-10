import React from "react";
import Header from "./HeaderLanding";
import "./Pricing.css";

export default function Pricing() {
  const giveCredits = true;
  const sectionStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "25px",
    minWidth: "15vw",
    justifyContent: "center",
    boxShadow: "1px 1px 15px rgba(0,123,255, .8)",
    margin: "24px",
    padding: "10vh 3vw",
    textAlign: "center",
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: "16vh" }}></div>
      <div style={{ marginLeft: "5vw", marginRight: "5vw" }}>
        <h1 className="pricing-h1" style={{ fontSize: "42px" }}>
          Usage-Based{" "}
        </h1>
        <ul>
          <li
            className="pricing-li"
            style={{ fontSize: "28px", marginTop: "4px" }}
          >
            Transcriptions and chats (OpenAI APIs) are usage-based costs,
            charged per request
          </li>
          <li
            className="pricing-li"
            style={{ fontSize: "28px", marginTop: "4px" }}
          >
            Buy credits to be able to use these functionalities
          </li>
          <li
            className="pricing-li"
            style={{ fontSize: "28px", marginTop: "4px" }}
          >
            1,000 tokens is about 750 words
          </li>
        </ul>
      </div>
      <div
        className="pricing-numbers"
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
              className="pricing-free-credits"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "25px",
                minWidth: "15vw",
                justifyContent: "center",
                margin: "24px",
                padding: "10vh 3vw",
                textAlign: "center",
                boxShadow: "1px 1px 15px rgba(221,221,221, .8)",
              }}
            >
              <h1 style={{ fontSize: "54px" }}>Free</h1>
              <h2
                className="pricing-free-credits-h2"
                style={{ fontSize: "30px", maxWidth: "250px" }}
              >
                $0.50 in credit upon signing up
              </h2>
            </div>
          </>
        ) : (
          ""
        )}
        <div style={sectionStyle} className="pricing-audio">
          <h1 style={{ fontSize: "54px" }}>$0.02</h1>
          <h2 style={{ fontSize: "30px", maxWidth: "250px" }}>
            per minute of audio
          </h2>
        </div>
        <div
          className="pricing-tokens"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "25px",
            justifyContent: "center",
            margin: "24px",

            textAlign: "center",
            padding: "10vh 3vw",
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

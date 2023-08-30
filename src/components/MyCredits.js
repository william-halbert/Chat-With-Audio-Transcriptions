import React, { useEffect, useState } from "react";
import Header from "./HeaderLanding";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Checkout from "./Checkout";
import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { getDatabase } from "firebase/database";
import "./MyCredits.css";

export default function MyCredits() {
  const [productId, setProductId] = useState();
  const [plan, setPlan] = useState(null);
  const [hoursRemaining, setHoursRemaining] = useState(null);

  const { getUser } = useAuth();
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();

  /*
  useEffect(() => {
    getUser(user.uid).then((userData) => {
      console.log(userData);
      if (userData) {
        setCredits(userData.credits / 100);
        console.log("Set Credits to ", userData.credits / 100);
      }
    });
  }, []);*/
  return (
    <>
      <Header />
      <div style={{ margin: "14vh 5vw" }}>
        <div
          className="my-credits-hero"
          style={{
            borderRadius: "15px",
            padding: "36px",
            maxWidth: "60vw",
            margin: "0 auto",
            boxShadow: "1px 1px 15px rgba(0,123,255, .4)",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
            }}
          >
            Your Plan
          </h1>
          <h1
            style={{
              fontSize: "28px",
              color: "#007BFF",
            }}
          >
            Basic
          </h1>
          {hoursRemaining || hoursRemaining == 0 ? (
            <h1
              style={{
                fontSize: "28px",
              }}
            >
              10 hours, 33 minutes remaining (this month)
            </h1>
          ) : (
            <h1
              style={{
                fontSize: "28px",
              }}
            >
              Loading your remaining amount of transcription time
            </h1>
          )}
          <h2
            style={{
              fontSize: "36px",
              marginTop: "64px",
            }}
          >
            Pick your plan
          </h2>

          <div
            className="my-credits-select div"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
            }}
          >
            <div
              className="my-credits-select-div"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <select
                className="my-credits-select"
                style={{
                  padding: " 10px",
                  borderRadius: "15px",
                  fontSize: "28px",
                  marginRight: "36px",
                  minWidth: "200px",
                }}
                placeholder="Pick your plan"
                type=""
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="" disabled selected>
                  Your choices
                </option>
                <option value="price_1NkpcgJ7QtFqMwlQqy2Ofg0q">Basic</option>
                <option value="price_1Nkpd9J7QtFqMwlQXI6y8sk6">Premium</option>
                <option value="price_1NkpdUJ7QtFqMwlQy3ez0cW2">Pro</option>
              </select>

              <Checkout productId={productId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import Header from "./HeaderLanding";
import "./Pricing.css";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert, Modal } from "react-bootstrap";
import Footer from "./Footer";
import Checkout from "./Checkout";

export default function Pricing() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleGetThis = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/my-credits");
    } else {
      setShowSignupModal(true);
    }
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: "16vh" }}></div>
      <div style={{ marginLeft: "5vw", marginRight: "5vw" }}>
        <h1
          className="pricing-h1"
          style={{ fontSize: "64px", textAlign: "center" }}
        >
          Plans & Pricing
        </h1>
      </div>
      <div
        className="pricing-numbers"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "90vw",
          marginLeft: "5vw",
          marginTop: "8vh",
          flexWrap: "wrap",
        }}
      >
        <div
          className="pricing-free-credits"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            borderRadius: "25px",
            width: "250px",
            justifyContent: "start",
            margin: "24px 24px 24px 24px",
            background: "rgba(211,211,221, .6)",
            padding: "24px",
            height: "270px",
          }}
        >
          <h2 className="pricing-title" style={{ margin: "0 0 12px 0" }}>
            One month<br></br>free trial
          </h2>

          <Button
            style={{
              marginTop: "24px",
              borderRadius: "50px",
              width: "200px",
              alignSelf: "center",
              justifySelf: "center",
              marginBottom: "12px",
              background: "white",
              border: "3px solid #0795FF",
              cursour: "pointer",
              color: "#0795FF",
              fontSize: "28px",
              padding: " 10px 20px",
            }}
            onClick={handleGetThis}
            className="get-this-button"
          >
            Get started
          </Button>
          <h4
            className="pricing-ul"
            style={{
              margin: "0",
              fontSize: "22px",
              textAlign: "left",
              paddingLeft: "0",
              width: "210px",
            }}
          >
            12 hours of lectures
          </h4>
        </div>
        <div
          className="pricing-free-credits"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            borderRadius: "25px",
            width: "250px",
            justifyContent: "start",
            margin: "24px 24px 24px 24px",
            background: "rgba(211,211,221, .6)",
            padding: "24px",
            height: "270px",
          }}
        >
          <h2 style={{ margin: "0 0 12px 0" }} className="pricing-title">
            Basic
          </h2>
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 0 12px 0",
            }}
          >
            <h1 className="pricing-price">$9.99</h1>

            <p
              className="pricing-per-month"
              style={{ margin: "0", lineHeight: "18px" }}
            >
              per<br></br>month
            </p>
          </div>
          <Checkout productId={"price_1NkpcgJ7QtFqMwlQqy2Ofg0q"} />

          <h4
            className="pricing-ul"
            style={{
              margin: "12px 0 0 0",
              fontSize: "22px",
              textAlign: "left",
              paddingLeft: "0",
              width: "210px",
            }}
          >
            12 hours of lectures
          </h4>
        </div>

        <div
          className="pricing-free-credits pricing-half"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            borderRadius: "25px",
            width: "250px",
            justifyContent: "start",
            margin: "24px 24px 24px 24px",
            background: "rgba(211,211,221, .6)",
            padding: "24px",
            height: "270px",
          }}
        >
          <h2 style={{ margin: "0 0 12px 0" }} className="pricing-title">
            Premium{" "}
          </h2>
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 0 12px 0",
            }}
          >
            <h1 className="pricing-price">$19.99</h1>

            <p
              className="pricing-per-month"
              style={{ margin: "0", lineHeight: "18px" }}
            >
              per<br></br>month
            </p>
          </div>
          <Checkout productId={"price_1Nkpd9J7QtFqMwlQXI6y8sk6"} />

          <h4
            className="pricing-ul"
            style={{
              margin: "12px 0 0 0",
              fontSize: "22px",
              textAlign: "left",
              paddingLeft: "0",
              width: "210px",
            }}
          >
            30 hours of lectures
          </h4>
        </div>

        <div style={{ position: "relative", top: "-48px" }}>
          <div
            className="pricing-best-value"
            style={{
              background: "#0795FF",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              borderRadius: "25px 25px 0 0",
              width: "250px",
              justifyContent: "start",
              padding: "12px 24px",
              margin: "24px 24px 0 24px",
            }}
          >
            <h2 style={{ color: "white", fontSize: "24px", margin: "0" }}>
              Best Value
            </h2>
          </div>
          <div
            className="pricing-best-section"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              borderRadius: "0 0 25px 25px",
              width: "250px",
              justifyContent: "start",
              margin: "0 24px 24px 24px",
              background: "rgba(211,211,221, .6)",
              padding: "24px",
              height: "270px",
            }}
          >
            <h2 className="pricing-title" style={{ margin: "0 0 12px 0" }}>
              Pro{" "}
            </h2>
            <div
              style={{
                display: "flex",
                alignSelf: "center",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 0 12px 0",
              }}
            >
              <h1 className="pricing-price">$29.99</h1>

              <p
                className="pricing-per-month"
                style={{ margin: "0", lineHeight: "18px" }}
              >
                per<br></br>month
              </p>
            </div>
            <Checkout productId={"price_1NkpdUJ7QtFqMwlQy3ez0cW2"} />

            <h4
              className="pricing-ul"
              style={{
                margin: "12px 0 0 0",
                fontSize: "22px",
                textAlign: "left",
                paddingLeft: "0",
                width: "210px",
              }}
            >
              60 hours of lectures
            </h4>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <Login
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          showSignupModal={showSignupModal}
          setShowSignupModal={setShowSignupModal}
          showForgotModal={showForgotModal}
          setShowForgotModal={setShowForgotModal}
        />
      )}
      {showSignupModal && (
        <Signup
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          showSignupModal={showSignupModal}
          setShowSignupModal={setShowSignupModal}
          showForgotModal={showForgotModal}
          setShowForgotModal={setShowForgotModal}
        />
      )}
      {showForgotModal && (
        <ForgotPassword
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          showSignupModal={showSignupModal}
          setShowSignupModal={setShowSignupModal}
          showForgotModal={showForgotModal}
          setShowForgotModal={setShowForgotModal}
        />
      )}
    </>
  );
}

/*










*/

function Login(props) {
  const {
    showLoginModal,
    setShowLoginModal,
    showSignupModal,
    setShowSignupModal,
    showForgotModal,
    setShowForgotModal,
  } = props;
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await login(
        emailRef.current.value,
        passwordRef.current.value
      );
      if (response != "success") {
        return setError(response);
      } else {
        setSuccess("You're logged in!");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to log in.");
    }
    setLoading(false);
  }
  return (
    <>
      <Modal
        show={showLoginModal}
        onHide={() => {
          setShowLoginModal(false);
          setShowSignupModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button className="w-100 mt-3" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link
              onClick={() => {
                setShowLoginModal(false);
                setShowSignupModal(false);
                setShowForgotModal(true);
              }}
            >
              Forgot password?
            </Link>
          </div>

          <div
            className="w-100 text-center mt-2"
            onClick={() => {
              setShowLoginModal(false);
              setShowSignupModal(true);
            }}
            style={{ cursor: "pointer" }}
          >
            Need an account? <Link>Sign Up</Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function Signup(props) {
  const {
    showLoginModal,
    setShowLoginModal,
    showSignupModal,
    setShowSignupModal,
  } = props;
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const { signup, authError, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [confirmedTerms, setConfirmedTerms] = useState(false);
  const handleVerify = () => {
    try {
      console.log("willhalbert16@gmail.com");
    } catch (e) {
      console.log(e);
    }
    verifyEmail("willhalbert16@gmail.com");
  };
  async function handleSignUp(e) {
    e.preventDefault();
    if (!confirmedTerms) {
      return setError("Accept the terms and conditions to sign up.");
    }
    if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
      return setError("Passwords do not match.");
    }
    try {
      setError("");
      setLoading(true);
      const response = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );
      if (response != "success") {
        return setError(response);
      } else {
        return setSuccess(
          "You're signed up! Check your email in a few minutes for a verification link"
        );
        setShowSignupModal(false);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to set up an account.");
    }
    setLoading(false);
  }

  return (
    <>
      <Modal
        show={showSignupModal}
        onHide={() => {
          setShowLoginModal(false);
          setShowSignupModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSignUp}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirmation">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmationRef}
                required
              />
            </Form.Group>
            <Form.Group id="terms-confirmation" style={{ marginTop: "12px" }}>
              <Form.Check
                type="checkbox"
                label={
                  <>
                    I have read and accept the{" "}
                    <Link to="/terms-and-conditions">terms and conditions</Link>
                  </>
                }
                onChange={(e) => setConfirmedTerms(e.target.checked)}
              />
            </Form.Group>
            <Button className="w-100 mt-3" type="submit">
              Sign Up
            </Button>
          </Form>

          <div
            className="w-100 text-center mt-2"
            onClick={() => {
              setShowLoginModal(true);
              setShowSignupModal(false);
            }}
            style={{ cursor: "pointer" }}
          >
            Already have an account? <Link>Log In</Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
function ForgotPassword(props) {
  const { showForgotModal, setShowLoginModal, setShowForgotModal } = props;
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState("");

  async function handleReset(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await resetPassword(emailRef.current.value);
      if (response != "success") {
        return setError(response);
      } else {
        setMessage("Check your email for further instructions.");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to reset password.");
    }
    setLoading(false);
  }

  return (
    <>
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleReset}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button className="w-100 mt-3" type="submit">
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link
              onClick={() => {
                setShowLoginModal(true);
                setShowForgotModal(false);
              }}
            >
              Login
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

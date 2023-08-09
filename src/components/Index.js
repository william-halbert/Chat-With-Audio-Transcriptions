import React, { useRef, useState } from "react";
import Header from "./HeaderIndex";
import HeroImg from "../images/transcribe.png";
import demoVideo from "../images/demo.mov";
import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { getDatabase } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert, Modal } from "react-bootstrap";
import Footer from "./Footer";

export default function Index() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [hideHeaderItems, setHideHeaderItems] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const demoSectionRef = useRef(null);

  return (
    <>
      <Header />
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
      <div style={{ marginTop: "86px", marginBottom: "20vh" }}>
        {/* Hero section */}
        <section style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ alignSelf: "center", marginLeft: "5vw" }}>
            <h1 style={{ fontSize: "84px" }}>
              Transcribe audio then chat with it
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                justifyContent: "start",
              }}
            >
              <button
                style={{
                  fontSize: "30px",
                  padding: "5px 0px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  borderRadius: "50px",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "200px",
                  minHeight: "unset",
                }}
                onClick={() => {
                  const user = auth.currentUser;
                  if (user) {
                    navigate("/chat");
                  } else {
                    setShowLoginModal(false);
                    setShowSignupModal(true);
                  }
                }}
              >
                {user ? "Chat" : "Get Started"}
              </button>
              <h2
                onClick={() =>
                  demoSectionRef.current.scrollIntoView({ behavior: "smooth" })
                }
                style={{
                  fontSize: "30px",
                  padding: "10px 20px",
                  backgroundColor: "#fff",
                  color: "#007BFF",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                See demos below
              </h2>
            </div>
          </div>
          <img
            src={HeroImg}
            alt="Hero"
            style={{ maxHeight: "80vh", marginRight: "5vw" }}
          />
        </section>

        {/* 1st demo section */}
        <section
          ref={demoSectionRef}
          style={{
            marginTop: "15vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "42px",
              alignSelf: "start",
              marginLeft: "5vw",
            }}
          >
            Students
          </h2>
          <h3
            style={{
              fontSize: "30px",
              alignSelf: "start",
              marginLeft: "5vw",
              marginBottom: "10vh",
              maxWidth: "90vw",
            }}
          >
            Ask about class topics or even ask what homework was assigned
          </h3>
          <video
            src={demoVideo}
            style={{
              maxWidth: "90vw",
              borderRadius: "15px",
              boxShadow: "1px 1px 6px rgba(0,123,255, .8)",
            }}
            autoPlay
            loop
            muted
          />
        </section>
      </div>
      <Footer />
    </>
  );
}

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
        setShowLoginModal(false);
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
  const [loading, setLoading] = useState(false);
  const { signup, authError } = useAuth();
  const navigate = useNavigate();
  const [confirmedTerms, setConfirmedTerms] = useState(false);
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

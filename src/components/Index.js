import React, { useRef, useState } from "react";
import Header from "./HeaderIndex";
import HeroImg from "../images/transcribe.png";
import upload from "../images/dragFile.png";
import voiceMemo from "../images/finderDesk.png";
import transcriptDesk from "../images/transcriptDesk.png";
import summaryDesk from "../images/summaryDesk.png";
import chatDesk from "../images/chatDesk.png";

import summaryMob from "../images/summary.png";
import chatMob from "../images/chat.png";
import uploadMob from "../images/upload.jpeg";
import transcriptMob from "../images/transcript.png";
import filesMob from "../images/filesMob.png";
import filesMob2 from "../images/filesMob2.png";

import spelling from "../images/deleteDesk.png";
import folders from "../images/foldersDesk.png";
import "./Index.css";

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
  const [demo, setDemo] = useState("Transcript");

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
        <section
          className="index-hero"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div
            className="index-hero-left"
            style={{ alignSelf: "center", marginLeft: "5vw" }}
          >
            <h1 className="index-hero-left-h1" style={{ fontSize: "84px" }}>
              Transcribe audio then chat with it
            </h1>
            <div
              className="index-hero-left-buttons-div"
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
                className="index-hero-left-button"
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
                className="index-hero-left-h2"
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
                See demos
              </h2>
            </div>
          </div>
          <img src={HeroImg} alt="Hero" className="index-hero-right" />
        </section>

        {/* 1st demo section */}
        <section
          className="demo1"
          ref={demoSectionRef}
          style={{
            marginTop: "10vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2
            className="demo-desktop"
            style={{
              fontSize: "20px",
              alignSelf: "start",
              marginLeft: "5vw",
              color: "white",
            }}
          >
            {" "}
            hi
          </h2>

          <div
            className="no-focus"
            style={{
              display: "flex",
              alignItems: "space-around",
              justifyContent: "center",
              background: "rgba(170,170,170,1)",
              padding: "3px 5px",
              gap: "5px",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "5vh",
              boxShadow: "1px 1px 10px rgba(140,140,140, 1)",
            }}
          >
            <Button
              className="no-focus transcript-tab "
              style={{
                background: "rgba(211,211,211,.0)",
                border: "none",
                cursor: "pointer",

                background:
                  demo == "Transcript"
                    ? "rgba(110,110,110,1)"
                    : "rgba(211,211,211,.0)",
              }}
              onClick={() => setDemo("Transcript")}
            >
              Transcript
            </Button>
            <Button
              className="no-focus transcript-summary-tab "
              style={{
                cursor: "pointer",

                background:
                  demo == "Summary"
                    ? "rgba(110,110,110,1)"
                    : "rgba(211,211,211,.0)",
                border: "none",
              }}
              onClick={() => setDemo("Summary")}
            >
              Summary
            </Button>
            <Button
              className="no-focus transcript-summary-tab "
              style={{
                cursor: "pointer",

                background:
                  demo == "Chat"
                    ? "rgba(110,110,110,1)"
                    : "rgba(211,211,211,.0)",
                border: "none",
                width: "90px",
              }}
              onClick={() => setDemo("Chat")}
            >
              Chat
            </Button>
          </div>
          {demo == "Transcript" ? (
            <>
              {" "}
              <img
                className="demo-desktop"
                src={transcriptDesk}
                style={{
                  maxWidth: "70vw",
                  borderRadius: "15px",
                  boxShadow: "0px 0px 10px rgba(0,123,255, 1)",
                }}
              />
              <img
                className="demo-mobile"
                src={transcriptMob}
                style={{
                  margin: "2vh 0",
                  maxWidth: "70vw",
                  borderRadius: "15px",
                  boxShadow: "0px 0px 10px rgba(0,123,255, 1)",
                }}
              />
            </>
          ) : demo == "Summary" ? (
            <>
              <img
                className="demo-desktop desktop"
                src={summaryDesk}
                style={{
                  maxWidth: "70vw",
                  borderRadius: "15px",
                  boxShadow: "0px 0px 10px rgba(0,123,255, 1)",
                }}
              />{" "}
              <img
                className="demo-mobile mobile"
                src={summaryMob}
                style={{
                  margin: "2vh 0",
                  maxWidth: "70vw",
                  borderRadius: "15px",
                  boxShadow: "0px 0px 10px rgba(0,123,255, 1)",
                }}
              />
            </>
          ) : (
            <>
              <img
                className="demo-desktop desktop"
                src={chatDesk}
                style={{
                  maxWidth: "70vw",
                  borderRadius: "15px",
                  boxShadow: "0px 0px 10px rgba(0,123,255, 1)",
                }}
              />
              <img
                className="demo-mobile mobile"
                src={chatMob}
                style={{
                  margin: "2vh 0",
                  maxWidth: "70vw",
                  borderRadius: "15px",
                  boxShadow: "0px 0px 10px rgba(0,123,255, 1)",
                  marginBottom: "0",
                }}
              />
            </>
          )}
          <div className="desktop" style={{ marginBottom: "5vh" }}></div>
        </section>
        {/* 2nd demo section */}
        <section
          className="demo-section-mobile"
          style={{
            marginTop: "5vh",
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
          ></h2>
          <h3
            className="demo-h3 desktop"
            style={{
              fontSize: "42px",
              alignSelf: "center",
              marginBottom: "5vh",
              maxWidth: "90vw",
            }}
          >
            Upload with voice memos
          </h3>
          <div
            className="desktop"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "5vw",
              alignItems: "center !important",
              justifyContent: "center !important",
            }}
          >
            <img
              className="demo-desktop"
              src={voiceMemo}
              style={{
                width: "28vw",
                borderRadius: "15px",
                boxShadow: "1px 1px 10px rgba(140,140,140, 1)",
                alignSelf: "center",
              }}
            />
            <img
              className="demo-desktop"
              src={upload}
              style={{
                width: "37vw",
                borderRadius: "15px",
                boxShadow: "1px 1px 10px rgba(140,140,140, 1)",
                justifySelf: "center",
              }}
            />
          </div>
          <div className="desktop" style={{ marginBottom: "5vh" }}></div>
        </section>
        {/* 3rd demo section */}
        <section
          className="demo-section-mobile"
          style={{
            marginTop: "5vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3
            className="demo-h3 desktop"
            style={{
              fontSize: "42px",
              alignSelf: "center",
              marginBottom: "5vh",
              maxWidth: "90vw",
            }}
          >
            Drag and drop chats and folders, double click to edit names
          </h3>
          <div className="demo3-div" style={{ display: "flex", gap: "5vw" }}>
            <h3
              className="demo-h3 mobile"
              style={{
                fontSize: "30px",
                alignSelf: "start",
                margin: "4vh 0 0 0 ",
                marginLeft: "0vw",
                marginBottom: "0vh",
                maxWidth: "90vw",
              }}
            >
              Organize chats inside folders
            </h3>
            <img
              className="mobile"
              src={folders}
              style={{
                margin: "2vh 0",
                maxWidth: "90vw",
                borderRadius: "15px",
                boxShadow: "1px 1px 10px rgba(140,140,140, 1)",
                marginLeft: "5vw;",
                alignSelf: "center",
              }}
            />
            <img
              className="demo3-vid desktop"
              src={folders}
              style={{
                width: "32.5vw",
                borderRadius: "15px",
                boxShadow: "1px 1px 10px rgba(140,140,140, 1)",
              }}
            />
            <img
              className="demo3-vid desktop"
              src={spelling}
              style={{
                width: "32.5vw",
                borderRadius: "15px",
                boxShadow: "1px 1px 10px rgba(140,140,140, 1)",
              }}
            />
            <h3
              className="demo-h3 mobile"
              style={{
                fontSize: "30px",
                alignSelf: "start",
                margin: "0",
                marginLeft: "5vw",
                maxWidth: "90vw",
              }}
            >
              Upload from voice memos
            </h3>
            <img
              className="demo-mobile"
              src={filesMob}
              style={{
                maxWidth: "70vw",
                borderRadius: "15px",
                boxShadow: "1px 1px 10px rgba(140,140,140, 1)",
              }}
            />
            <img
              className="demo-mobile"
              src={filesMob2}
              style={{
                maxWidth: "70vw",
                borderRadius: "15px",
                boxShadow: "1px 1px 10px rgba(140,140,140, 1)",
              }}
            />
          </div>
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

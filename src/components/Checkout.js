import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getAuth } from "firebase/auth";
import { Card, Form, Button, Alert, Modal } from "react-bootstrap";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY_LIVE);

function CheckoutForm({ productId }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER}/stripe/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: productId, userId: user.uid }),
          }
        );
        const data = await response.json();

        console.log("Frontend received:", data);

        if (!data.session.id) {
          console.error("Unexpected API response:", data);
          return;
        }

        const sessionId = data.session.id;

        const result = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });
      } catch (e) {
        console.error("Stripe error", e);
      }
    } else {
      setShowSignupModal(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={!stripe}
          style={{
            padding: " 10px 20px",
            borderRadius: "50px",
            background: "#0795FF",
            color: "#FFF",
            border: "none",
            fontSize: "28px",
          }}
        >
          Let's get it
        </button>
      </form>
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

export default function Checkout({ productId }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm productId={productId} />
    </Elements>
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

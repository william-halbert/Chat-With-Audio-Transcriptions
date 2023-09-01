import React, { useState, useEffect, useRef } from "react";
import Play from "../images/play.png";
import Pause from "../images/pause.png";
import Exit from "../images/exit.png";
import Leap from "../images/leap.png";
import Plane from "../images/plane.png";
import WTF from "../images/wtf.png";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Collapse,
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import "./InClass.css";

export default function InClass() {
  const navigate = useNavigate();
  const [displayedTranscript, setDisplayedTranscript] = useState("");
  const [recordingStatus, setRecordingStatus] = useState("Playing");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const textAreaRef = useRef(null);
  const [isFlying, setIsFlying] = useState(false);
  const handleAirplaneClick = () => {
    setIsFlying(true);
    setTimeout(() => {
      setIsFlying(false);
    }, 1100);
  };

  const [affirmation, setAffirmation] = useState("");
  const [finalAffirmation, setFinalAffirmation] = useState(false);
  const socketRef = useRef(null);

  const handleChange = (e) => {
    setAffirmation(e.target.value);
  };
  const activateMicrophone = () => {
    console.log("Activating microphone...");

    //Add microphone access
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      let mimeType;
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/wav")) {
        mimeType = "audio/wav";
      } else if (MediaRecorder.isTypeSupported("audio/mp3")) {
        mimeType = "audio/mp3";
      } else if (
        MediaRecorder.isTypeSupported("audio/mp4") &&
        navigator.userAgent.includes("Safari")
      ) {
        mimeType = "audio/mp4"; // for Safari
      } else {
        return alert("Browser not supported");
      }
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      //create a websocket connection
      const socket = new WebSocket(
        "wss://chat-with-notes-server-b9f51be04d4f.herokuapp.com"
      );

      socket.onopen = () => {
        console.log("WebSocket connection opened.");
        mediaRecorder.addEventListener("dataavailable", async (event) => {
          if (event.data.size > 0 && socket.readyState === 1) {
            socket.send(event.data);
          }
        });
        mediaRecorder.start(1000);
      };

      socket.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const transcript = received.channel.alternatives[0].transcript;
        if (transcript) {
          console.log("Parsed transcript:", transcript);
          if (received.is_final) {
            setAffirmation(
              (prevAffirmation) => prevAffirmation + transcript + " "
            );
          }
        }
      };

      socket.onclose = () => {
        console.log({ event: "onclose" });
      };

      socket.onerror = (error) => {
        console.error("WebSocket encountered an error:", error);
      };

      socketRef.current = socket;
    });
  };

  return (
    <div
      style={{
        overflowY: "auto",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {!affirmation ? (
        <>
          <img
            src={Leap}
            style={{
              width: "400px",
              margin: "25px 0 0 0",
              cursor: "pointer",
            }}
            onClick={activateMicrophone}
          ></img>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100vw",
              alignItems: "center",
              position: "fixed",
              top: "0",
              left: "0",
              zIndex: "20",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(rgba(255,255,255,.8),rgba(255,255,255,.4), rgba(255,255,255,.2), transparent)",
                width: "100vw",
                height: "80px",
                margin: "0 0px 0 0px",
                cursor: "pointer",
              }}
              onClick={() => console.log("div clicked")}
            ></div>
            <img
              src={Exit}
              style={{
                zIndex: "1000",
                width: "55px",
                height: "55px",
                margin: "10px 15px 0 0",
                cursor: "pointer",
              }}
              onClick={() => {
                console.log("clicked");
                navigate("../notebook", {
                  state: {
                    affirmation: affirmation,
                  },
                });
              }}
            ></img>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100vw",
            alignItems: "center",
            position: "fixed",
            top: "0",
            left: "0",
          }}
        >
          {recordingStatus === "Playing" ? (
            <img
              src={Pause}
              onClick={() => setRecordingStatus("Paused")}
              style={{
                width: "60px",
                margin: "10px 0 0 15px",
                cursor: "pointer",
              }}
            />
          ) : (
            <img
              src={Play}
              onClick={() => setRecordingStatus("Playing")}
              style={{
                width: "60px",
                margin: "10px 0 0 15px",
                cursor: "pointer",
              }}
            ></img>
          )}
          <div
            style={{
              background:
                "linear-gradient(rgba(255,255,255,.8),rgba(255,255,255,.8), rgba(255,255,255,.6), rgba(255,255,255,0))",
              width: "100vw",
              height: "80px",
              margin: "0 0px 0 0px",
              cursor: "pointer",
            }}
          ></div>
          <img
            src={Exit}
            style={{
              width: "55px",
              height: "55px",
              margin: "10px 15px 0 0",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("clicked");
              navigate("../notebook", {
                state: {
                  affirmation: affirmation,
                },
              });
            }}
          ></img>
        </div>
      )}
      <div>
        <h4
          style={{
            width: "calc(100vw - 220px)",
            margin: "30px 110px 52vh 110px",
            fontSize: "32px",
            lineHeight: "42px",
            fontWeight: "bold",
          }}
          onClick={() => console.log("affirmation clicked")}
        >
          {affirmation}
        </h4>
      </div>
      {/* Send a message  */}
      {true && (
        <div
          className="send-message"
          style={{
            position: "fixed",
            bottom: "0",
            right: "0",
            width: "100vw",
            background: "rgba(255,255,255, 0)",
          }}
        >
          {messageError && (
            <Alert
              style={{ margin: "0 auto", maxWidth: "60%" }}
              variant="danger"
              className="message-input"
            >
              {messageError}
            </Alert>
          )}
          <form
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "24px",
            }}
          >
            <textarea
              ref={textAreaRef}
              name="message"
              placeholder="Add a note"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
              }}
              onInput={(e) => {
                if (e.target.value === "") {
                  e.target.style.height = "60px";
                } else if (e.target.scrollHeight > 60) {
                  e.target.style.height = e.target.scrollHeight + "px";
                } else {
                  e.target.style.height = "60px";
                }
              }}
              onKeyDown={(e) => {
                /*
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                e.target.value = "";
                e.target.style.height = "60px";
              }*/
                if (e.key === "Tab") {
                  e.preventDefault(); // Prevent losing focus
                  const start = textAreaRef.current.selectionStart;
                  const end = textAreaRef.current.selectionEnd;
                  textAreaRef.current.value =
                    textAreaRef.current.value.substring(0, start) +
                    "\t" +
                    textAreaRef.current.value.substring(end);
                  textAreaRef.current.selectionStart =
                    textAreaRef.current.selectionEnd = start + 1;
                }
              }}
              style={{
                position: "fixed",
                bottom: "36px",
                left: "0",
                width: "calc(100vw - 220px)",
                margin: "0 110px 0 110px",
                padding: "6px 80px 12px 20px",
                borderRadius: "8px",
                border: "none",
                border: "3px solid #0795FF",
                opacity: "1",
                outline: "none",
                overflowY: "hidden",
                resize: "none",
                height: "60px",
                fontSize: "24px",
              }}
              className="message-input"
            ></textarea>
            <img
              className={isFlying ? "fly-up" : ""}
              onClick={(e) => {
                e.preventDefault();
                setTimeout(() => {
                  setAffirmation((prev) => prev + " " + message + " ");
                }, 800);
                setMessage("");
                textAreaRef.current.style.height = "60px";
                handleAirplaneClick();
              }}
              src={Plane}
              style={{
                margin: "0 18px 42px 0",
                borderRadius: "8px",
                height: "90px",
                position: "fixed",
                right: "100px",
                bottom: "-20px",
                cursor: "pointer",
              }}
              id="paperAirplane"
            ></img>
          </form>
        </div>
      )}
      {true && (
        <img
          src={WTF}
          style={{
            position: "fixed",
            right: "0",
            top: "calc(50vh - 90px)",
            cursor: "pointer",
            height: "120px",
          }}
        ></img>
      )}
    </div>
  );
}

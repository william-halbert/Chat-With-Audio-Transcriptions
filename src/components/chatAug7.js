import React, { useState, useEffect, useRef } from "react";
import { Configuration, OpenAIApi } from "openai";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Checkout from "./Checkout";
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
import {
  faSquare as farSquare,
  faSquareCheck,
} from "@fortawesome/free-regular-svg-icons";
import {
  faRightToBracket,
  faSquare as fasSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { getDatabase } from "firebase/database";
import Header from "./HeaderLanding";
import "font-awesome/css/font-awesome.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCircle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./Chat.css";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import defaultUserImg from "../images/defaultProfile.png";
import robotImg from "../images/gpt.png";

function AudioToText() {
  //useState
  const Navigate = useNavigate();
  const [showVerifyModal, setShowVerifyModal] = useState();
  const [audioName, setAudioName] = useState();
  const [showSelectBoxes, setShowSelectBoxes] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [items, setItems] = useState([]);
  const [audio, setAudio] = useState();
  const [audioDuration, setAudioDuration] = useState(null); // minutes
  const [transcriptSuccess, setTranscriptSuccess] = useState("");
  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [transcriptError, setTranscriptError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [transcriptSummary, setTranscriptSummary] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [deletedItems, setDeletedItems] = useState([]);
  const [audioFileDetails, setAudioFileDetails] = useState(null);
  const [transcribing, setTranscribing] = useState("");
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [showTranscriptText, setShowTranscriptText] = useState("Transcript");
  const [showSidebar, setShowSidebar] = useState(null);
  const [transcribeRequestReceived, setTranscribeRequestReceived] =
    useState("");

  const {
    createFoldersAndChats,
    saveChat,
    saveTranscript,
    getChats,
    getChat,
    getSidebarInfo,
    setItemParent,
    moveToTrash,
    saveItemName,
    saveTranscriptSummary,
    removeCredits,
    getUser,
    logout,
    saveFolderIsOpen,
    saveTranscribing,
    saveProgress,
    verifyEmail,
  } = useAuth();
  const [chatId, setChatId] = useState();
  const [conversation, setConversation] = useState([]);
  const [credits, setCredits] = useState();
  const auth = getAuth();
  const toggleSelectBoxes = () => {
    setShowSelectBoxes((prevState) => !prevState);
  };
  const toggleEditMode = () => {
    setEditMode((prevState) => !prevState);
  };
  const openCreateMenu = () => {
    setShowCreateMenu(true);
  };
  const closeCreateMenu = () => {
    setShowCreateMenu(false);
  };
  const closeTranscript = () => {
    setShowTranscript(false);
  };
  const user = auth.currentUser;
  const db = getDatabase();

  // Add these event handlers
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  function handleShowSidebar(e) {
    e.preventDefault();
    setShowSidebar(true);
  }
  function handleHideSidebar() {
    if (window.innerWidth < 500) {
      setShowSidebar(false);
    }
  }
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    // Use DataTransfer object to access the dragged files
    let files = e.dataTransfer.files;

    if (files && files.length > 0) {
      const audioFile = files[0];
      const audioURL = URL.createObjectURL(audioFile);
      setAudio(audioURL);
      setAudioFileDetails(audioFile);
      setAudioName();

      let audioElem = new Audio();
      audioElem.src = audioURL;
      audioElem.onloadedmetadata = () => {
        let duration = audioElem.duration;
        setAudioDuration(Math.floor(duration / 60));
      };
    } else {
      console.error("No files found in the drop event");
    }
  }
  const handleVerify = () => {
    verifyEmail(user);
  };
  useEffect(() => {
    getUser(user.uid).then((userData) => {
      if (userData && userData.credits) {
        setCredits(userData.credits);
        console.log("Set Credits to ", userData.credits / 100);
      }
    });
  }, [credits]);

  const moveSelectedItemsToTrash = async () => {
    const movePromises = selectedItems.map((itemId) =>
      moveToTrash(user.uid, itemId)
    );
    await Promise.all(movePromises);
    const chat = items.find((item) => String(item.id) === String(chatId));
    if (chat && selectedItems.includes(String(chat.parentId))) {
      setChatId(null);
    }

    if (selectedItems.includes(String(chatId))) {
      setChatId(null);
    }
    setSelectedItems([]);
    setSidebar(false);
    setShowDeleteModal(false);
  };

  const toggleSelectedItem = (item) => {
    let strItem = String(item);
    if (selectedItems.includes(strItem)) {
      setSelectedItems((prevItems) => prevItems.filter((i) => i !== strItem));
    } else {
      setSelectedItems((prevItems) => [...prevItems, strItem]);
    }
  };

  const [chatData, setChataData] = useState();
  const fetchChat = async (chatId) => {
    try {
      setConversation([]);
      const chatData = await getChat(user.uid, String(chatId));
      if (chatData) {
        setConversation([]);
        chatData.messages.forEach((message) => {
          setConversation((prevItems) => [
            ...prevItems,
            {
              role: message.role,
              content: message.content,
            },
          ]);
        });
      }
      setTranscript("");
      setTranscriptSummary("");

      setTitle(chatData.name);
      let dateObj = chatData.createdDate.toDate();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let dateText =
        monthNames[dateObj.getMonth()] +
        " " +
        dateObj.getDate() +
        ", " +
        dateObj.getFullYear();
      setDate(dateText);
      setTranscribing(chatData.transcribing);
      if (chatData.transcript) {
        setTranscriptError("");
        setTranscribing("Done");
        if (chatData.transcriptSummary) {
          setTranscriptSummary(chatData.transcriptSummary);
        }
        setTranscript(chatData.transcript);
      } else if (chatData.transcribing == "Loading") {
        setTranscriptionProgress(0);
        setTranscribing("Loading");
        setTranscriptError("");
        const startTime = new Date(
          chatData.startTime.seconds * 1000 +
            chatData.startTime.nanoseconds / 1000000
        );
        const currentTime = new Date();

        let progress =
          (((currentTime - startTime) * 2.8) /
            (chatData.audioDuration * 1000 * 60)) *
          100;

        if (progress > 100) {
          progress = 100;
        }

        setTranscriptionProgress(progress);
        setAudioName(chatData.audioName);
        setAudioDuration(chatData.audioDuration);
      } else {
        setTranscript("");
        setTranscriptSummary("");
        setTranscribing("No");
      }
    } catch (error) {
      console.error("Failed to fetch chat data:", error);
    }
  };

  useEffect(() => {
    if (user.emailVerified) {
      setShowVerifyModal(false);
    } else {
      setShowVerifyModal(true);
    }
    setItems([]);
    setDeletedItems([]);
    const fetchData = async () => {
      const sidebarInfo = await getSidebarInfo(user.uid);
      let docsArray = sidebarInfo.docs ? sidebarInfo.docs : sidebarInfo;

      return docsArray.map((doc) => ({
        uid: doc.data().userId,
        id: doc.data().itemId,
        type: doc.data().type,
        name: doc.data().name,
        parentId: doc.data().parentId,
        isOpen: doc.data().isOpen,
        status: doc.data().status,
      }));
    };
    fetchData().then((newItems) => {
      const liveItems = [];
      const trashItems = [];
      newItems.map((item) => {
        if (item.status == "Live") {
          liveItems.push(item);
        }
        if (item.status == "Deleted") {
          trashItems.push(item);
        }
      });
      setItems(liveItems);
      setDeletedItems(trashItems);
    });
  }, []);

  const setSidebar = async (isOpen) => {
    setItems([]);
    setDeletedItems([]);
    const fetchData = async () => {
      const sidebarInfo = await getSidebarInfo(user.uid);
      let docsArray = sidebarInfo.docs ? sidebarInfo.docs : sidebarInfo;

      return docsArray.map((doc) => ({
        uid: doc.data().userId,
        id: doc.data().itemId,
        type: doc.data().type,
        name: doc.data().name,
        parentId: doc.data().parentId,
        isOpen: doc.data().isOpen,
        status: doc.data().status,
      }));
    };
    fetchData().then((newItems) => {
      const liveItems = [];
      const trashItems = [];
      newItems.map((item) => {
        if (item.status == "Live") {
          liveItems.push(item);
        }
        if (item.status == "Deleted") {
          trashItems.push(item);
        }
      });
      setItems(liveItems);
      setDeletedItems(trashItems);
    });
  };

  useEffect(() => {
    if (chatId) {
      const interval = setInterval(() => {
        saveChat(String(user.uid), String(chatId), conversation);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [chatId, conversation]);

  useEffect(() => {
    fetchChat(chatId);
    setTranscriptError("");
    setMessageError("");
    /*
    if (transcribing == "Loading") {
      const fetchInterval = setInterval(() => {
        setTranscriptionProgress((prevProgress) => {
          const incrementPerSecond = 100 / ((audioDuration / 2.8) * 60);
          if (prevProgress < 100) {
            const newProgress = prevProgress + incrementPerSecond;
            return newProgress > 100 ? 100 : newProgress;
          } else {
            clearInterval(fetchInterval);
            return 100;
          }
        });
      }, 5000);
    }*/
  }, [chatId]);

  useEffect(() => {
    let intervalId;
    /*
    if (transcribing === "Loading") {
      intervalId = setInterval(() => {
        fetchChat(chatId);
      }, 20000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };*/
  }, [transcribing]);

  //create new folder or chat
  const createNewItem = async (type) => {
    if (!newItemLabel.trim()) {
      setError("Name is required!");
      return;
    }
    const id = Date.now();
    if (type == "Chat") {
      setTranscript("");
      setTranscriptSummary("");
      setTranscribing("No");
      setTitle(newItemLabel);
      let dateObj = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let dateText =
        monthNames[dateObj.getMonth()] +
        " " +
        dateObj.getDate() +
        ", " +
        dateObj.getFullYear();
      setDate(dateText);
      setChatId(id);
    }
    setItems([...items, { id, type, name: newItemLabel, isOpen: true }]);
    setNewItemLabel("");
    try {
      await createFoldersAndChats(user.uid, newItemLabel, type, id);
    } catch (error) {
      setError("Failed to create the item in the database");
    }
  };

  //openai
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);
  async function openaiRequest(content, type) {
    let conversationToOpenai;
    let conversationToState;

    if (type == "Transcript") {
      conversationToOpenai = [
        {
          role: "user",
          content: `
          Please summarize the following transcript with these guidelines:
          
          1. Use HTML formatting suitable for a JSX environment.
          2. For Main Points:
             -  Use <h3> for the 'Main Points' header and include an unordered list for the main points underneath.
          3. For STEM courses:
             - Use <h3> for the 'Formulas' header and include any mentioned formulas as list items underneath.
          4. If "homework" is mentioned:
             - Use <h3> for the 'Homework' header and detail the homework assignments as list items underneath.
          5. If any "projects" are discussed:
             - Use <h3> for the 'Projects' header and detail the projects as list items underneath.
          6. If any "tests" are announced:
             - Use <h3> for the 'Tests' header and detail the tests as list items underneath.
          7. Conclude with a general summary using <h3> for the 'Summary' header.
          8. Provide links to learn more about the topics, preferably from YouTube, in a paragraph format.
          
          Transcript: ${transcript}`,
        },
      ];
    } else {
      conversationToState = [
        ...conversation,
        {
          role: "user",
          content: content,
        },
      ];
      setConversation(conversationToState);
      conversationToOpenai = conversationToState;
    }
    setMessage("");
    let response;
    try {
      response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        messages: conversationToOpenai,
        temperature: 0.5,
        max_tokens: 2000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      if (type == "Transcript") {
        setTranscriptSummary(response.data.choices[0].message.content);
        saveTranscriptSummary(
          String(user.uid),
          String(chatId),
          response.data.choices[0].message.content
        );
        const inputTokens = response.data.usage.prompt_tokens;
        const outputTokens = response.data.usage.completion_tokens;
        const cost = (inputTokens * 0.3) / 1000 + (outputTokens * 0.4) / 1000;

        removeCredits(user.uid, cost);
        setCredits(credits - cost);
        setConversation((prevConversation) => [
          {
            role: "user",
            content: `Summarize: ${transcript}`,
          },
          { role: "system", content: response.data.choices[0].message.content },
          ...prevConversation,
        ]);
      } else {
        setConversation([
          ...conversationToState,
          {
            role: "system",
            content: response.data.choices[0].message.content,
          },
        ]);
        const inputTokens = response.data.usage.prompt_tokens;
        const outputTokens = response.data.usage.completion_tokens;
        const cost = (inputTokens * 0.5) / 1000 + (outputTokens * 0.7) / 1000;

        removeCredits(user.uid, cost);
        setCredits(credits - cost);
        setMessageState("Done");
      }

      setMessage("");
    } catch (e) {
      setMessageError(e.response.data.error.message);
      console.log("Error:", e.message, e);
      if (e.response) {
        console.log("Server Response:", e.response.data.error.message);
      }
    }
  }

  useEffect(() => {
    if (transcript) {
      if (!transcriptSummary) {
        getUser(user.uid).then((userData) => {
          if (userData && userData.credits) {
            setCredits(userData.credits);
            console.log("Set Credits to ", userData.credits / 100);
          }
        });
        try {
          if (credits - 10 > 0) {
            const sendMessage = async () => {
              saveChat(String(user.uid), String(chatId), conversation);
              const openAiResponse = await openaiRequest(
                transcript,
                "Transcript"
              );
              saveChat(String(user.uid), String(chatId), conversation);
            };
            sendMessage();
          } else {
            setMessageError(
              "Not enough credits, see My Credits for more information."
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [transcript]);

  const onAudioSubmit = async (event) => {
    // Get the file from the event
    console.log("Started onAudioSubmit");
    setTranscriptionProgress(0);

    if (
      event.target.elements.audio.files &&
      event.target.elements.audio.files.length > 0
    ) {
      if (credits - Math.floor(audioDuration * 1) <= 0) {
        return setTranscriptError(
          "There are currently not enough credits to transcribe audio of this length, see My Credits page."
        );
      }

      if (audioDuration > 52) {
        return setTranscriptError(
          "Transcribed files can be a maximum of 50 minutes."
        );
      }

      const audioFile = event.target.elements.audio.files[0];
      setAudio(URL.createObjectURL(audioFile));
      setAudioFileDetails(audioFile);
      setAudioName(event.target.elements.audio.files[0].name);
      setTranscribing("Loading");
      setTranscriptError(
        "Wait for the transcription to successfully start in the backend"
      );
      saveTranscribing(String(user.uid), String(chatId), "Loading");
      saveProgress(
        String(user.uid),
        String(chatId),
        audioDuration,
        event.target.elements.audio.files[0].name,
        new Date()
      );
      console.log("audioduration", audioDuration);
      const interval = setInterval(() => {
        setTranscriptionProgress((prevProgress) => {
          const incrementPerSecond = 100 / ((audioDuration / 60) * 60);
          if (prevProgress < 100) {
            const newProgress = prevProgress + incrementPerSecond;
            return newProgress > 100 ? 100 : newProgress;
          } else {
            clearInterval(interval);
            return 100;
          }
        });
      }, 1000);

      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("userId", user.uid);
      formData.append("chatId", chatId);

      let response;
      let result;

      let removeAmount = Math.floor(audioDuration * 1);
      console.log("removeAmount", removeAmount);
      removeCredits(user.uid, removeAmount);
      setCredits(credits - removeAmount);
      try {
        console.log("Server URL:", process.env.REACT_APP_SERVER);
        response = await fetch(`${process.env.REACT_APP_SERVER}/transcribe`, {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        console.error("Error while fetching transcription:", error);
      }
      try {
        result = await response.json();
        setTranscribing("Done");
        setTranscriptionProgress(0);
        setTranscript(result.transcript);
        setShowTranscriptText("Transcript");
      } catch (e) {
        console.log(e);
      }
    }
  };
  const [messageState, setMessageState] = useState();
  const sendMessage = async (event) => {
    setMessageState("Waiting");
    setMessageError("");
    event.preventDefault();
    if (credits - 10 > 0) {
      saveChat(String(user.uid), String(chatId), conversation);
      const openAiResponse = await openaiRequest(message, "Chat");
      saveChat(String(user.uid), String(chatId), conversation);
    } else {
      setMessageError(
        "Not enough credits, see My Credits for more information."
      );
    }
  };

  async function handleLogout() {
    try {
      setError("");
      await logout();
      Navigate("/");
    } catch (err) {
      console.log(err);
      setError("Failed to log out.");
    }
  }

  const textAreaRef = useRef(null);

  return (
    <div>
      {/*modal Are you sure? */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
        }}
      >
        <Modal.Header
          closeButton
          style={{ borderTop: "none", borderBottom: "" }}
          className="no-focus"
        >
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ borderTop: "", borderBottom: "" }}>
          Deleting folders will delete all content inside the folders.
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "", borderBottom: "none" }}>
          <Button
            variant="tertiary"
            onClick={() => {
              setShowDeleteModal(false);
            }}
            className="no-focus"
          >
            Close
          </Button>
          <Button
            variant="danger"
            className="no-focus"
            onClick={() => moveSelectedItemsToTrash()}
          >
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* verify email modal */}
      <Modal
        show={showVerifyModal}
        onHide={() => console.log("")}
        className="modal-lg"
      >
        <Modal.Header closeButton className="no-focus transcript-header">
          <Modal.Title>Please Verify Your Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>To continue using the app, you need to verify your email.</p>
          <p>
            We have sent a verification link to your email address. Please check
            your inbox and click on the link to verify.
          </p>
          <p>Refresh the page if you just verified!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTranscript}>
            Close
          </Button>
          <Button variant="primary" onClick={handleVerify}>
            Resend Verification Link
          </Button>
        </Modal.Footer>
      </Modal>
      {/*modal to create Transcripts */}
      <Modal
        show={showTranscript}
        onHide={closeTranscript}
        className="modal-lg"
      >
        <Modal.Header closeButton className="no-focus transcript-header">
          {transcribing === "Done" ? (
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
              }}
            >
              <Button
                className="no-focus transcript-tab"
                style={{
                  background: "rgba(211,211,211,.0)",
                  border: "none",
                  background:
                    showTranscriptText == "Transcript"
                      ? "rgba(110,110,110,1)"
                      : "rgba(211,211,211,.0)",
                }}
                onClick={() => setShowTranscriptText("Transcript")}
              >
                Transcript
              </Button>
              <Button
                className="no-focus transcript-summary-tab"
                style={{
                  background:
                    showTranscriptText == "Summary"
                      ? "rgba(110,110,110,1)"
                      : "rgba(211,211,211,.0)",
                  border: "none",
                }}
                onClick={() => setShowTranscriptText("Summary")}
              >
                Summary
              </Button>
            </div>
          ) : (
            <Modal.Title>Your transcript</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {transcribing === "No" ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onAudioSubmit(event);
              }}
              id="audioSubmitForm"
            >
              <div>
                {transcriptError && (
                  <Alert style={{ maxWidth: "600px" }} variant="danger">
                    {transcriptError}
                  </Alert>
                )}
                <input
                  id="audioInput"
                  type="file"
                  accept="audio/mpeg,audio/x-m4a"
                  name="audio"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      const audioFile = e.target.files[0];
                      const audioURL = URL.createObjectURL(audioFile);
                      setAudio(audioURL);
                      setAudioFileDetails(audioFile);
                      setAudioName(e.target.files[0].name);
                      let audioElem = new Audio();
                      audioElem.src = audioURL;
                      audioElem.onloadedmetadata = () => {
                        let duration = audioElem.duration;
                        setAudioDuration(Math.floor(duration / 60));
                      };
                    }
                  }}
                />
                {/* Dropzone label */}
                <label
                  htmlFor="audioInput"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "200px",
                    borderRadius: "10px",
                    lineHeight: "200px",
                    fontSize: "24px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  className="audio-input"
                >
                  <h4
                    style={{
                      marginTop: "60px",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    Add Audio Files
                  </h4>
                  <h5 style={{ maxWidth: "400px", margin: "0 auto" }}>
                    We accept MP3, MP4, MP2, AAC, WAV, FLAC, PCM, and M4A, Files
                    can't be longer than 50 minutes
                  </h5>
                </label>
                {audioFileDetails && (
                  <div style={{ marginTop: "15px", textAlign: "center" }}>
                    <p style={{ margin: "0 0 0 0" }}>
                      <strong>File Name: </strong> {audioName}
                    </p>
                    {audioDuration && (
                      <p style={{ margin: "6px 0 0 0" }}>
                        <strong>Duration: </strong>
                        {Math.floor(audioDuration)} min
                      </p>
                    )}
                  </div>
                )}
              </div>
            </form>
          ) : transcribing == "Loading" ? (
            <div style={{ textAlign: "center" }}>
              <p>
                <strong>File Name: </strong> {audioName}
              </p>
              <div
                style={{
                  marginTop: "15px",
                  background: "#f5f5f5",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    height: "20px",
                    width: `${transcriptionProgress}%`,
                    backgroundColor: "#007bff",
                    borderRadius: "10px",
                  }}
                />
              </div>
              <p style={{ marginTop: "10px" }}>
                <strong>Estimated: </strong>
                {Math.floor(
                  (audioDuration / 60) * (transcriptionProgress / 100)
                )}{" "}
                min :{" "}
                {Math.floor(
                  (((audioDuration * 60) / 60) *
                    (transcriptionProgress / 100)) %
                    60
                )}{" "}
                sec / {Math.floor(audioDuration / 60)} min :{" "}
                {Math.floor(((audioDuration * 60) / 60) % 60)} sec
              </p>
            </div>
          ) : showTranscriptText == "Transcript" ? (
            <div>Transcript: {transcript}</div>
          ) : transcriptSummary != "" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              dangerouslySetInnerHTML={{
                __html: transcriptSummary.replace(/\n/g, "<br />"),
              }}
              className="transcript-summary"
            ></div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              className="transcript-summary"
            >
              Fetching your summary...
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="tertiary"
            className="no-focus"
            onClick={closeTranscript}
          >
            Close
          </Button>

          {transcribing == "Loading" ? (
            <Button variant="primary" className="no-focus">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              &nbsp;Transcribing...
            </Button>
          ) : transcribing == "No" ? (
            <Button
              variant="primary"
              className="no-focus"
              type="submit"
              form="audioSubmitForm"
            >
              Start to transcribe
            </Button>
          ) : (
            <Button
              variant="primary"
              className="no-focus"
              onClick={closeTranscript}
            >
              Transcription Complete
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <div
        className="contains-sidebar-and-chat-info"
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/*sidebar  */}
        {showSidebar == true || showSidebar == null ? (
          <div
            className="sidebar"
            style={{
              flex: "0.25",
              overflowY: "auto",
              padding: "0",
              background: "rgba(243,245,249, .9)",
            }}
          >
            {/*sidebar header  */}
            <div
              className="sidebar-header"
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "25vw",
                background: "rgba(243,245,249, .9)",
                zIndex: "5",
                paddingTop: "5px",
              }}
            >
              <Row
                className="align-items-center justify-content-between"
                style={{ padding: "0 0 0 6px" }}
              >
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
                  }}
                >
                  <h1
                    className="sidebar-edit"
                    style={{
                      fontSize: "14px",
                      margin: "0",
                      color: "black",
                      paddding: "0",
                      background: editMode
                        ? "rgba(221, 221, 221, 0.5)"
                        : "none",
                    }}
                    onClick={() => {
                      toggleEditMode();
                      toggleSelectBoxes();
                    }}
                  >
                    {editMode ? "Done" : "Select"}
                  </h1>
                  {editMode ? (
                    <FontAwesomeIcon
                      className="trash-icon"
                      style={{
                        margin: "0",
                        marginLeft: "4px",
                      }}
                      icon={faTrash}
                      onClick={() => {
                        if (selectedItems.length > 0) {
                          setShowDeleteModal(true);
                        }
                      }}
                    />
                  ) : (
                    <Dropdown>
                      <Dropdown.Toggle
                        as={FontAwesomeIcon}
                        icon={faPlus}
                        style={{
                          color: "black",
                          border: "none",
                          background: "transparent",
                        }}
                        className="sidebar-plus"
                      ></Dropdown.Toggle>
                      <Dropdown.Menu
                        className="custom-popup"
                        style={{
                          width: "15vw",
                          marginTop: "5px",
                        }}
                      >
                        <InputGroup
                          style={{ width: "90%", margin: "0 auto 4px auto" }}
                        >
                          <FormControl
                            value={newItemLabel}
                            placeholder="Enter name"
                            onChange={(e) => setNewItemLabel(e.target.value)}
                          />
                        </InputGroup>

                        <Button
                          variant="secondary"
                          className="no-focus"
                          style={{ width: "90%", margin: "4px 5%" }}
                          onClick={() => createNewItem("Folder")}
                        >
                          Create Folder
                        </Button>
                        <Button
                          variant="primary"
                          className="no-focus"
                          style={{ width: "90%", margin: "4px 5% 0 5%" }}
                          onClick={() => createNewItem("Chat")}
                        >
                          Create Chat
                        </Button>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </Col>

                <Col
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "end",
                  }}
                >
                  <Dropdown
                    style={{
                      marginRight: "6px",
                    }}
                  >
                    <Dropdown.Toggle
                      id="dropdown-basic-chat"
                      style={{ padding: "" }}
                    >
                      {
                        <MenuRoundedIcon
                          style={{ fill: "black" }}
                          sx={{ fontSize: 30 }}
                        />
                      }
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={{
                        left: "100%",
                        transform: "translateX(-100%)",
                        color: "black",
                        textDecoration: "none",
                      }}
                    >
                      {!user && (
                        <>
                          <Dropdown.Item href="login">Log In</Dropdown.Item>
                        </>
                      )}
                      {!user && (
                        <>
                          <Dropdown.Item href="signup">Sign Up</Dropdown.Item>
                        </>
                      )}
                      {user && (
                        <>
                          <Dropdown.Item href="my-credits">
                            My Credits
                          </Dropdown.Item>
                          <Dropdown.Item href="/">Demo</Dropdown.Item>
                          <Dropdown.Item href="pricing">Pricing</Dropdown.Item>
                          <Dropdown.Item
                            style={{
                              color: "black",
                              textDecoration: "none",
                            }}
                            onClick={handleLogout}
                          >
                            Logout
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </div>

            {/* Render folder and Chat in Sidebar */}
            <div style={{ marginTop: "60px" }}></div>
            <ListGroup>
              <RootDropZone
                setItemParent={setItemParent}
                uid={user.uid}
                setSidebar={setSidebar}
                style={{ padding: "10px", background: "none" }}
                setItems={setItems}
              />
              {items
                .filter((item) => !item.parentId)
                .map((item) =>
                  item.type === "Folder" ? (
                    <Folder
                      key={item.id}
                      id={item.id}
                      newItemLabel={newItemLabel}
                      setNewItemLabel={setNewItemLabel}
                      items={items}
                      depth={0}
                      setItems={setItems}
                      name={item.name}
                      setChatId={setChatId}
                      fetchChat={fetchChat}
                      setItemParent={setItemParent}
                      uid={user.uid}
                      setSidebar={setSidebar}
                      toggleSelectedItem={toggleSelectedItem}
                      selectedItems={selectedItems}
                      currentlySelected={
                        selectedItems.includes(String(item.id)) ? true : false
                      }
                      showSelectBoxes={showSelectBoxes}
                      saveItemName={saveItemName}
                      saveFolderIsOpen={saveFolderIsOpen}
                      chatId={chatId}
                      handleHideSidebar={handleHideSidebar}
                    />
                  ) : (
                    <Chat
                      key={item.id}
                      name={item.name}
                      chatId={item.id}
                      overallChatId={chatId}
                      setChatId={setChatId}
                      fetchChat={fetchChat}
                      setItemParent={setItemParent}
                      uid={user.uid}
                      parentId={null}
                      toggleSelectedItem={toggleSelectedItem}
                      selectedItems={selectedItems}
                      currentlySelected={
                        selectedItems.includes(String(item.id)) ? true : false
                      }
                      showSelectBoxes={showSelectBoxes}
                      saveItemName={saveItemName}
                      setSidebar={setSidebar}
                      setItems={setItems}
                      setTranscript={setTranscript}
                      setTranscriptSummary={setTranscriptSummary}
                      handleHideSidebar={handleHideSidebar}
                    />
                  )
                )}
              <RootDropZone
                setItemParent={setItemParent}
                uid={user.uid}
                style={{ padding: "200px 20px", background: "none" }}
                setSidebar={setSidebar}
                setItems={setItems}
              />
            </ListGroup>
          </div>
        ) : (
          ""
        )}
        {/*Chat Section  */}
        {showSidebar == true ||
        (showSidebar == null && window.innerWidth < 500) ? (
          ""
        ) : chatId ? (
          <div
            className="chat-workspace"
            style={{
              flex: ".75",
              overflowY: "auto",
              padding: "0",
            }}
          >
            {/*Chat Header  */}
            <Row
              className="align-items-space-between chat-header-mobile"
              style={{
                position: "fixed",
                top: "0",
                right: "0",
                width: "75%",
                background: "rgba(255,255,255,.8)",
                padding: "5px 10px",
                justifyContent: "center",
                margin: "0",
              }}
            >
              <Col
                style={{
                  margin: "auto 0 ",
                }}
              >
                <h1
                  className="desktop"
                  style={{ fontSize: "16px", margin: "auto 0 " }}
                >
                  {date}
                </h1>
                <h1
                  className="mobile"
                  onClick={handleShowSidebar}
                  style={{ fontSize: "16px", margin: "auto 0 ", zIndex: "5" }}
                >
                  Show Sidebar
                </h1>
              </Col>
              <Col
                className="text-center"
                style={{
                  margin: "auto 0",
                }}
              >
                <h1 style={{ margin: "auto 0", fontSize: "24px" }}>{title}</h1>
              </Col>
              <Col className="text-right">
                <Button
                  className="chat-see-transcript-button no-focus"
                  onClick={() => setShowTranscript(true)}
                  variant="primary"
                  style={{ borderRadius: "50px" }}
                >
                  {transcribing === "Done" ? (
                    "See Transcript and Summary"
                  ) : transcribing === "Loading" ? (
                    "Transcript Loading"
                  ) : (
                    <>
                      <i className="fa fa-plus" aria-hidden="true"></i>{" "}
                      Transcribe
                    </>
                  )}
                </Button>
              </Col>
            </Row>
            {/*Chat Audio Input Section  */}
            <div style={{ marginTop: "60px" }}></div>
            {/*Conversation  */}
            <div>
              {conversation.map((item, index) => {
                if (transcribing == "Done") {
                  if (index < 2) return null;
                }

                return (
                  <div
                    style={{
                      padding: "24px 7vw",
                      margin: "0",
                      backgroundColor:
                        item.role === "user"
                          ? "#F8FBFF"
                          : "rgba(233,244,255,.7)",
                      display: "flex",
                      flexDirection: "row",
                      gap: "36px",
                    }}
                  >
                    <img
                      src={item.role === "user" ? defaultUserImg : robotImg}
                      style={{ width: "50px", height: "50px" }}
                      className="desktop"
                    />
                    <p
                      key={index}
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        marginBottom: "0",
                      }}
                    >
                      {item.content}
                    </p>
                  </div>
                );
              })}
              {messageState == "Waiting" ? (
                <div
                  style={{
                    padding: "24px 7vw",
                    margin: "0",
                    backgroundColor: "rgba(233,244,255,.7)",
                    display: "flex",
                    flexDirection: "row",
                    gap: "36px",
                  }}
                >
                  <img
                    src={robotImg}
                    style={{ width: "50px", height: "50px" }}
                    className="desktop"
                  />
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "24px",
                      marginBottom: "0",
                    }}
                  >
                    I'm thinking...
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
            <div style={{ marginTop: "120px" }}></div>
            {/* Send a message  */}
            <div
              className="send-message"
              style={{
                position: "fixed",
                bottom: "0",
                right: "0",
                width: "75%",
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
                onSubmit={sendMessage}
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
                  placeholder="Type your message here"
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                  }}
                  onInput={(e) => {
                    if (e.target.value === "") {
                      e.target.style.height = "38px";
                    } else if (e.target.scrollHeight > 38) {
                      e.target.style.height = e.target.scrollHeight + "px";
                    } else {
                      e.target.style.height = "38px";
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                      e.target.value = "";
                      e.target.style.height = "38px";
                    }
                  }}
                  style={{
                    minWidth: "60%",
                    margin: "0 auto 36px auto",
                    padding: "6px 10px 6px 10px",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "1px 1px 15px rgba(0,123,255, .8)",
                    opacity: "1",
                    outline: "none",
                    overflowY: "hidden",
                    resize: "none",
                    height: "38px",
                  }}
                  className="message-input"
                ></textarea>
                <Button
                  className="mobile"
                  onClick={(e) => {
                    e.preventDefault();
                    sendMessage(e);
                    setMessage("");
                    textAreaRef.current.style.height = "38px";
                  }}
                  style={{
                    margin: "0 18px 36px 0",

                    borderRadius: "8px",

                    height: "38px",
                  }}
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div
            className="chat-workspace"
            style={{
              flex: ".75",
              padding: "0",
            }}
          >
            <div
              className="chat-workspace"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "0",
                alignItems: "center",
              }}
            >
              <h1
                style={{
                  fontSize: "28px",
                  marginTop: "6px",
                  color: "rgb(221,221,221)",
                }}
              >
                Choose or create a chat to continue
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Folder({
  id,
  createSubItem,
  newItemLabel,
  setNewItemLabel,
  items,
  depth,
  setItems,
  name,
  setChatId,
  fetchChat,
  setItemParent,
  uid,
  chatId,
  setSidebar,
  toggleSelectedItem,
  selectedItems,
  currentlySelected,
  showSelectBoxes,
  saveItemName,
  setTranscript,
  setTranscriptSummary,
  saveFolderIsOpen,
  handleHideSidebar,
}) {
  const currentFolder = items.find((item) => item.id === id);
  const isOpen = currentFolder.isOpen;
  const toggleOpen = () => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, isOpen: !item.isOpen };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    saveFolderIsOpen(uid, id, isOpen);
  }, [items]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [currentName, setCurrentName] = useState(name);

  const [{ isDragging }, folderDrag] = useDrag(() => ({
    type: "FOLDER",
    item: { id: id, type: "FOLDER" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredFolder, setHoveredFolder] = useState();
  const [, drop] = useDrop(() => ({
    accept: ["CHAT", "FOLDER"],
    hover: (draggedItem, monitor) => {
      setIsHovering(true);
      setHoveredFolder(id);
    },
    drop: (draggedItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }

      if (draggedItem.type === "CHAT") {
        setItemParent(uid, String(draggedItem.id), String(id))
          .then(() => setItems([]))
          .then(() => setSidebar(true));
      }

      if (draggedItem.type === "FOLDER") {
        setItemParent(uid, String(draggedItem.id), String(id))
          .then(() => setItems([]))
          .then(() => setSidebar(true));
      }
    },
  }));
  return (
    <div ref={drop} className="folder">
      {/* Folder List Item */}
      <ListGroup.Item
        ref={folderDrag}
        action
        onClick={toggleOpen}
        className="folder-item"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          background: "none",
          paddingLeft: `${15 * depth + 18}px`,
        }}
      >
        <div>
          {showSelectBoxes ? (
            currentlySelected ? (
              <FontAwesomeIcon
                icon={faSquareCheck}
                style={{ fontSize: "24px", margin: "0 10px -2px 0" }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelectedItem(String(id));
                }}
              />
            ) : (
              <FontAwesomeIcon
                icon={farSquare}
                style={{ fontSize: "24px", margin: "0 10px -2px 0" }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelectedItem(String(id));
                }}
              />
            )
          ) : (
            ""
          )}
          {isOpen ? "▼" : "▶"}{" "}
          {editingName ? (
            <input
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setEditingName(false);
                  saveItemName(String(uid), String(id), currentName)
                    .then(() => setItems([]))
                    .then(() => setSidebar(false));
                }
              }}
              autoFocus
              className="name-change-input"
              style={{
                background: "none",
                border: "none",
                fontWeight: "bold",
                marginLeft: "12px",
                padding: "0",
              }}
            />
          ) : (
            <strong
              style={{ marginLeft: "12px" }}
              onDoubleClick={() => {
                setEditingName(true);
              }}
            >
              {name}
            </strong>
          )}
        </div>
      </ListGroup.Item>
      <Collapse in={isOpen}>
        <div>
          {(items || [])
            .filter((item) => String(item.parentId) === String(id))
            .map((subItem) =>
              subItem.type === "Folder" ? (
                <Folder
                  key={subItem.id}
                  id={subItem.id}
                  createSubItem={createSubItem}
                  newItemLabel={newItemLabel}
                  setNewItemLabel={setNewItemLabel}
                  items={items}
                  depth={depth + 1}
                  setItems={setItems}
                  name={subItem.name}
                  setChatId={setChatId}
                  fetchChat={fetchChat}
                  setItemParent={setItemParent}
                  uid={uid}
                  setSidebar={setSidebar}
                  toggleSelectedItem={toggleSelectedItem}
                  selectedItems={selectedItems}
                  currentlySelected={
                    selectedItems.includes(String(subItem.id)) ? true : false
                  }
                  showSelectBoxes={showSelectBoxes}
                  saveItemName={saveItemName}
                  saveFolderIsOpen={saveFolderIsOpen}
                  chatId={chatId}
                  handleHideSidebar={handleHideSidebar}
                />
              ) : (
                ""
              )
            )}
          {(items || [])
            .filter((item) => String(item.parentId) === String(id))
            .map((subItem) =>
              subItem.type === "Chat" ? (
                <Chat
                  key={subItem.id}
                  name={subItem.name}
                  chatId={subItem.id}
                  setChatId={setChatId}
                  fetchChat={fetchChat}
                  overallChatId={chatId}
                  depth={depth}
                  parentId={subItem.parentId}
                  toggleSelectedItem={toggleSelectedItem}
                  selectedItems={selectedItems}
                  currentlySelected={
                    selectedItems.includes(String(subItem.id)) ? true : false
                  }
                  showSelectBoxes={showSelectBoxes}
                  saveItemName={saveItemName}
                  uid={uid}
                  setSidebar={setSidebar}
                  setItems={setItems}
                  setTranscript={setTranscript}
                  setTranscriptSummary={setTranscriptSummary}
                  handleHideSidebar={handleHideSidebar}
                />
              ) : (
                ""
              )
            )}
        </div>
      </Collapse>
    </div>
  );
}

function Chat({
  parentId,
  depth,
  name,
  setChatId,
  chatId,
  fetchChat,
  overallChatId,
  toggleSelectedItem,
  selectedItems,
  currentlySelected,
  showSelectBoxes,
  saveItemName,
  uid,
  setSidebar,
  setItems,
  setTranscript,
  setTranscriptSummary,
  handleHideSidebar,
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CHAT",
    item: { id: chatId, type: "CHAT" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const [editingName, setEditingName] = useState(false);
  const [currentName, setCurrentName] = useState(name);
  return (
    <ListGroup.Item
      ref={drag}
      action
      className="chat-item"
      onClick={() => {
        handleHideSidebar();
        setChatId(chatId);
      }}
      style={{
        paddingLeft: !parentId
          ? "20px"
          : depth == 0
          ? "30px"
          : `${15 * (depth * 2) + 20}px`,
        borderRadius: "10px",
        background: chatId === overallChatId ? "rgba(221,221,221,.6)" : "none",
        border: "none",
        opacity: isDragging ? "0.5" : "1",
      }}
    >
      {showSelectBoxes ? (
        currentlySelected ? (
          <FontAwesomeIcon
            icon={faSquareCheck}
            style={{ fontSize: "24px", margin: "0 10px -2px 0" }}
            onClick={(e) => {
              e.stopPropagation();
              toggleSelectedItem(String(chatId));
            }}
          />
        ) : (
          <FontAwesomeIcon
            icon={farSquare}
            style={{ fontSize: "24px", margin: "0 10px -2px 0" }}
            onClick={(e) => {
              e.stopPropagation();
              toggleSelectedItem(String(chatId));
            }}
          />
        )
      ) : (
        ""
      )}
      <FontAwesomeIcon icon={faCircle} style={{ color: "rgb(0,123,255)" }} />
      {editingName ? (
        <input
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          onBlur={(e) => {
            e.preventDefault();
            setEditingName(false);
            saveItemName(String(uid), String(chatId), currentName)
              .then(() => setItems([]))
              .then(() => setSidebar(false))
              .then(() => fetchChat(chatId));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setEditingName(false);
              saveItemName(String(uid), String(chatId), currentName)
                .then(() => setItems([]))
                .then(() => setSidebar(false))
                .then(() => fetchChat(chatId));
            }
          }}
          autoFocus
          className="name-change-input"
          style={{
            background: "none",
            border: "none",
            fontWeight: "bold",
            marginLeft: "12px",
            padding: "0",
          }}
        />
      ) : (
        <strong
          style={{ marginLeft: "12px" }}
          onDoubleClick={() => {
            setEditingName(true);
          }}
        >
          {name}
        </strong>
      )}
    </ListGroup.Item>
  );
}
function RootDropZone({ setItemParent, uid, setSidebar, style, setItems }) {
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredFolder, setHoveredFolder] = useState();
  const [, drop] = useDrop(() => ({
    accept: ["CHAT", "FOLDER"],
    hover: (draggedItem, monitor) => {},
    drop: (draggedItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }

      if (draggedItem.type === "CHAT") {
        setItemParent(uid, String(draggedItem.id), null)
          .then(() => setItems([]))
          .then(() => setSidebar(true));
      }

      if (draggedItem.type === "FOLDER") {
        setItemParent(uid, String(draggedItem.id), null)
          .then(() => setItems([]))
          .then(() => setSidebar(true));
      }
    },
  }));

  return <div ref={drop} className="root-drop-zone" style={style}></div>;
}

export default AudioToText;

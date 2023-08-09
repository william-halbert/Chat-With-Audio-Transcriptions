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
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { process } from "dot";
import { doc, setDoc, getFirestore } from "firebase/firestore";
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
  const [showSelectBoxes, setShowSelectBoxes] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [items, setItems] = useState([]);
  const [audio, setAudio] = useState();
  const [audioDuration, setAudioDuration] = useState(null);

  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [transcriptSummary, setTranscriptSummary] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [deletedItems, setDeletedItems] = useState([]);
  const [audioFileDetails, setAudioFileDetails] = useState(null);

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
  } = useAuth();
  const [chatId, setChatId] = useState();
  const [conversation, setConversation] = useState([]);
  const { logout } = useAuth();
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

    if (files.length > 0) {
      const audioFile = files[0];
      // Continue with the same logic you used for the file input onChange
      const audioURL = URL.createObjectURL(audioFile);
      setAudio(audioURL);
      setAudioFileDetails(audioFile);

      let audioElem = new Audio();
      audioElem.src = audioURL;
      audioElem.onloadedmetadata = () => {
        let duration = audioElem.duration;
        setAudioDuration(duration);
      };
    }
  }

  const moveSelectedItemsToTrash = async () => {
    const movePromises = selectedItems.map((itemId) =>
      moveToTrash(user.uid, itemId)
    );
    await Promise.all(movePromises);
    setSelectedItems([]);
    setSidebar(false);
    setShowDeleteModal(false);
  };

  const toggleSelectedItem = (item) => {
    let strItem = String(item);
    console.log(strItem);
    if (selectedItems.includes(strItem)) {
      setSelectedItems((prevItems) => prevItems.filter((i) => i !== strItem));
    } else {
      setSelectedItems((prevItems) => [...prevItems, strItem]);
    }
  };

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

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
      console.log(conversation);
    } catch (error) {
      console.error("Failed to fetch chat data:", error);
    }
  };

  useEffect(() => {
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
        isOpen: false,
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
        isOpen: false,
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
        saveChat(user.uid, String(chatId), conversation);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [chatId, conversation]);

  useEffect(() => {
    fetchChat(chatId);
  }, [chatId]);

  //create new folder or chat
  const createNewItem = async (type) => {
    if (!newItemLabel.trim()) {
      setError("Name is required!");
      return;
    }
    const id = Date.now();
    if ((type = "Chat")) {
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
  async function openaiRequest(content) {
    const newConversation = [
      ...conversation,
      {
        role: "user",
        content: content,
      },
    ];
    setConversation(newConversation);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: newConversation,
      temperature: 0,
      max_tokens: 2000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    setConversation([
      ...newConversation,
      {
        role: "system",
        content: response.data.choices[0].message.content,
      },
    ]);
    setMessage("");
  }

  const onAudioSubmit = async (event) => {
    // Get the file from the event
    console.log("Started onAudioSubmit");
    if (
      event.target.elements.audio.files &&
      event.target.elements.audio.files.length > 0
    ) {
      const audioFile = event.target.elements.audio.files[0];
      setAudio(URL.createObjectURL(audioFile));
      setAudioFileDetails(audioFile);

      const formData = new FormData();
      formData.append("audio", audioFile);
      let response;
      try {
        response = await fetch("http://localhost:4000/transcribe", {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        console.error("Error while fetching transcription:", error);
      }

      const result = await response.json();
      setTranscript(result.transcript);
      saveTranscript(user.uid, String(chatId), result);
      console.log(transcript);
      /*const openAiResponse = await openaiRequest(
        `Summarize: ${result.transcript}`
      );*/
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    saveChat(user.uid, String(chatId), conversation);
    const openAiResponse = await openaiRequest(message);
    saveChat(user.uid, String(chatId), conversation);
  };

  async function handleLogout() {
    try {
      setError("");
      await logout();
    } catch (err) {
      console.log(err);
      setError("Failed to log out.");
    }
  }

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
      {/*modal to create Transcripts */}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onAudioSubmit(event);
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "36px",
        }}
      >
        <Modal show={showTranscript} onHide={closeTranscript}>
          <Modal.Header closeButton className="no-focus">
            <Modal.Title>Your transcript</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <input
                id="audioInput"
                type="file"
                accept="audio/*"
                name="audio"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    const audioFile = e.target.files[0];
                    const audioURL = URL.createObjectURL(audioFile);
                    setAudio(audioURL);
                    setAudioFileDetails(audioFile);

                    let audioElem = new Audio();
                    audioElem.src = audioURL;
                    audioElem.onloadedmetadata = () => {
                      let duration = audioElem.duration;
                      setAudioDuration(duration);
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
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
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
                <h5>or drag and drop</h5>
              </label>
              {audioFileDetails && (
                <div style={{ marginTop: "15px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 0 0" }}>
                    <strong>File Name: </strong> {audioFileDetails.name}
                  </p>
                  {/*
                  <p>
                    <strong>File Type: </strong>
                    {audioFileDetails.type || "Unknown"}
                  </p>
                  <p>
                    <strong>File Size: </strong>{" "}
                    {(audioFileDetails.size / (1024 * 1024)).toFixed(2)} MB
              </p>*/}
                  {audioDuration && (
                    <p style={{ margin: "6px 0 0 0" }}>
                      <strong>Duration: </strong>
                      {Math.floor(audioDuration / 60)} min
                    </p>
                  )}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="tertiary"
              className="no-focus"
              onClick={closeTranscript}
            >
              Close
            </Button>

            <Button
              variant="primary"
              className="no-focus"
              onClick={onAudioSubmit}
            >
              Start to transcribe
            </Button>
          </Modal.Footer>
        </Modal>
      </form>

      <div
        className="contains-sidebar-and-chat-info"
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/*sidebar  */}
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
                    background: editMode ? "rgba(221, 221, 221, 0.5)" : "none",
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
                  <Dropdown.Toggle id="dropdown-basic" style={{ padding: "" }}>
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
          <div style={{ marginTop: "10px" }}></div>
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

        {/*Chat Section  */}
        {chatId ? (
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
              className="align-items-space-between"
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
                <h1 style={{ fontSize: "16px", margin: "auto 0 " }}>{date}</h1>
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
                  onClick={() => setShowTranscript(true)}
                  variant="primary"
                  className="no-focus"
                  style={{ borderRadius: "50px" }}
                >
                  <i className="fa fa-plus" aria-hidden="true"></i> Transcribe
                </Button>
              </Col>
            </Row>
            {/*Chat Audio Input Section  */}
            <div style={{ marginTop: "60px" }}></div>
            {/*Conversation  */}
            <div>
              {conversation.map((item, index) => (
                <div
                  style={{
                    padding: "24px 10vw",
                    margin: "0",
                    backgroundColor:
                      item.role === "user" ? "#F8FBFF" : "rgba(233,244,255,.8)",
                    display: "flex",
                    flexDirection: "row",
                    gap: "36px",
                  }}
                >
                  <img
                    src={item.role === "user" ? defaultUserImg : robotImg}
                    style={{ width: "50px" }}
                  />
                  <p key={index}>{item.content}</p>
                </div>
              ))}
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
                  name="message"
                  placeholder="Type your message here"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
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

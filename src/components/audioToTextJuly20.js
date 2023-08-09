import React, { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
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
} from "@fortawesome/free-solid-svg-icons";

function AudioToText() {
  //useState
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [items, setItems] = useState([]);
  const [audio, setAudio] = useState();
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [transcriptSummary, setTranscriptSummary] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const {
    createFoldersAndChats,
    saveChat,
    saveTranscript,
    getChats,
    getChat,
    getSidebarInfo,
  } = useAuth();
  const [chatId, setChatId] = useState();
  const [conversation, setConversation] = useState([]);
  const { logout } = useAuth();
  const auth = getAuth();
  const openCreateMenu = () => {
    setShowCreateMenu(true);
  };
  const closeCreateMenu = () => {
    setShowCreateMenu(false);
  };
  const user = auth.currentUser;
  const db = getDatabase();

  const fetchChat = async (chatId) => {
    try {
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
      console.log(conversation);
    } catch (error) {
      console.error("Failed to fetch chat data:", error);
    }
  };
  let sidebarLoaded = false;
  useEffect(() => {
    setItems([]);
    const fetchData = async () => {
      const sidebarInfo = await getSidebarInfo(user.uid);
      sidebarInfo.forEach((doc) => {
        setItems((prevItems) => [
          ...prevItems,
          {
            uid: doc.data().userId,
            id: doc.data().itemId,
            type: doc.data().type,
            name: doc.data().name,
            parentId: doc.data().parentId,
            isOpen: false,
          },
        ]);
      });
    };
    fetchData();
    console.log(items);
    sidebarLoaded = true;
  }, []);

  useEffect(() => {
    if (chatId) {
      const interval = setInterval(() => {
        saveChat(user.uid, String(chatId), conversation);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [user, chatId, conversation]);

  //create new folder or chat
  const createNewItem = async (type) => {
    if (!newItemLabel.trim()) {
      setError("Name is required!");
      return;
    }
    const id = Date.now();
    setItems([...items, { id, type, name: newItemLabel, isOpen: true }]);
    setNewItemLabel("");
    setShowCreateMenu(false);
    try {
      await createFoldersAndChats(user.uid, newItemLabel, type, id);
    } catch (error) {
      setError("Failed to create the item in the database");
    }
  };

  const createSubItem = async (parentId, type) => {
    let updatedItems = [...items];
    const newItem = {
      id: Date.now(),
      type,
      name: newItemLabel,
      parentId: parentId,
      isOpen: true,
    };
    updatedItems.push(newItem);
    setItems(updatedItems);
    setNewItemLabel("");
    setShowCreateMenu(false);
    const parent = items.filter((item) => item.parentId === parentId);
    PageTransitionEvent.isOpen = true;
    try {
      await createFoldersAndChats(
        user.uid,
        newItemLabel,
        type,
        newItem.id,
        parentId
      );
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
    if (
      event.target.elements.audio.files &&
      event.target.elements.audio.files.length > 0
    ) {
      const audioFile = event.target.elements.audio.files[0];
      setAudio(URL.createObjectURL(audioFile));

      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch("http://localhost:4000/transcribe", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setTranscript(result.transcript);
      saveTranscript(user.uid, String(chatId), result);
      const openAiResponse = await openaiRequest(
        `Summarize: ${result.transcript}`
      );
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const openAiResponse = await openaiRequest(message);
    console.log(conversation);
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
      {/*modal to create chats and folders */}
      <Modal show={showCreateMenu} onHide={closeCreateMenu}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <FormControl
              value={newItemLabel}
              placeholder="Enter name"
              onChange={(e) => setNewItemLabel(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCreateMenu}>
            Close
          </Button>
          <Button variant="primary" onClick={() => createNewItem("Folder")}>
            Create Folder
          </Button>
          <Button variant="primary" onClick={() => createNewItem("Chat")}>
            Create Chat
          </Button>
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
        <div
          className="sidebar"
          style={{
            flex: "0.25",
            overflowY: "auto",
            padding: "0",
            background: "#F3F5F9",
          }}
        >
          {/*sidebar header  */}
          <Row
            className="align-items-center"
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "25%",
              background: "#F3F5F9",
              zIndex: "5",
              padding: "0 0 0 12px",
              opacity: ".94",
            }}
          >
            <Col>
              <span style={{ color: "black" }}>Edit</span>
              <Button variant="link" className="ml-2">
                <FontAwesomeIcon
                  icon={faArrowUpFromBracket}
                  style={{ color: "black" }}
                />
              </Button>
              <Button variant="link" onClick={openCreateMenu} className="ml-2">
                <i
                  className="fa fa-plus"
                  aria-hidden="true"
                  style={{ color: "black" }}
                ></i>
              </Button>
            </Col>
            <Col className="text-right">
              <Button variant="link">
                <i
                  className="fa fa-bars"
                  aria-hidden="true"
                  style={{ color: "black" }}
                ></i>
              </Button>
            </Col>
          </Row>
          {/* Render folder and Chat in Sidebar */}
          <div style={{ marginTop: "40px" }}></div>
          <ListGroup>
            {items
              .filter((item) => !item.parentId)
              .map((item) =>
                item.type === "Folder" ? (
                  <Folder
                    key={item.id}
                    id={item.id}
                    createSubItem={createSubItem}
                    newItemLabel={newItemLabel}
                    setNewItemLabel={setNewItemLabel}
                    items={items}
                    depth={0}
                    setItems={setItems}
                    name={item.name}
                    setChatId={setChatId}
                    fetchChat={fetchChat}
                  />
                ) : (
                  <Chat
                    key={item.id}
                    name={item.name}
                    chatId={item.id}
                    setChatId={setChatId}
                    fetchChat={fetchChat}
                  />
                )
              )}
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
                background: "white",
                opacity: ".93",
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
                <h1 style={{ fontSize: "16px", margin: "auto 0 " }}>
                  7/31/2023
                </h1>
              </Col>
              <Col
                className="text-center"
                style={{
                  margin: "auto 0",
                }}
              >
                <h1 style={{ margin: "auto 0", fontSize: "24px" }}>
                  Your Title Here
                </h1>
              </Col>
              <Col className="text-right">
                <Button variant="primary" style={{ borderRadius: "50px" }}>
                  <i className="fa fa-plus" aria-hidden="true"></i> Transcribe
                </Button>
              </Col>
            </Row>
            {/*Chat Audio Input Section  */}
            <div style={{ marginTop: "60px" }}></div>
            <div>
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
                <input
                  type="file"
                  accept="audio/*"
                  name="audio"
                  style={{ margin: "0" }}
                />
                <button type="submit">Submit Audio</button>
              </form>
              {audio && <audio controls src={audio} />}
            </div>
            <div>
              {conversation.map((item, index) => (
                <p style={{ margin: "24px 5vw" }} key={index}>
                  <strong>{item.role}:</strong> {item.content}
                </p>
              ))}
            </div>
            <form
              onSubmit={sendMessage}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "36px",
              }}
            >
              <input
                type="text"
                name="message"
                placeholder="Type your message here"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                style={{ minWidth: "60%" }}
              />
              <button type="submit">Send Message</button>
            </form>
          </div>
        ) : (
          ""
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

  return (
    <div className="folder">
      {/* Folder List Item */}
      <ListGroup.Item
        action
        onClick={toggleOpen}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
        }}
      >
        <div>
          {isOpen ? "▼" : "▶"}{" "}
          <strong
            style={{
              marginLeft: "12px",
            }}
          >
            {name}
          </strong>
        </div>
      </ListGroup.Item>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Sub-Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <FormControl
              value={newItemLabel}
              placeholder="Enter name"
              onChange={(e) => setNewItemLabel(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          {depth < 1 ? (
            <Button
              variant="primary"
              onClick={() => {
                createSubItem(id, "Folder");
                setShowAddModal(false);
              }}
            >
              Create Folder
            </Button>
          ) : (
            ""
          )}
          <Button
            variant="primary"
            onClick={() => {
              createSubItem(id, "Chat");
              setShowAddModal(false);
            }}
          >
            Create Chat
          </Button>
        </Modal.Footer>
      </Modal>
      <Collapse in={isOpen}>
        <div style={{ paddingLeft: "20px" }}>
          {(items || [])
            .filter((item) => item.parentId === id)
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
                />
              ) : (
                ""
              )
            )}
          {(items || [])
            .filter((item) => item.parentId === id)
            .map((subItem) =>
              subItem.type === "Chat" ? (
                <Chat
                  key={subItem.id}
                  name={subItem.name}
                  chatId={subItem.id}
                  setChatId={setChatId}
                  fetchChat={fetchChat}
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

function Chat({ name, setChatId, chatId, fetchChat }) {
  return (
    <ListGroup.Item
      action
      className="chat-item"
      onClick={() => {
        setChatId(chatId);
        fetchChat(chatId);
      }}
      style={{ background: "none", border: "none" }}
    >
      <FontAwesomeIcon icon={faCircle} style={{ color: "rgb(0,123,255)" }} />
      <strong
        style={{
          marginLeft: "12px",
        }}
      >
        {name}
      </strong>
    </ListGroup.Item>
  );
}

export default AudioToText;

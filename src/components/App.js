import AudioToText from "./chatAug7";
import Signup from "./Signup";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Terms from "./Terms";
import Privacy from "./Privacy";
import { db } from "../firebase";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Pricing from "./Pricing";
import Index from "./Index";
import MyCredits from "./MyCredits";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import InClass from "./InClass";
import Notebook from "./Notebook";
import Pdf from "./Pdf";
import Ppt from "./Ppt";
import Dashboard from "./Dashboard";
import Image from "./Image";

function App() {
  return (
    <>
      <Container
        fluid
        style={{
          padding: "0",
        }}
      >
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Dashboard />} />
              <Route path="/image" element={<Image />} />
              <Route path="/notebook" element={<Notebook />} />
              <Route path="/pdf" element={<Pdf />} />
              <Route path="/ppt" element={<Ppt />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/in-class" element={<InClass />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms-and-conditions" element={<Terms />} />
              <Route path="/privacy-policy" element={<Privacy />} />

              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <DndProvider backend={HTML5Backend}>
                      <AudioToText />
                    </DndProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-credits"
                element={
                  <PrivateRoute>
                    <MyCredits />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </Container>
    </>
  );
}

export default App;

import React from "react";
import { Link } from "react-router-dom";
import Logo from "../images/logoWhite.png";
import "font-awesome/css/font-awesome.min.css";

export default function Footer() {
  const styles = {
    footerContainer: {
      display: "flex",
      justifyContent: "space-between",
      padding: "5vh 5vw",
      backgroundColor: "#951ABE",
    },
    footerLeft: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
    },
    footerLogo: {
      width: "250px",
      marginBottom: "10px",
    },
    footerInstagramIcon: {
      color: "white",
      fontSize: "36px",
    },
    footerRight: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
    },
    footerLink: {
      color: "white",
      textDecoration: "none",
      marginBottom: "10px",
      cursor: "pointer",
      textAlign: "left",
    },
    footerLinkHover: {
      textDecoration: "underline",
    },
  };

  return (
    <footer style={styles.footerContainer}>
      <div style={styles.footerLeft}>
        <img src={Logo} alt="AudioChat.ai Logo" style={styles.footerLogo} />
        <div style={{ padding: "0 12px" }}>
          <a
            href="https://www.instagram.com/audiochat_ai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="fa fa-instagram"
              style={styles.footerInstagramIcon}
            ></i>
          </a>
        </div>
      </div>
      <div style={styles.footerRight}>
        <Link to="/privacy-policy" style={styles.footerLink}>
          Privacy Policy
        </Link>
        <Link to="/terms-and-conditions" style={styles.footerLink}>
          Terms and Conditions
        </Link>
      </div>
    </footer>
  );
}

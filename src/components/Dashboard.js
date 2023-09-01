import React from "react";
import "./Dashboard.css"; // assuming you'll have CSS styles in this file

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div className="container">
        <div className="box-inner">
          <div className="book books-1 book-blur"></div>
          <div className="book books-2 book-blur"></div>
          <div className="book books-3 book-blur"></div>
        </div>
        <div className="box-out">
          <div className="book books-1"></div>
          <div className="book books-2"></div>
          <div className="book books-3"></div>
        </div>
      </div>

      <a
        href="https://dribbble.com/YancyMin"
        className="dr-url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="dr"
          src="https://cdn.dribbble.com/assets/logo-footer-hd-a05db77841b4b27c0bf23ec1378e97c988190dfe7d26e32e1faea7269f9e001b.png"
          alt="Dribbble"
        />
      </a>
    </div>
  );
}

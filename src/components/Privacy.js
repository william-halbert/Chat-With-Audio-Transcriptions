import React from "react";
import Header from "./HeaderLanding";

export default function Privacy() {
  return (
    <>
      <Header />
      <div className="privacy-policy" style={{ margin: "98px 5vw 5vh 5vw" }}>
        <h1>Privacy Policy for Lecture Leap</h1>
        <p>
          <strong>Last Updated</strong>: August 8, 2023
        </p>
        <p>
          At Lecture Leap, owned and operated by Willful Works, LLC, we value
          the privacy of our users. This Privacy Policy describes the types of
          information we collect, how we use it, and the measures we take to
          protect it.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We may collect personal and non-personal data when you use our
          services. This includes:
        </p>
        <ul>
          <li>Audio files and transcriptions.</li>
          <li>Contact details, such as name and email address, if provided.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide, maintain, and improve our services.</li>
          <li>To respond to user inquiries and provide support.</li>
          <li>For internal analytics to understand user behavior.</li>
          <li>To comply with legal obligations and protect our rights.</li>
        </ul>

        <h2>3. Data Protection</h2>
        <p>
          We implement robust security measures to safeguard your data. While we
          strive to protect your information, we cannot guarantee absolute
          security.
        </p>

        <h2>4. Third-party Services</h2>
        <p>
          We may partner with third-party services for specific functionalities.
          We do not control their privacy practices, so we recommend reviewing
          their privacy policies separately.
        </p>

        <h2>5. Cookies</h2>
        <p>
          We may use cookies to enhance user experience and gather usage data.
          You can choose to disable cookies, but it may affect site
          functionality.
        </p>

        <h2>6. User Rights</h2>
        <p>
          You have the right to access, modify, or delete your personal data.
          Please contact us for such requests.
        </p>

        <h2>7. Amendments</h2>
        <p>
          We may update this policy periodically. Please review it regularly.
          Continued use after updates signifies acceptance.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please reach out at
          lectureleap@gmail.com.
        </p>
      </div>{" "}
    </>
  );
}

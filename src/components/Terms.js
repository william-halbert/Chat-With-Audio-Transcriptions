import React from "react";
import Header from "./HeaderLanding";

export default function Terms() {
  return (
    <>
      <Header />
      <div
        className="terms-and-conditions"
        style={{ margin: "98px 5vw 5vh 5vw" }}
      >
        <h1>Terms and Conditions</h1>
        <p>
          <strong>Effective Date</strong>: August 8, 2023
        </p>
        <p>
          This website ("Site") is owned and operated by Willful Works, LLC. By
          accessing or using Lecture Leap, you agree to be bound by the
          following terms and conditions.
        </p>

        <h2>1. Services</h2>
        <p>
          Lecture Leap offers transcription services, where users can submit
          audio files to be transcribed, and chat services, where users can
          engage in chats based on the transcribed content.
        </p>

        <h2>2. Service Charges</h2>
        <ul>
          <li>
            <strong>Transcription Services</strong>: The cost for transcribing
            audio files is $0.01 per minute of transcription.
          </li>
          <li>
            <strong>Chat Services</strong>: Charges for chat are as follows:
            <ul>
              <li>Inputs: $0.005 per 1000 tokens</li>
              <li>Outputs: $0.007 per 1000 tokens</li>
            </ul>
          </li>
          <li>
            Note: Approximately 1000 tokens are equivalent to 750 words, as
            denoted by the OpenAI API.
          </li>
        </ul>

        <h2>3. Recording Consent</h2>
        <p>
          By submitting audio files to Lecture Leap, users affirm that they have
          obtained all necessary permissions and consents to record the audio
          instance, have checked the relevant state or local laws regarding one
          or two-way consent for recording, and have ensured compliance with the
          standards and rules set by their profession and organizations.
        </p>

        <h2>4. No Liability</h2>
        <p>
          Lecture Leap and Willful Works, LLC shall not be held liable for any
          disputes or legal issues arising from the content of the audio files,
          violations of state or local recording consent laws by users, or
          non-compliance with rules or standards of specific professions or
          organizations by the users.
        </p>

        <h2>5. Data Protection</h2>
        <p>
          Willful Works, LLC endeavors to protect and secure the data and audio
          files submitted by users. However, we cannot guarantee absolute
          security due to the inherent risks associated with online data
          transmission.
        </p>

        <h2>6. Termination</h2>
        <p>
          Willful Works, LLC reserves the right to terminate or suspend access
          to the LectureLeap.com site for any user who violates these terms and
          conditions, without prior notice.
        </p>

        <h2>7. Amendments</h2>
        <p>
          These terms and conditions may be amended from time to time at the
          sole discretion of Willful Works, LLC. Continued use of the Site after
          any amendments signifies acceptance of the revised terms.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance
          with the laws of Florida, USA, and you submit to the jurisdiction of
          the state and federal courts located in Florida, USA for the
          resolution of any disputes.
        </p>

        <h2>9. Contact</h2>
        <p>
          For any inquiries or concerns related to these terms and conditions,
          please contact us at lectureleap@gmail.com.
        </p>
      </div>{" "}
    </>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Configuration, OpenAIApi } from "openai";

export default function Notebook() {
  const location = useLocation();
  const { affirmation } = location.state;

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function openaiRequest(chunk) {
      const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_KEY,
      });
      const openai = new OpenAIApi(configuration);

      let conversationToOpenai = [
        {
          role: "user",
          content: `
                Summarize everything into bullet points. Don't leave out information.

                Class Transcript: ${chunk}`,
        },
      ];

      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo-16k",
          messages: conversationToOpenai,
          temperature: 0.5,
          max_tokens: 600, // We want around 600 words
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        });

        return response.data.choices[0].message.content.split("\n"); // Split the response into bullet points
      } catch (e) {
        console.log("Error:", e.message, e);
        if (e.response) {
          console.log("Server Response:", e.response.data.error.message);
        }
      }
    }

    async function processTranscript() {
      if (!affirmation) return;

      // Split the affirmation into chunks of approximately 1000 words
      const chunks = affirmation
        .split(/\s+/)
        .reduce((acc, word, idx) => {
          const chunkIndex = Math.floor(idx / 1000);
          if (!acc[chunkIndex]) {
            acc[chunkIndex] = [];
          }
          acc[chunkIndex].push(word);
          return acc;
        }, [])
        .map((chunk) => chunk.join(" "));

      const allNotes = [];
      for (const chunk of chunks) {
        const chunkNotes = await openaiRequest(chunk);
        allNotes.push(...chunkNotes);
      }

      setNotes(allNotes);
    }

    processTranscript();
  }, [affirmation]);

  return (
    <div style={{ margin: "36px 110px" }}>
      {notes.map((note, idx) => (
        <p key={idx}>{note}</p>
      ))}
    </div>
  );
}

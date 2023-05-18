import Head from "next/head";
import { useState, useEffect } from "react";
import React from "react";
import styles from "./index.module.css";

const initialMessage = {
  text: "Welcome to the chat! This bot only knows German, try to chat with him and discover secrets!",
  sender: "bot",
  timestamp: new Date().toLocaleTimeString(),
};

export default function Home() {
  const [chatState, setChatState] = useState({
    input: "",
    messages: [initialMessage],
    loading: false,
    error: null,
  });

  useEffect(() => {
    setChatState((prevState) => ({
      ...prevState,
      showChatHistory: true,
    }));
  }, []);

  async function onSubmit(event) {
    event.preventDefault();

    const { input, messages } = chatState;
    if (input.trim() === "") {
      setChatState((prevState) => ({
        ...prevState,
        error: "Please enter a message.", // Display an error message
      }));
      return;
    }

    setChatState((prevState) => ({
      ...prevState,
      loading: true,
      error: null, // Clear any previous error messages
    }));

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userReply: input }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || `Request failed with status ${response.status}`
        );
      }

      addMessage(input, "user");
      addMessage(data.result, "bot");

      setChatState((prevState) => ({
        ...prevState,
        result: data.result,
        input: "",
        loading: false,
      }));
    } catch (error) {
      console.error(error);
      setChatState((prevState) => ({
        ...prevState,
        loading: false,
        error: "An error occurred. Please try again.", // Display a generic error message
      }));
    }
  }

  function addMessage(text, sender) {
    const timestamp = new Date().toLocaleTimeString();
    const message = { text, sender, timestamp };
    setChatState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }

  function clearChat() {
    setChatState((prevState) => ({
      ...prevState,
      input: "",
      messages: [initialMessage],
    }));
  }

  const { input, messages, loading, error } = chatState;

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/GermanFlag.png" />
      </Head>

      <main className={styles.main}>
        <img src="/GermanFlag.png" className={styles.icon} alt="German Flag" />
        <h3>Talk with a German</h3>

        {chatState.showChatHistory && (
          <div className={styles.chatContainer}>
            <div className={styles.chatHistory}>
              {/* Render the chat history */}
              {messages.map((message, index) => (
                <div key={index} className={styles.message}>
                  <span
                    className={
                      message.sender === "user"
                        ? styles.userMessage
                        : styles.botMessage
                    }
                  >
                    {/* Display the sender and message */}
                    {message.sender === "user" ? "You" : "Bot"}: {message.text}
                  </span>
                  <span className={styles.timestamp}>{message.timestamp}</span>
                </div>
              ))}
            </div>
            {messages.length > 0 && (
              <button className={styles.clearButton} onClick={clearChat}>
                Clear Chat
              </button>
            )}
            <form onSubmit={onSubmit} className={styles.inputForm}>
              <input
                type="text"
                name="userReply"
                placeholder="Enter a message"
                value={input}
                onChange={(e) =>
                  setChatState((prevState) => ({
                    ...prevState,
                    input: e.target.value,
                  }))
                }
                className={styles.inputField}
                required // Add the required attribute for HTML5 form validation
              />
              {error && (
                <span className={styles.error}>{error}</span> // Display the error message if present
              )}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || input.trim() === ""}
              >
                {loading ? (
                  <span className={styles.loadingIcon}>Loading...</span>
                ) : (
                  "Send"
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

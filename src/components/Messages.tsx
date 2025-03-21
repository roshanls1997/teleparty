import { useState } from "react";
import { messageType } from "../types";
import { SocketMessageTypes } from "teleparty-websocket-lib";

export default function Messages(props: {
  messages: messageType[];
  sendMessage: (type: SocketMessageTypes, input: object) => void;
  isTyping: boolean;
}) {
  const { messages, isTyping, sendMessage } = props;
  const [input, setInput] = useState("");
  return (
    <div className="messages">
      <h3>Messages</h3>
      {messages?.map((message, index) => {
        return (
          <p key={message.timestamp + "-" + index}>
            {message.userIcon}[{message.userNickname}] - {message.body}
          </p>
        );
      })}
      {isTyping ? (
        <p style={{ color: "lightgoldenrodyellow" }}>Someone is typing...</p>
      ) : null}
      <form
        style={{ display: "flex", gap: "16px", alignItems: "center" }}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(SocketMessageTypes.SEND_MESSAGE, { body: input });
          setInput("");
        }}
      >
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (!isTyping) {
              sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
                typing: true,
              });
              //   debounce(() => {
              //     sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
              //       typing: false,
              //     });
              //   }, 1000);
            }
          }}
          placeholder="Enter message to send"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

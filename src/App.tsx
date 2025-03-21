import React, { useState, useEffect, useCallback } from "react";
import {
  TelepartyClient,
  SocketEventHandler,
  SocketMessageTypes,
} from "teleparty-websocket-lib";
import Messages from "./components/Messages";
import Home from "./components/Home";
import { messageType } from "./types";

const App: React.FC = () => {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const [userList, setUserList] = useState([]);
  const [messages, setMessages] = useState<messageType[]>([]);
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [connectionLostMessage, setConnectionLostMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const initializeClient = useCallback(() => {
    if (client || roomId) return;
    const eventHandler: SocketEventHandler = {
      onConnectionReady: () => {
        console.log("Connection established");
      },
      onClose: () => {
        console.log("Socket closed.");
        setClient(null);
        if (isRoomJoined) {
          setConnectionLostMessage(
            `Seems connection was lost. Rejoin to play again`
          );
          setIsRoomJoined(false);
          setRoomId("");
          setMessages([]);
        }
      },
      onMessage: (message) => {
        console.log("message received", message);
        if (message.type === SocketMessageTypes.SEND_MESSAGE) {
          setMessages((currentMessages) => [...currentMessages, message.data]);
        } else if (message.type === "userList") {
          setUserList(message.data);
        } else if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
          setIsTyping(message.data.anyoneTyping);
        }
      },
    };
    setClient(new TelepartyClient(eventHandler));
  }, [client, roomId]);

  useEffect(() => {
    initializeClient();
  }, [initializeClient]);

  const createRoom = async (nickname: string, userIcon?: string) => {
    if (client && nickname) {
      const id = await client.createChatRoom(nickname, userIcon);
      setRoomId(id);
      setIsRoomJoined(true);
      setConnectionLostMessage("");
    }
  };

  const joinRoom = async (
    nickname: string,
    roomId: string,
    userIcon?: string
  ) => {
    if (client && roomId && nickname) {
      await client.joinChatRoom(nickname, roomId, userIcon);
      setIsRoomJoined(true);
      setRoomId(roomId);
      setConnectionLostMessage("");
    }
  };

  const sendMessage = (type: SocketMessageTypes, body: object) => {
    if (client) {
      client.sendMessage(type, body);
    }
  };

  return (
    <div>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>Teleparty Chat</h1>
        {isRoomJoined ? (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <h3>{userList.length} active</h3>
            <p>Joined room id - {roomId}</p>
            <button
              onClick={async () => {
                await client?.teardown();
                setIsRoomJoined(false);
                setMessages([]);
                setRoomId("");
                setConnectionLostMessage("");
              }}
            >
              Leave
            </button>
          </div>
        ) : null}
      </header>
      {connectionLostMessage ? (
        <p style={{ color: "orange" }}>{connectionLostMessage}</p>
      ) : null}
      {isRoomJoined ? (
        <Messages
          messages={messages}
          sendMessage={sendMessage}
          isTyping={isTyping}
        />
      ) : (
        <Home joinRoom={joinRoom} createRoom={createRoom} />
      )}
    </div>
  );
};

export default App;

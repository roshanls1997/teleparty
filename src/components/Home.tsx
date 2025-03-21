import { useState } from "react";

const ICONS = ["👤", "🐱", "🐶", "🐵", "🐼", "🐸", "🦊", "🐯", "🐰", "🦄"];

export default function Home(props: {
  joinRoom: (nickname: string, roomId: string, userIcon?: string) => void;
  createRoom: (nickName: string, userIcon?: string) => void;
}) {
  const { joinRoom, createRoom } = props;
  const [roomId, setRoomId] = useState("");
  const [userIcon, setUserIcon] = useState("👤");
  const [nickname, setNickname] = useState("");
  const [errorType, setErrorType] = useState<"name" | "room" | "both" | "">("");

  return (
    <div
      className="room-container"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <div className="join-room">
        <h3>Join a room or create your own</h3>
        <div
          className="action-container"
          style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
        >
          <select
            onChange={(e) => setUserIcon(e.target.value)}
            value={userIcon}
          >
            {ICONS.map((icon, index) => (
              <option key={index} value={icon}>
                {icon}
              </option>
            ))}
          </select>
          <div className="name">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter name"
            />
            {["both", "name"].includes(errorType) && nickname === "" ? (
              <p style={{ color: "red" }}>Name is required</p>
            ) : null}
          </div>
          <div className="room">
            <input
              value={roomId}
              onChange={(e) =>
                setRoomId(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
              placeholder="Enter room id to join"
            />
            {["both", "room"].includes(errorType) && roomId === "" ? (
              <p style={{ color: "red" }}>Room id is required</p>
            ) : null}
          </div>
          <button
            onClick={() => {
              if (nickname === "" && roomId === "") setErrorType("both");
              else if (nickname === "") {
                setErrorType("name");
              } else if (roomId === "") {
                setErrorType("room");
              } else {
                joinRoom(nickname, roomId, userIcon);
                setErrorType("");
              }
            }}
          >
            Join room
          </button>
          <button
            onClick={() => {
              if (nickname === "") setErrorType("name");
              else {
                createRoom(nickname, userIcon);
                setErrorType("");
              }
            }}
          >
            Create room
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";

interface Props {
  addMessage: (text: string) => void;
}

const ChatInput: React.FC<Props> = ({ addMessage }) => {
  const [text, setText] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && text.trim() !== "") {
      addMessage(text);
      setText("");
    }
  };

  return (
    <input
      type="text"
      className="w-full border rounded p-2"
      placeholder="Type a message..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyPress={handleKeyPress}
    />
  );
};

export default ChatInput;

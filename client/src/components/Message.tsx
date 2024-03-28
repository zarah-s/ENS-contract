import React from "react";
import { Message } from "../interfaces";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

const ChatMessage: React.FC<Message> = ({ message, from }) => {
  const { address } = useWeb3ModalAccount();
  const isUser = address?.toString() === from.toString();
  return (
    <div className={`text-sm py-1 ${isUser ? "text-right" : "text-left"}`}>
      <span
        className={`px-2 py-1 rounded-lg inline-block ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-300"
        }`}
      >
        {message}
      </span>
    </div>
  );
};

export default ChatMessage;

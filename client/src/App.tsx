import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./components/Message";
import ChatInput from "./components/Input";
import { ENSInfo, Message } from "./interfaces";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import useGetMessages from "./hooks/useGetMessages";
import { Controller } from "./controllers/Controller";
import useGetENS from "./hooks/useGetENS";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [myChats, setMyChats] = useState<ENSInfo[]>([]);
  const { walletProvider } = useWeb3ModalProvider();
  const { isConnected, chainId, address } = useWeb3ModalAccount();
  const ref = useRef<HTMLInputElement>(null);
  const [valid, setValid] = useState(false);
  const { loading, details: userENS } = useGetENS(
    walletProvider,
    isConnected,
    valid
  );

  const { globalMessages, chats } = useGetMessages(walletProvider, isConnected);
  const controller = new Controller(chainId, walletProvider);
  function extractMessages() {
    if (selectedChat) {
      const msgs = globalMessages.filter(
        (ft) =>
          ft.from.toString() === selectedChat.address_.toString() ||
          ft.to.toString() === selectedChat.address_.toString()
      );
      setMessages(msgs);
    }
  }

  function extractChats() {
    let ids: string[] = [];
    for (let i = 0; i < globalMessages.length; i++) {
      const element = globalMessages[i];

      if (element.from.toString() === address?.toString()) {
        if (!ids.includes(element.to.toString())) {
          ids.push(element.to.toString());
        }
      } else {
        if (!ids.includes(element.from.toString())) {
          ids.push(element.from.toString());
        }
      }
    }

    for (let i = 0; i < ids.length; i++) {
      const element = ids[i];
      // console.log(chats);
      const find = chats.find(
        (fd) => fd.address_?.toString() === element.toString()
      );
      // console.log(find);
      if (find) {
        setMyChats([...myChats, find]);
      }
    }
  }

  const [search, setSearch] = useState<ENSInfo | null>(null);

  const addMessage = async (text: string) => {
    const newMessage: Message = {
      from: address?.toString() ?? "",
      to: selectedChat?.address_ ?? "",
      message: text,
      userProfile: selectedChat!,
    };
    setMessages([...messages, newMessage]);
    const transaction = {
      from: address?.toString(),
      to: selectedChat?.address_.toString(),
      message: text,
    };
    const toastId = toast.loading("Processing");

    const provider = new ethers.BrowserProvider(walletProvider!);
    try {
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(JSON.stringify(transaction));
      const response = await fetch(
        "https://ens-contract.onrender.com/send-message",
        {
          method: "POST",
          body: JSON.stringify({ ...transaction, signature }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        toast.success(jsonResponse.message);
      } else {
        toast.error(jsonResponse.message);
      }
      toast.dismiss(toastId);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("OOPS!! SOMETHING_WENT_WRONG");
    }
  };
  const [registering, setRegistering] = useState<boolean>(false);
  const ensRef = useRef<HTMLInputElement>(null);
  const [fileImg, setFileImg] = useState<any>();
  const [selectedChat, setSelectedChat] = useState<ENSInfo | null>(null);
  const [cachedImageHash, setCachedImgHash] = useState<string | null>(null);
  const sendFileToIPFS = async () => {
    if (registering) return;
    if (fileImg && ensRef.current?.value) {
      try {
        if (cachedImageHash) {
          const tx = await controller.registerENS(
            cachedImageHash,
            ensRef.current.value.trim()
          );

          if (tx) {
            setCachedImgHash(null);
          } else {
            setCachedImgHash(cachedImageHash);
          }

          return;
        }
        setRegistering(true);
        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `${import.meta.env.VITE_API_KEY}`,
            pinata_secret_api_key: import.meta.env.VITE_SECRET_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = resFile.data.IpfsHash;
        const tx = await controller.registerENS(
          ImgHash,
          ensRef.current.value.trim()
        );

        if (tx) {
          setCachedImgHash(null);
          setValid(!setValid);
        } else {
          setCachedImgHash(ImgHash);
        }
        setRegistering(false);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  function processURL(hash: string): string {
    // return hash;
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  useEffect(() => {
    setMyChats([]);
    setSearch(null);
    setMessages([]);
  }, [address]);

  useEffect(() => {
    setMessages([]);
    extractMessages();
  }, [selectedChat]);

  useEffect(() => {
    extractChats();
  }, [globalMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isConnected) {
    return (
      <div className="h-screen">
        <nav className="py-3 shadow shadow-[rgba(255,255,255,.1)]">
          <div className="flex items-center justify-between container">
            {userENS ? (
              <div className="flex items-center gap-3">
                <img
                  src={processURL(userENS?.avatar ?? "")}
                  className="w-8 h-8 rounded-full"
                  alt=""
                />
                <h1 className=" madimi-one-regular text-2xl">
                  {userENS?.name}
                </h1>
              </div>
            ) : (
              <h1 className=" madimi-one-regular text-3xl">PYDE</h1>
            )}
            <w3m-button />
          </div>
        </nav>
        {loading ? (
          <div className="flex items-center justify-center w-full h-screen">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : userENS ? (
          <div className="max-w-3xl mx-auto flex mt-7">
            <div className="w-1/4 h-[82vh] overflow-y-auto bg-gray-100 shadow-md rounded p-4 mr-4">
              <h2 className="text-lg font-bold mb-4">CHATS</h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const result = await controller.searchENS(
                    ref.current?.value.trim() ?? ""
                  );
                  if (result) {
                    setSearch(result);
                  }
                }}
              >
                <input
                  ref={ref}
                  type="text"
                  placeholder="search..."
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </form>
              <ul className="space-y-3 mt-5">
                {search ? (
                  <li
                    onClick={() => setSelectedChat(search)}
                    className="py-1 border-b-[1px] pb-2 flex items-center gap-2"
                  >
                    <img
                      src={processURL(search.avatar)}
                      className="w-8 h-8 rounded-full"
                      alt=""
                    />
                    <p>{search.name}</p>
                  </li>
                ) : null}
                {myChats.map((chat, index) => (
                  <li
                    key={index}
                    onClick={() => setSelectedChat(chat)}
                    className="py-1 border-b-[1px] pb-2 flex items-center gap-2"
                  >
                    <img
                      src={processURL(chat.avatar)}
                      className="w-8 h-8 rounded-full"
                      alt=""
                    />
                    <p>{chat.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-3/4 bg-gray-100 h-[82vh] shadow-md rounded p-4">
              {selectedChat ? (
                <div className="">
                  <div className="flex items-center mb-4 gap-3">
                    <img
                      src={processURL(selectedChat.avatar)}
                      className="h-10 w-10 rounded-full"
                      alt=""
                    />
                    <h2 className="text-lg font-bold">{selectedChat.name}</h2>
                  </div>
                  <div
                    ref={messagesEndRef}
                    className="mb-4  h-[60vh] overflow-y-auto"
                  >
                    {messages.map((message, index) => (
                      <ChatMessage
                        key={index}
                        message={message.message}
                        from={message.from}
                        to={message.to}
                        userProfile={message.userProfile}
                      />
                    ))}
                  </div>
                  <ChatInput addMessage={addMessage} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  PYDE Chat
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className=" h-[80vh] w-full flex items-center justify-center ">
            <div className="w-1/2 bg-white shadow p-5">
              <h1 className="text-xl font-[600]">Register ENS</h1>
              <div className="flex mt-10 items-center justify-center">
                {/* <form></form> */}
                {fileImg ? (
                  <label
                    htmlFor="file"
                    className="h-32 cursor-pointer w-32 bg-gray-300 rounded-full"
                  >
                    <img
                      src={URL.createObjectURL(fileImg)}
                      className="w-full h-full rounded-full"
                      alt=""
                    />
                  </label>
                ) : (
                  <label
                    htmlFor="file"
                    className="h-32 cursor-pointer w-32 bg-gray-300 rounded-full"
                  ></label>
                )}
              </div>
              <input
                ref={ensRef}
                type="text"
                placeholder="Name..."
                className="outline-none border-[1px] p-3 rounded-lg mt-10 w-full"
                name=""
                id=""
              />
              <button
                disabled={registering}
                onClick={sendFileToIPFS}
                className="bg-blue-400 w-full p-3 text-white mt-10 rounded"
              >
                {registering ? "Loading..." : "Register"}
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    setFileImg(e.target.files[0]);
                  }
                  console.log("sdfs");
                }}
                className="w-0 h-0"
                name=""
                id="file"
              />
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <w3m-button />
      </div>
    );
  }
};

export default App;

import { ethers } from "ethers";
import chatAbi from "./chatAbi.json";
import ENSAbi from "./ENSAbi.json";
import { JsonRpcSigner } from "ethers";
import { JsonRpcProvider } from "ethers";

export const getChatContract = (providerOrSigner: JsonRpcSigner | JsonRpcProvider) =>
    new ethers.Contract(
        import.meta.env.VITE_CHAT_ADDRESS,
        chatAbi,
        providerOrSigner
    );



export const getENSContract = (providerOrSigner: JsonRpcSigner | JsonRpcProvider) =>
    new ethers.Contract(
        import.meta.env.VITE_ENS_ADDRESS,
        ENSAbi,
        providerOrSigner
    );

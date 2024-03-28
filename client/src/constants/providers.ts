import { Eip1193Provider, ethers } from "ethers";

// read only provider pointing to sepolia. It allows read only access to the sepolia blockchain
export const readOnlyProvider = new ethers.JsonRpcProvider(
    import.meta.env.VITE_rpc_url
);

export const wssProvider = new ethers.WebSocketProvider(
    import.meta.env.VITE_wss_rpc_url
);

// read/write provider, that allows you to read data and also sign transaction on whatever chain it's pointing to
export const getProvider = (provider: Eip1193Provider) => new ethers.BrowserProvider(provider);

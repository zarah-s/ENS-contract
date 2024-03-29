import { Eip1193Provider, ethers } from "ethers"
import { useEffect, useState } from "react"
import { getChatContract } from "../constants/contracts";
import { getProvider } from "../constants/providers";
import multicallAbi from "../constants/multicall.json"
import ENSAbi from "../constants/ENSAbi.json";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ENSInfo, Message } from "../interfaces";
const useGetMessages = (provider: Eip1193Provider | undefined, isConnected: boolean) => {
    const [globalMessages, setMessages] = useState<Message[]>([]);
    const [chats, setChats] = useState<ENSInfo[]>([])
    const { address } = useWeb3ModalAccount();

    useEffect(() => {
        (async () => {

            const itf = new ethers.Interface(ENSAbi);
            if (!isConnected) return;

            if (!address) return;
            const readWriteProvider = getProvider(provider!);
            const signer = await readWriteProvider.getSigner();
            // await signer.signMessage("sendMessage")
            const contract = getChatContract(signer);
            // setMessages([])
            // setChats([])
            try {
                // alert("sdf")
                const result = await contract.getUserMessages();
                let calls = [];
                let nonZero = [];
                if (!address) return;
                for (let i = 0; i < result.length; i++) {
                    if (result[i].from !== ethers.ZeroAddress) {
                        nonZero.push(result[i])
                        if (result[i].from === address) {
                            calls.push({
                                target: import.meta.env.VITE_ENS_ADDRESS,
                                callData: itf.encodeFunctionData("getInfoFromAddress", [result[i].to]),
                            })
                        } else {
                            calls.push({
                                target: import.meta.env.VITE_ENS_ADDRESS,
                                callData: itf.encodeFunctionData("getInfoFromAddress", [result[i].from]),
                            })
                        }
                    }

                }
                const multicall = new ethers.Contract(
                    import.meta.env.VITE_multicall_address,
                    multicallAbi,
                    signer
                );
                const callResults = await multicall.tryAggregate.staticCall(
                    false,
                    calls
                );
                let response = [];
                for (let i = 0; i < callResults.length; i++) {
                    const infoRes = itf.decodeFunctionResult("getInfoFromAddress", callResults[i][1])[0];
                    // console.log(infoRes)
                    const info = {
                        address_: infoRes.address_,
                        avatar: infoRes.avatar,
                        name: infoRes.name

                    }
                    response.push(info)

                }


                let batched: Message[] = [];
                for (let i = 0; i < response.length; i++) {
                    const element = response[i];
                    batched.push(
                        {
                            from: nonZero[i].from,
                            message: nonZero[i].message,
                            to: nonZero[i].to,
                            userProfile: element
                        }
                    )

                }
                setChats(response);
                setMessages(batched)

            } catch (error) {
                console.error(error)
            }
        })()
    }, [isConnected, address])

    return { globalMessages, chats };
}

export default useGetMessages;

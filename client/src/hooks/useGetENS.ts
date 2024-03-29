import { Eip1193Provider } from "ethers"
import { useEffect, useState } from "react"
import { getENSContract } from "../constants/contracts";
import { getProvider } from "../constants/providers";
import { ENSInfo } from "../interfaces";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
const useGetENS = (provider: Eip1193Provider | undefined, isConnected: boolean, valid: boolean) => {
    const [details, setDetails] = useState<ENSInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const { address } = useWeb3ModalAccount()
    useEffect(() => {
        (async () => {
            // const itf = new ethers.Interface(ChatAbi);
            if (!isConnected) return;
            // setDetails(null)
            const readWriteProvider = getProvider(provider!);
            const signer = await readWriteProvider.getSigner();
            const contract = getENSContract(signer);

            try {
                setLoading(loading);
                const result = await contract.getInfoFromAddress(address);
                if (result.name) {
                    setDetails(result);
                }
                setLoading(false);

            } catch (error) {
                console.error(error)
            }
        })()
    }, [isConnected, address, valid])

    return { loading, details };
}

export default useGetENS;

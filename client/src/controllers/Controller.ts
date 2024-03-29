import { Eip1193Provider } from "ethers";
import { isSupportedChain } from "../utils";
// import { getProvider } from "../constants/providers";
// import { getProposalsContract } from "../constants/contracts";
import { toast } from "react-toastify";
import { getProvider } from "../constants/providers";
import { getChatContract, getENSContract } from "../constants/contracts";
import { ENSInfo } from "../interfaces";

export class Controller {
    chainId: number | undefined = undefined;
    walletProvider: Eip1193Provider | undefined = undefined;
    loading = false;


    constructor(_chainId: number | undefined, _walletProvider: Eip1193Provider | undefined) {
        this.chainId = _chainId
        this.walletProvider = _walletProvider
    }


    sendMessage = async (msg: string, to: string) => {
        if (this.loading) return;
        if (!this.chainId) return toast.error("Connect wallet")
        if (!isSupportedChain(this.chainId!)) return toast.error("Wrong network");
        this.loading = true;
        const toastId = toast.loading("Processing");
        const readWriteProvider = getProvider(this.walletProvider!);
        const signer = await readWriteProvider.getSigner();
        const contract = getChatContract(signer);
        try {
            const transaction = await contract.sendMessage(msg, to);
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            toast.dismiss(toastId)
            if (receipt.status) {
                toast.success("message sent", { autoClose: 5000 })
                this.loading = false;
                return true;
            }
            toast.error("send fail", { autoClose: 5000 })
            this.loading = false;
            return true;
        } catch (error) {
            console.error(error)
            toast.dismiss(toastId)
            toast.error((error as any)?.reason ?? "An unknown error occured", { autoClose: 5000 })
            this.loading = false;
            return false;
        }
    };


    registerENS = async (avatar: string, name: string): Promise<boolean | undefined> => {
        if (this.loading) return;
        if (!this.chainId) {
            toast.error("Connect wallet");
            return;
        }
        if (!isSupportedChain(this.chainId!)) {
            toast.error("Wrong network");
            return;
        }
        this.loading = true;
        const toastId = toast.loading("Processing");
        const readWriteProvider = getProvider(this.walletProvider!);
        const signer = await readWriteProvider.getSigner();
        const contract = getENSContract(signer);
        try {
            const transaction = await contract.register(avatar, name);
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            toast.dismiss(toastId)

            if (receipt.status) {
                toast.success("registration successful", { autoClose: 5000 })
                this.loading = false;
                return true;
            }
            toast.error("registration failed!", { autoClose: 5000 })
            this.loading = false;
            return false;
        } catch (error) {
            toast.dismiss(toastId)
            toast.error((error as any)?.reason ?? "An unknown error occured", { autoClose: 5000 })
            this.loading = false;
            return false;
        }
    };



    searchENS = async (name: string): Promise<ENSInfo | undefined> => {
        if (this.loading) return;
        if (!this.chainId) {
            toast.error("Connect wallet");
            return;
        }
        if (!isSupportedChain(this.chainId!)) {
            toast.error("Wrong network");
            return;
        }
        this.loading = true;
        const toastId = toast.loading("Processing");
        const readWriteProvider = getProvider(this.walletProvider!);
        const signer = await readWriteProvider.getSigner();
        const contract = getENSContract(signer);
        try {
            const transaction = await contract.getInfoFromName(name);
            console.log("transaction: ", transaction);
            toast.dismiss(toastId)

            if (transaction.avatar) {
                toast.success("name found", { autoClose: 5000 })
                return transaction;
            } else {
                toast.error("No match", { autoClose: 5000 })

            }
        } catch (error) {
            console.error(error)
            toast.dismiss(toastId)
            toast.error((error as any)?.reason ?? "An unknown error occured", { autoClose: 5000 })
            this.loading = false;
            return;
        }
    };


}


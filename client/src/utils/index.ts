import { SUPPORTED_CHAIN } from "../connection";

export const isSupportedChain = (chainId: number) =>
    Number(chainId) === SUPPORTED_CHAIN;

include .env


deployENS:
	forge create --rpc-url ${RPC_URL} \
    --private-key ${PRIVATE_KEY} \
    --etherscan-api-key ${ETHERSCAN_API_KEY} \
    --verify \
    src/ENS.sol:ENS


verifyENS:
	forge verify-contract \
    --chain-id 11155111 \
    --num-of-optimizations 1000000 \
    --watch \
    --etherscan-api-key ${ETHERSCAN_API_KEY} \
    $(contract) \
    src/ENS.sol:ENS 

deployChat:
	forge create --rpc-url ${RPC_URL} \
    --constructor-args $(ensAddress) $(relayer) \
    --private-key ${PRIVATE_KEY} \
    --etherscan-api-key ${ETHERSCAN_API_KEY} \
    --verify \
    src/Chat.sol:Chat
export interface Message {
    from: string;
    to: string;
    message: string;
    userProfile: ENSInfo
}




export interface ENSInfo {
    name: string;
    avatar: string;
    address_: string;
}
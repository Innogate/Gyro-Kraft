export interface userCreate {
    name: string,
    address: string,
    phone_no: string | number,
    whatsapp_no: string | number,
    email: string,
    photo: string,
    password_hash: string,
    role: string
}

export interface userCreateResponse {
    id: number,
    name: string,
    address: string,
    phone_no: string | number,
    whatsapp_no: string | number,
    email: string,
    photo: string,
    password_hash: string,
    role: string,
    created_at: string,
    disabled: boolean
}

export interface userLogin {
    mobile: string,
    password: string
}

export interface userLoginResponse {
    otp_id: number,
}

export interface loginOTPVerify {
    otp_id: number | string,
    otp: string | number
}

export interface loginOTPVerifyResponse {
    token: string
}

export interface allUsers {
    max: number | string,
    current: number | string
}

export interface allUsersResponse {
    users: userCreateResponse[],
    total: number | string
}

export interface disableEnableUser {
    user_id: number | string
}

export interface updateUser {
    id: number | string,
    name: string,
    address: string,
    phone_no: string | number,
    whatsapp_no: string | number,
    email: string,
    photo: string,
    disabled: number | string,
    password_hash: string,
    role: string
}

export interface searchUser {
    query: string | number
}

export interface searchUserResponse {
    users: userCreateResponse[],
}

interface Role {
    key: string;
}

export interface Payload {
    id?: string;
    email?: string;
    name?: string;
    Role?: Role;
    resetPasswordToken?: string;
    accountName?: string;
    password?: string;
    updateAt?: string;
}

export interface Context {
    subject: string;
    template: string;
    url?: string;
}
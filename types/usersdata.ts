export interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    emailAddresses: {
        emailAddress: string;
    }[];
    publicMetadata: {
        enrNumber: string;
        phoneNumber: string;
    }
    imageUrl: string;
}
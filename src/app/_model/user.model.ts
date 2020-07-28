export class UserModel {
  name: string;
  email: string;
  phone: string;
  nameFirstLetter: string;

  constructor(response: UserBackendModel) {
    this.name = response.displayName;
    this.email = response.email;
    this.phone = response.phoneNumber;
    this.nameFirstLetter = (response.displayName || response.email).charAt(0);
  }
}

export interface UserBackendModel {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
}

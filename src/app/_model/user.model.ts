export class UserModel {
  name: string;
  email: string;
  phone: string;

  constructor(response: UserBackendModel) {
    this.name = response.displayName;
    this.email = response.email;
    this.phone = response.phoneNumber;
  }
}

export interface UserBackendModel {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  emailVerified: boolean;
}

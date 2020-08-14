export class UserModel {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  nameFirstLetter?: string;

  constructor(response: UserBackendModel) {
    this.id = response.uid;
    this.name = response.displayName;
    this.email = response.email || null;
    this.phone = response.phoneNumber || null;
    this.nameFirstLetter = (response.displayName || response.email).charAt(0) || null;
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

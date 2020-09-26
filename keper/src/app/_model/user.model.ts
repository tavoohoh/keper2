export class UserModel {
  id: string;
  fk: string;
  name: string;
  token?: string;
  email?: string;
  phone?: string;
  nameFirstLetter?: string;
  displayName?: string;
  uid?: string;

  constructor(user: UserBackendModel, userToken: string, userUid: string) {
    this.id = userUid;
    this.fk = user.uid;
    this.name = user.displayName;
    this.email = user.email || null;
    this.phone = user.phoneNumber || null;
    this.nameFirstLetter = (user.displayName || user.email).charAt(0) || null;
    this.token = userToken;
  }
}

export interface UserBackendModel {
  uid: string;
  email: string;
  getIdToken: () => Promise<string>;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
}


export interface UserDbModel {
  uid?: string;
  fk?: string;
  email: string;
  displayName: string;
}

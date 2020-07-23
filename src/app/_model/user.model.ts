export class UserModel {
  name: string;
  email: string;
  phone: string;

  constructor(response: UserBackendModel) {
    this.name = response.display_name;
    this.email = response.email;
    this.phone = response.phone_number;
  }
}

export interface UserBackendModel {
  display_name: string;
  email: string;
  phone_number: string;
  photo_url: string;
  provider_id: string;
  uid: string;
}

export interface UserModel {
  readonly uid: string;
  readonly email: string;
  readonly displayName?: string;
  readonly photoURL?: string;
  readonly phoneNumber?: string;
  readonly emailVerified?: boolean;
  readonly password?: string;
}

export interface UserAuthModel {
  readonly iss: string;
  readonly aud: string;
  readonly auth_time: number;
  readonly user_id: string;
  readonly sub: string;
  readonly iat: number;
  readonly exp: number;
  readonly email: string;
  readonly email_verified: boolean;
  readonly firebase: any;
  readonly uid: string;
}

export interface KpUserModel {
  fk: string;
  email: string;
  displayName: string;
  tasks?: Array<string>;
  groups?: Array<string>;
}

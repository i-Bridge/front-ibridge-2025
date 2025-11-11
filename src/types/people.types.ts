export interface Child {
  id?: number  | undefined;
  name: string;
  birth: string;
  gender: string;
  //profileImage: string;
}

export interface Parent {
  id: number;
  name: string;
  email?: string;
  own?:boolean;
}
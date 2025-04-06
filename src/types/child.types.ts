export interface ChildWithoutId {
  name: string;
  birthday: string;
  gender: string;
  //profileImage: string;
}

export interface Child extends ChildWithoutId {
  id: number;
}
export interface ChildwithoutId {
  name: string;
  birthday: string;
  gender: string;
  //profileImage: string;
}

export interface Child extends ChildwithoutId {
  id: number;
}
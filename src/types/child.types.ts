export interface Child {
  id: number;
  name: string;
  birthday: string;
  gender: string;
  profileImage: string;
}

export interface ChildData {
  children: Child[]; // 자식들의 배열
}

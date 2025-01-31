export interface Post {
  id: number;
  title: string;
  status: '완료' | '예정' | '반복' | '진행 중';
  order: number;
}

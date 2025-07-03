export interface PageProps<T = {}> {
  params: T;
  searchParams?: { [key: string]: string | string[] | undefined };
}

// 자주 사용하는 조합
export type ChildPageProps = PageProps<{ childId: string }>;

export interface Subject {
    subjectId: number;
    subjectTitle: string;
  }

export interface SubjectWithIsAnswer extends Subject {
  isAnswer: boolean;
}
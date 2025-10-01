export interface Subject {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
  date: string; // yyyy-MM-dd
  image: string | null;
}

export interface ScheduledSubject {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
  date: string; // yyyy-MM-dd
}
export interface Subject {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
  date: string; // yyyy-MM-dd
  image?: string | null;
}


export interface DateSubject{
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
  date: string; // yyyy-MM-dd
  questions: Question[];
}

export interface ScheduledSubject {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
  date: string; // yyyy-MM-dd
}


export interface Question {
  questionId: number;
  text: string;
  video: string;
  image: string;
  answer: string;
}

export interface Analysis {
    analysisId: number;
    answer: string;
    video: string;
  }
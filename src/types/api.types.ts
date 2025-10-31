import { Child } from "./child.types";
export interface LoginData {
    accepted: boolean;
    send: boolean
    familyName: string;
    children: Child[];
  }
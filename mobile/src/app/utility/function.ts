import { environment } from "../../environments/environment";

export function debug(...args: any[]) {
  if (!environment.production) {
    console.log(...args);
  }
}

import { Dispatch, SetStateAction } from "react";

export type SetValue<T> = Dispatch<SetStateAction<T>>;

export function throttle(callback: Function, wait: number = 300) {
  let timeoutID: ReturnType<typeof setTimeout>;

  // keep track of the last time callback was executed
  let lastExecutionTime: number;

  let cancelled: boolean;

  // Function to clear existing timeout
  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  }

  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  }

  let inThrottle: boolean;

  // our throttled function
  function wrapper(this: any, ...args: any[]) {
    if (cancelled) {
      return;
    }
    const context = this;
    if (!inThrottle) {
      callback.apply(context, args);
      lastExecutionTime = Date.now();
      inThrottle = true;
    } else {
      clearExistingTimeout();
      timeoutID = setTimeout(() => {
        if (Date.now() - lastExecutionTime >= wait) {
          callback.apply(context, args);
          lastExecutionTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastExecutionTime), 0));
    }
  }

  wrapper.cancel = cancel;

  return wrapper;
}

export function debounce(callback: Function, wait: number = 300) {
  let timeoutID: ReturnType<typeof setTimeout>;

  let cancelled: boolean;

  // Function to clear existing timeout
  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  }

  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  }

  // our debounced function
  function wrapper(this: any, ...args: any[]) {
    if (cancelled) {
      return;
    }
    const context = this;
    clearExistingTimeout();
    timeoutID = setTimeout(() => {
      callback.apply(context, args);
    }, wait);
  }

  wrapper.cancel = cancel;

  return wrapper;
}

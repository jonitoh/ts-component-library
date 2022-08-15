import { useEffect, useRef, useState } from "react";

// Naively indicates whether a value has been changed since first encounter
export default function useValueChanged(value: string): boolean {
  const initial = useRef(value);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (!isTouched && initial.current !== value) {
      setIsTouched(true);
    }
  }, [isTouched, value]);

  return isTouched;
}

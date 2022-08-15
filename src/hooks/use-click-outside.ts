// cf. https://usehooks.com/useOnClickOutside/
import { useEffect, RefObject, useCallback } from "react";

type Handler = ((event: MouseEvent) => void) | (() => void);

export default function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: "mousedown" | "mouseup" = "mousedown"
) {
  const useHandler = useCallback(
    (event: MouseEvent) => handler(event),
    [handler]
  );
  const listener = useCallback(
    (event: MouseEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      const element = ref?.current;
      if (!element || element.contains(event.target as Node)) {
        return;
      }
      useHandler(event);
    },
    [ref]
  );

  useEffect(
    () => {
      document.addEventListener(mouseEvent, listener);
      return () => {
        document.removeEventListener(mouseEvent, listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}
/*
import { RefObject, useEffect } from 'react';

/**
 * Hook to handle Clicking Outside element
 * @param ref Ref for inside element
 * @param callback Callback upon clicking anywhere outside of the element specified in ref
 *
const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref?.current && !ref?.current?.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [ref, callback]);
};

export default useClickOutside;
*/

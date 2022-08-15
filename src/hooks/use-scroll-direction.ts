// https://www.fabrizioduroni.it/2022/01/02/react-detect-scroll-direction/
import { useEffect, useState } from 'react';

export enum ScrollDirection {
  up = 'up',
  down = 'down',
  static = 'static',
  initial = 'initial',
}

type Direction = keyof typeof ScrollDirection;

export function checkScrollDirection(
  scrolledDirection: ScrollDirection,
  directions: Direction | Direction[]
) {
  const ourDirections: Direction[] = typeof directions === 'string' ? [directions] : directions;
  return ourDirections.some((dir) => dir === scrolledDirection);
}

const isBrowser = typeof window !== `undefined`;

function getScrollPositionFromWindow() {
  if (!isBrowser) return 0;
  return window.pageYOffset;
}

export default function useScrollDirection(threshold: number = 0): ScrollDirection {
  const [scrollDir, setScrollDir] = useState(ScrollDirection.initial);

  useEffect(() => {
    let previousScrollYPosition = getScrollPositionFromWindow();

    function scrolledMoreThanThreshold(currentScrollYPosition: number) {
      return Math.abs(currentScrollYPosition - previousScrollYPosition) > threshold;
    }

    function isAtInitialPosition(currentScrollYPosition: number) {
      return currentScrollYPosition === 0;
    }

    function isScrollingUp(currentScrollYPosition: number) {
      return (
        currentScrollYPosition > previousScrollYPosition &&
        !(previousScrollYPosition > 0 && currentScrollYPosition === 0) &&
        !(currentScrollYPosition > 0 && previousScrollYPosition === 0)
      );
    }

    function updateScrollDirection() {
      const currentScrollYPosition = getScrollPositionFromWindow();

      if (scrolledMoreThanThreshold(currentScrollYPosition)) {
        let newScrollDirection: ScrollDirection;
        if (isAtInitialPosition(currentScrollYPosition)) {
          newScrollDirection = ScrollDirection.initial;
        } else {
          newScrollDirection = isScrollingUp(currentScrollYPosition)
            ? ScrollDirection.down
            : ScrollDirection.up;
        }
        setScrollDir(newScrollDirection);
        previousScrollYPosition = currentScrollYPosition > 0 ? currentScrollYPosition : 0;
      } else {
        setScrollDir(ScrollDirection.static);
      }
    }

    function onScroll() {
      window.requestAnimationFrame(updateScrollDirection);
    }

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollDir;
}

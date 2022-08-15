import { useState, useEffect } from 'react';
import useId from './use-id';

export type Options = {
  id?: string;
  prefixId?: string;
  tagName?: string;
  className?: string;
  addedPosition?: 'prepend' | 'append';
};

export default function useDynamicContainer({
  id,
  prefixId,
  tagName = 'div',
  className,
  addedPosition = 'prepend',
}: Options): [boolean, string] {
  const [loaded, setLoaded] = useState(false);
  const containerId = id || useId(prefixId, 'uuid');

  useEffect(() => {
    const container = document.getElementById(containerId) || document.createElement(tagName);
    container.id = containerId;
    if (className) container.classList.add(className);
    switch (addedPosition) {
      case 'prepend':
        document.getElementsByTagName('body')[0].prepend(container);
        break;

      case 'append':
        document.getElementsByTagName('body')[0].append(container);
        break;

      default:
        console.error(
          `addedPosition should be 'prepend' or 'append'. Instead, it's ${addedPosition}`
        );
        break;
    }
    setLoaded(true);

    function cleanUp() {
      document.getElementsByTagName('body')[0].removeChild(container);
    }
    return cleanUp;
  }, [containerId]);

  return [loaded, containerId];
}

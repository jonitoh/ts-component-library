import React, { ElementType, ReactNode } from 'react';

export type Props<Item, As extends ElementType> = {
  items: Item[];
  renderItem: (item: Item) => ReactNode;
  as?: As;
};

export default function List<Item, As extends ElementType>({
  items,
  renderItem,
  as,
  ...rest
}: Props<Item, As> & Omit<React.ComponentPropsWithoutRef<As>, keyof Props<Item, As>>) {
  const Component = as ?? 'ul';
  return <Component {...rest}>{items.map(renderItem)}</Component>;
}

List.defaultProps = {
  as: undefined,
};

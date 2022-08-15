import React, { useState, ElementType, ReactNode } from "react";
import { List } from "#/components/common/list";

export type Props<Item, As extends ElementType> = {
  items: Item[];
  renderItem: (
    item: Item,
    setSelectedValue: (value: string) => void
  ) => ReactNode;
  as?: As;
  defaultItemKey: string;
  findDefaultItem: (items: Item[], value: string) => Item;
};

export default function DynamicSelector<Item, As extends ElementType>({
  items,
  renderItem,
  as,
  defaultItemKey,
  findDefaultItem,
  ...rest
}: Props<Item, As> &
  Omit<React.ComponentPropsWithoutRef<As>, keyof Props<Item, As>>) {
  const [selectedValue, setSelectedValue] = useState(defaultItemKey);
  const Component = as ?? "div";

  return (
    <Component {...rest}>
      {renderItem(findDefaultItem(items, selectedValue), setSelectedValue)}
      <List
        as="select"
        items={items}
        renderItem={(item) => renderItem(item, setSelectedValue)}
      />
    </Component>
  );
}

DynamicSelector.defaultProps = {
  as: undefined,
};

import React, {
  ElementType,
  ReactNode,
  ChangeEventHandler,
  SelectHTMLAttributes,
} from "react";
import { List } from "#/components/common/list";

type Option = {
  label: string;
  value: string;
};

export type Props<Item extends Option, As extends ElementType> = {
  items: Item[];
  renderItem?: (item: Item) => ReactNode;
  as?: As;
  defaultItem: Item;
  renderDefaultItem: (item: Item) => ReactNode;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  propsOnSelect?: SelectHTMLAttributes<HTMLSelectElement>;
};

function genericRenderItem<Item extends Option>(item: Item) {
  return (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  );
}

export default function TextSelector<
  Item extends Option,
  As extends ElementType
>({
  items,
  renderItem,
  as,
  defaultItem,
  renderDefaultItem,
  onChange,
  propsOnSelect,
  ...rest
}: Props<Item, As> &
  Omit<React.ComponentPropsWithoutRef<As>, keyof Props<Item, As>>) {
  if (!renderItem) return null;

  const Component = as ?? "div";

  return (
    <Component {...rest}>
      {renderDefaultItem(defaultItem)}
      <List
        as="select"
        items={items}
        renderItem={renderItem}
        {...({
          ...propsOnSelect,
          onChange,
        } as SelectHTMLAttributes<HTMLSelectElement>)}
      />
      {items.map(renderItem)}
    </Component>
  );
}

TextSelector.defaultProps = {
  renderItem: genericRenderItem,
  as: undefined,
  onChange: undefined,
  propsOnSelect: {},
};

import React, { useState, ElementType, ReactNode, MouseEvent } from "react";
import { List } from "#/components/common/list";
import classNames from "classnames";
import styles from "./dropdown.module.scss";

type OnClick = (event?: MouseEvent) => void;

type RenderLabelArgs = {
  label: string;
  className?: string;
  onClick?: OnClick;
};

// label as a link or a button

export type Props<Item, As extends ElementType> = {
  items: Item[];
  renderItem: (item: Item) => ReactNode;
  as?: As;
  asList?: ElementType;
  renderLabel: string | RenderLabelArgs | ((onClick?: OnClick) => ReactNode);
};

function renderLabelFromString(
  label: string,
  className?: string,
  onClick?: OnClick
) {
  return (
    <button
      className={classNames([styles.btn, className])}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function Dropdown<Item, As extends ElementType>({
  items,
  renderItem,
  as,
  asList,
  renderLabel,
  ...rest
}: Props<Item, As> &
  Omit<React.ComponentPropsWithoutRef<As>, keyof Props<Item, As>>) {
  const [isOpen, setIsOpen] = useState(false);
  const Component = as ?? "div";

  function useDropdown() {
    setIsOpen(!isOpen);
  }

  function renderLabelForDropdown() {
    if (renderLabel instanceof Function) {
      return renderLabel(useDropdown);
    }
    if (typeof renderLabel === "string") {
      return renderLabelFromString(renderLabel, undefined, useDropdown);
    }
    const { label, className, onClick } = renderLabel;
    function customOnClick(event?: MouseEvent) {
      if (onClick) {
        onClick(event);
      }
      useDropdown();
    }
    return renderLabelFromString(label, className, customOnClick);
  }

  return (
    <Component {...rest}>
      {renderLabelForDropdown()}
      <List
        as={asList}
        items={items}
        renderItem={renderItem}
        className={classNames([styles.list, isOpen && styles.open])}
      />
    </Component>
  );
}

Dropdown.defaultProps = {
  as: undefined,
  asList: undefined,
};

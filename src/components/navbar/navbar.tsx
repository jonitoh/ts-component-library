import React, { useCallback, HTMLAttributes } from 'react';
import classNames from 'classnames';
import useToggle from '#hooks/use-toggle';
import useId from '#/hooks/use-id';
import useScrollDirection, { checkScrollDirection } from '#hooks/use-scroll-direction';
import { FaBars, FaSlidersH, FaTimes, FaAngleDown, FaSearch } from 'react-icons/fa';
import Button from '#common/button/button';
import ThemeModal from '#common/theme-modal/theme-modal';
import NavbarBox from './navbar-box/navbar-box';
import styles from './navbar.module.scss';

// TODO: graphql here -- START
type MenuItemAsUnique = {
  name: string;
  slug: string;
  type: 'unique';
  options?: object;
};
function makeItemsAsUnique(length: number): MenuItemAsUnique[] {
  return Array.from({ length }, (_, i) => ({
    name: `Unique ${i}`,
    slug: `/unique-${i}`,
    type: 'unique',
    options: {},
  }));
}

type MenuItemAsDropdown = {
  name: string;
  slug: string;
  type: 'dropdown';
  options: MenuItemAsUnique[];
};
function makeItemsAsDropdown(length: number, maxItems: number = 4): MenuItemAsDropdown[] {
  return Array.from({ length }, (_, i) => ({
    name: `Dropdown ${i}`,
    slug: `/dropdown-${i}`,
    type: 'dropdown',
    options: makeItemsAsUnique(Math.floor(Math.random() * maxItems) + 1),
  }));
}

type MenuItemAsBox = {
  name: string;
  slug: string;
  type: 'box';
  options: object;
};
function makeItemsAsBox(length: number): MenuItemAsBox[] {
  return Array.from({ length }, (_, i) => ({
    name: `Box ${i}`,
    slug: `/box-${i}`,
    type: 'box',
    options: { test: Math.random() },
  }));
}

type MenuItem = MenuItemAsUnique | MenuItemAsDropdown | MenuItemAsBox;

const _items: MenuItem[] = ([] as MenuItem[]).concat(
  makeItemsAsUnique(3) // ,
  // makeItemsAsDropdown(1),
  // makeItemsAsBox(1)
);
// TODO: graphql here -- END

/* functions for building part of the navigation */
function renderMenuItemAsUnique(item: MenuItemAsUnique, prefixKey?: string) {
  const keyForUnique = prefixKey ? `${prefixKey}--${item.name.toLowerCase()}` : undefined;
  return (
    <li className={styles.navigation__menu__item} key={keyForUnique}>
      <a href={item.slug} className={styles.navigation__link}>
        {item.name}
      </a>
    </li>
  );
}

function renderMenuItemAsDropdown(item: MenuItemAsDropdown, prefixKey?: string) {
  const keyForDropdown = prefixKey ? `${prefixKey}--${item.name.toLowerCase()}` : undefined;
  const prefixKeyForItem = `dropdown-item-${Math.floor(Math.random() * 10000)}`;
  return (
    <li className={styles.navigation__menu__item} key={keyForDropdown}>
      <a href={item.slug} className={styles.navigation__link}>
        {item.name}
        <FaAngleDown />
      </a>
      <ul className={styles.navigation__menu__dropdown}>
        {item.options.map((it) => {
          const key = `${keyForDropdown || prefixKeyForItem}--${it.name.toLowerCase()}`;
          return (
            <li className={styles.navigation__menu__dropdown__item} key={key}>
              <a href={it.slug} className={styles.navigation__link}>
                {it.name}
              </a>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

function renderMenuItemAsBox(item: MenuItemAsBox, prefixKey?: string) {
  const keyForBox = prefixKey ? `${prefixKey}--${item.name.toLowerCase()}` : undefined;
  return (
    <li className={styles.navigation__menu__item} key={keyForBox}>
      <a href={item.slug} className={styles.navigation__link}>
        {item.name}
        <FaAngleDown />
      </a>
      <div className={classNames(['mega-box', styles.navigation__menu__box])}>
        <NavbarBox {...item.options} />
      </div>
    </li>
  );
}

export interface Props extends HTMLAttributes<HTMLDivElement> {
  isSticky?: boolean;
  hasFullWidth?: boolean;
  hasEffectOnScroll?: boolean;
  scrollThreshold?: number;
  maxItems?: number;
  labelForMaxItems?: string;
}

export default function Navbar({
  isSticky,
  hasFullWidth,
  hasEffectOnScroll,
  scrollThreshold,
  maxItems,
  labelForMaxItems,
  ...rest
}: Props) {
  const formatMenu = useCallback(
    function _formatMenu(items: MenuItem[]): MenuItem[] {
      if (maxItems && items.length > maxItems) {
        return [
          {
            name: labelForMaxItems || 'Rubriques',
            slug: '/hihi', // voir si on doit le mettre dans la query
            type: 'dropdown',
            options: items.map(({ name, slug }) => ({
              name,
              slug,
              type: 'unique',
              options: {},
            })),
          },
        ];
      }
      return items;
    },
    [maxItems, labelForMaxItems]
  );
  // const menuItems = formatMenu(useQuery(GetMainNavigationQuery));
  // const _items = useQuery(GetMainNavigationQuery);
  const menuItems = formatMenu(_items);
  const [showMenu, setShowMenu] = useToggle(false);
  const [showSearchBar, setShowSearchBar] = useToggle(false);
  const scrollDir = useScrollDirection(scrollThreshold);
  const { className, ...props } = rest;

  const [showSettings, setShowSettings] = useToggle(true);

  const navBarId = useId('main-navigation-');

  function renderMenuItem(item: MenuItem, prefixKey?: string) {
    switch (item.type) {
      case 'unique':
        return renderMenuItemAsUnique(item, prefixKey);
      case 'dropdown':
        return renderMenuItemAsDropdown(item, prefixKey);
      case 'box':
        return renderMenuItemAsBox(item, prefixKey);
      default:
        console.warn(`incorrect type: it should be 'unique', 'dropdown' or 'box'.`);
        return null;
    }
  }

  return (
    <nav
      className={classNames([
        styles.navigation,
        hasFullWidth && styles['full-width'],
        isSticky && styles.sticky,
        hasEffectOnScroll && checkScrollDirection(scrollDir, 'up') && styles['scroll-up'],
        hasEffectOnScroll && checkScrollDirection(scrollDir, 'down') && styles['scroll-down'],
        className,
      ])}
      aria-label="main navigation"
      {...props}
    >
      <div className={styles.navigation__wrapper}>
        <div className={styles.navigation__brand}>
          <span>Logo</span>
          <span>Motto</span>
        </div>
        <ul className={classNames([styles.navigation__menu, showMenu && styles['show-menu']])}>
          <Button
            type="button"
            hasOnlyIcon
            icon={<FaTimes />}
            className={styles.navigation__menu__toggle}
            onClick={setShowMenu}
          >
            Access to the menu
          </Button>
          {menuItems.map((item) => renderMenuItem(item, navBarId))}
        </ul>
        <div className={styles.navigation__other}>
          <div className={styles.navigation__search}>
            <Button
              type="button"
              variant="apparent"
              border="circle"
              hasOnlyIcon
              icon={<FaSearch />}
              onClick={setShowSearchBar}
            >
              Search
            </Button>
            <form
              className={classNames([
                styles.navigation__search__form,
                showSearchBar && styles['show-search-bar'],
              ])}
              action=""
            >
              <label htmlFor={`${navBarId}-search`} className="sr-only">
                Navigation Search Area
              </label>
              <input
                type="search"
                name="navigation-search-area"
                id={`${navBarId}-search`}
                placeholder="What's on your mind?"
                className={styles.navigation__search__input}
              />
            </form>
          </div>
          <Button
            type="button"
            variant="apparent"
            border="circle"
            hasOnlyIcon
            icon={<FaBars />}
            className={classNames([styles.navigation__button, styles['navigation__toggle--menu']])}
            onClick={setShowMenu}
          >
            Show Navigation Menu
          </Button>
          <Button
            type="button"
            variant="apparent"
            border="circle"
            hasOnlyIcon
            icon={<FaSlidersH className={styles.icon} />}
            className={classNames([
              styles.navigation__button,
              styles['navigation__toggle--settings'],
            ])}
            onClick={setShowSettings}
          >
            Show Configuration Panel
          </Button>
          <ThemeModal isModalOpen={showSettings} closeModal={setShowSettings} />
        </div>
      </div>
    </nav>
  );
}

Navbar.defaultProps = {
  isSticky: false,
  hasFullWidth: false,
  hasEffectOnScroll: false,
  scrollThreshold: 0,
  maxItems: 3,
  labelForMaxItems: 'Services',
};

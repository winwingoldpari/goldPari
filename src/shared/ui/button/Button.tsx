import {
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
  forwardRef,
} from 'react';
import { Link as RouterLink, type To } from 'react-router-dom';

type PolymorphicRef<T extends ElementType> = ComponentPropsWithRef<T>['ref'];

type ButtonOwnProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  underline?: boolean;
  className?: string;
  to?: To;
  external?: boolean;
};

type ButtonProps<T extends ElementType> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

const DEFAULT_ELEMENT: ElementType = 'button';

function getClassName({
  fullWidth,
  className,
}: Pick<ButtonOwnProps<ElementType>, 'fullWidth' | 'className'>) {
  const classes = [
    'inline-flex select-none items-center justify-center gap-2 rounded-xl',
    'bg-[linear-gradient(270deg,#f2b705_0%,#ffd452_45.19%,#f2b705_100%)] px-4 py-2.5 text-lg font-[700] uppercase text-black leading-1',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300',
    'disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-[0_6px_0_rgba(0,0,0,0.25)] disabled:opacity-60',
    fullWidth ? 'w-full' : '',
    className ?? '',
  ];
  return classes.filter(Boolean).join(' ');
}

const renderIcon = (icon?: ReactNode): ReactElement | null => {
  if (!icon) return null;
  return <span aria-hidden className="flex items-center justify-center text-base">{icon}</span>;
};

function isInternalHref(href: string) {
  return href.startsWith('/') && !href.startsWith('//');
}

const ButtonInner = <T extends ElementType = typeof DEFAULT_ELEMENT>(
  {
    as,
    children,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    underline = false,
    className,
    to,
    external,
    ...restProps
  }: ButtonProps<T>,
  ref: PolymorphicRef<T>,
) => {
  const { href, target, rel, ...other } = restProps as any;

  let Component: ElementType = DEFAULT_ELEMENT;
  let finalTo: To | undefined;
  let finalHref: string | undefined;
  let finalRel: string | undefined;
  let finalTarget: string | undefined;

  if (as) {
    Component = as as ElementType;
  } else if (to != null) {
    Component = RouterLink as unknown as ElementType;
    finalTo = to;
  } else if (typeof href === 'string' && !external && isInternalHref(href)) {
    Component = RouterLink as unknown as ElementType;
    finalTo = href as To;
  } else if (typeof href === 'string') {
    Component = 'a';
    finalHref = href;
    finalTarget = target;
    finalRel = rel ?? (finalTarget === '_blank' ? 'noopener noreferrer' : undefined);
  } else {
    Component = DEFAULT_ELEMENT;
  }

  const classNames = getClassName({ fullWidth, className });
  const labelClasses = ['flex items-center justify-center', underline ? 'underline underline-offset-4' : '']
    .filter(Boolean)
    .join(' ');

  const commonProps: any = {
    ref,
    className: classNames,
    ...other,
  };

  if (Component === 'button' && !('type' in other)) {
    commonProps.type = 'button';
  }

  if (Component === (RouterLink as unknown as ElementType)) {
    commonProps.to = finalTo!;
  } else if (Component === 'a') {
    commonProps.href = finalHref!;
    if (finalTarget) commonProps.target = finalTarget;
    if (finalRel) commonProps.rel = finalRel;
  }

  const content = (
    <>
      {iconPosition === 'left' && renderIcon(icon)}
      <span className={labelClasses}>{children}</span>
      {iconPosition === 'right' && renderIcon(icon)}
    </>
  );

  return <Component {...commonProps}>{content}</Component>;
};

type ButtonComponent = <T extends ElementType = typeof DEFAULT_ELEMENT>(
  props: ButtonProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;

const forwardRefWithAs = forwardRef as unknown as <T extends ElementType = typeof DEFAULT_ELEMENT>(
  render: (props: ButtonProps<T>, ref: PolymorphicRef<T>) => ReactElement | null,
) => ButtonComponent;

export const Button = forwardRefWithAs(ButtonInner);
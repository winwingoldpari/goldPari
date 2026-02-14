import {
  type ReactElement,
  type ReactNode,
  forwardRef,
} from 'react';
import { Link as RouterLink, type LinkProps, type To } from 'react-router-dom';

type ButtonBaseProps = {
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  underline?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
};

type RouterLinkButtonProps = ButtonBaseProps &
  Omit<LinkProps, 'to' | 'children' | 'className'> & {
    to: To;
    href?: never;
  };

type AnchorButtonProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href'> & {
    href: string;
    to?: never;
    external?: boolean;
  };

type NativeButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    to?: never;
    href?: never;
  };

export type ButtonProps = RouterLinkButtonProps | AnchorButtonProps | NativeButtonProps;

function getClassName({
  fullWidth,
  variant = 'primary',
  className,
  hasIcon = false,
}: Pick<ButtonBaseProps, 'fullWidth' | 'variant' | 'className'> & { hasIcon?: boolean }) {
  const variantClasses =
    variant === 'secondary'
      ? 'bg-black-100 text-white border border-[#969696] px-5'
      : 'bg-[linear-gradient(212deg,#f3b809_0%,#fdd047_45.19%,#f3b809_100%)] hover:bg-[linear-gradient(212deg,#ffd75f_0%,#ffdc72_45.19%,#ffd75f_100%)] text-black';

  const pyClasses = hasIcon ? '2xl:py-2.5 py-2.5' : '2xl:py-[13px] py-[13px]';

  const classes = [
    'inline-flex select-none items-center justify-center gap-2 rounded-[12px] relative',
    'md:px-5 px-4 font-[700] uppercase 2xl:text-[20px] text-sx leading-[1]',
    pyClasses,
    variantClasses,
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

const ButtonInner = (
  {
    children,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    underline = false,
    variant = 'primary',
    className,
    ...restProps
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) => {
  const classNames = getClassName({ fullWidth, variant, className, hasIcon: Boolean(icon) });
  const labelClasses = ['flex items-center justify-center', underline ? 'underline underline-offset-4' : '']
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {iconPosition === 'left' && renderIcon(icon)}
      <span className={labelClasses}>{children}</span>
      {iconPosition === 'right' && renderIcon(icon)}
    </>
  );

  if ('to' in restProps && restProps.to != null) {
    const { to, ...linkProps } = restProps as RouterLinkButtonProps;
    return (
      <RouterLink ref={ref as React.ForwardedRef<HTMLAnchorElement>} to={to} className={classNames} {...linkProps}>
        {content}
      </RouterLink>
    );
  }

  if ('href' in restProps && typeof restProps.href === 'string') {
    const { href, external, target, rel, ...anchorProps } = restProps as AnchorButtonProps;
    if (!external && isInternalHref(href)) {
      return (
        <RouterLink
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          to={href}
          className={classNames}
          {...anchorProps}
        >
          {content}
        </RouterLink>
      );
    }

    const finalRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined);
    return (
      <a
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={finalRel}
        className={classNames}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const { type, ...buttonProps } = restProps as NativeButtonProps;
  return (
    <button
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      type={type ?? 'button'}
      className={classNames}
      {...buttonProps}
    >
      {content}
    </button>
  );
};

export const Button = forwardRef(ButtonInner);

import { icons, size, type IconName } from '@harunmarangoz/calico-design';

export type { IconName };

/** A Calico icon from the design tokens; takes the text color unless told otherwise. */
export function Icon({ name, pixels = size.iconMd }: { name: IconName; pixels?: number }) {
  return (
    <svg
      width={pixels}
      height={pixels}
      viewBox={icons.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={icons.strokeWidth}
      strokeLinecap={icons.strokeLinecap}
      strokeLinejoin={icons.strokeLinejoin}
      aria-hidden="true"
      focusable="false">
      <path d={icons.icons[name]} />
    </svg>
  );
}

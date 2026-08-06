/**
 * @bhavya/design-system — Unified Design System Package
 *
 * Tokens, component types, and accessibility utilities for all
 * Bhavya Foundation applications.
 *
 * @packageDocumentation
 */

// === Tokens ===
export { tokens, primitives, lightTheme, darkTheme } from "./tokens";

export type {
  Theme,
  ThemeColors,
  TokenType,
  SpacingToken,
  RadiusToken,
  ShadowToken,
  TransitionToken,
  ZIndexToken,
} from "./tokens";

// === Component Types ===
export type {
  // Common
  Size,
  BaseComponentProps,
  // Button
  ButtonVariant,
  ButtonProps,
  // Card
  CardVariant,
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  // Badge
  BadgeVariant,
  BadgeProps,
  // Input
  InputType,
  InputProps,
  TextareaProps,
  // Modal
  ModalSize,
  ModalProps,
  // Tabs
  TabItem,
  TabsProps,
  // Table
  SortDirection,
  TableColumn,
  TableProps,
  TablePaginationProps,
  // Toast
  ToastVariant,
  ToastProps,
  ToastConfig,
  // Skeleton
  SkeletonVariant,
  SkeletonProps,
  // Avatar
  AvatarProps,
  AvatarGroupProps,
  // Breadcrumb
  BreadcrumbItem,
  BreadcrumbProps,
  // Dropdown
  DropdownItem,
  DropdownPlacement,
  DropdownProps,
  // Tooltip
  TooltipPosition,
  TooltipProps,
  // Alert
  AlertVariant,
  AlertProps,
} from "./components";

// === Accessibility ===
export {
  focusRing,
  focusRingClass,
  srOnly,
  srOnlyClass,
  ariaLabel,
  ariaDescribedBy,
  ariaLive,
  contrastRatio,
  isAccessible,
  suggestAccessibleColor,
  handleKeyboard,
  createFocusTrap,
} from "./accessibility";

export type {
  FocusRingStyles,
  ScreenReaderOnlyStyles,
  AriaAttributes,
  WCAGLevel,
  AccessibilityCheckResult,
  KeyboardKey,
} from "./accessibility";

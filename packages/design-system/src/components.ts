/**
 * @bhavya/design-system — Component Type Definitions
 *
 * Props interfaces for all Bhavya Foundation components.
 * Use these types when building or extending platform-ui components.
 */

import {
  ReactNode,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

// ─── Common Types ───────────────────────────────────────────────────────────

export type Size = "sm" | "md" | "lg";

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

// ─── Button ─────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface ButtonProps
  extends
    BaseComponentProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}

// ─── Card ───────────────────────────────────────────────────────────────────

export type CardVariant = "default" | "elevated" | "outlined";

export interface CardProps
  extends BaseComponentProps, HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: Size;
  onClick?: () => void;
  hoverable?: boolean;
}

export interface CardHeaderProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export interface CardContentProps extends BaseComponentProps {
  padding?: Size;
}

export interface CardFooterProps extends BaseComponentProps {
  align?: "left" | "right" | "center";
}

// ─── Badge ──────────────────────────────────────────────────────────────────

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  children: ReactNode;
}

// ─── Input ──────────────────────────────────────────────────────────────────

export type InputType =
  "text" | "email" | "password" | "search" | "url" | "tel" | "number";

export interface InputProps
  extends
    BaseComponentProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  type?: InputType;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export interface TextareaProps
  extends
    BaseComponentProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  rows?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

// ─── Modal ──────────────────────────────────────────────────────────────────

export type ModalSize = "sm" | "md" | "lg" | "full";

export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

// ─── Tabs ───────────────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  content?: ReactNode;
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[];
  activeTab?: string;
  onChange: (tabId: string) => void;
  variant?: "underline" | "pills" | "enclosed";
  size?: Size;
  fullWidth?: boolean;
}

// ─── Table ──────────────────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: string | number;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface TableProps<
  T = Record<string, unknown>,
> extends BaseComponentProps {
  columns: TableColumn<T>[];
  data: T[];
  sortable?: boolean;
  sortKey?: string;
  sortDirection?: SortDirection;
  onSort?: (key: string, direction: SortDirection) => void;
  pagination?: TablePaginationProps;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  loading?: boolean;
  striped?: boolean;
  compact?: boolean;
}

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

// ─── Toast ──────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastProps extends BaseComponentProps {
  variant?: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export interface ToastConfig {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

export type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps extends BaseComponentProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  animated?: boolean;
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: Size;
  shape?: "circle" | "square";
  status?: "online" | "offline" | "away" | "busy";
}

export interface AvatarGroupProps extends BaseComponentProps {
  max?: number;
  size?: Size;
  children: ReactNode;
}

// ─── Breadcrumb ─────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  separator?: ReactNode | "/" | ">" | "→";
  size?: Size;
  onNavigate?: (item: BreadcrumbItem, index: number) => void;
}

// ─── Dropdown ───────────────────────────────────────────────────────────────

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  divider?: boolean;
  group?: string;
}

export type DropdownPlacement =
  "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface DropdownProps extends BaseComponentProps {
  items: DropdownItem[];
  trigger: ReactNode;
  placement?: DropdownPlacement;
  onSelect: (item: DropdownItem) => void;
  align?: "left" | "right";
  width?: number;
}

// ─── Tooltip ────────────────────────────────────────────────────────────────

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps extends BaseComponentProps {
  content: string;
  position?: TooltipPosition;
  delay?: number;
  children: ReactNode;
  disabled?: boolean;
}

// ─── Alert ──────────────────────────────────────────────────────────────────

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends BaseComponentProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  closable?: boolean;
  action?: ReactNode;
  onClose?: () => void;
}

"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import {
  VelocityTracker,
  rubberband,
  prefersReducedMotion,
} from "./apple-springs";

interface UseDirectManipulationOptions {
  /** Called when drag starts */
  onDragStart?: (
    event: PointerEvent,
    grabOffset: { x: number; y: number },
  ) => void;
  /** Called during drag with current position */
  onDrag?: (
    event: PointerEvent,
    position: { x: number; y: number },
    velocity: { x: number; y: number },
  ) => void;
  /** Called when drag ends with release velocity */
  onDragEnd?: (event: PointerEvent, velocity: { x: number; y: number }) => void;
  /** Axis constraint: 'x', 'y', or 'both' */
  axis?: "x" | "y" | "both";
  /** Boundary constraints for rubber-banding */
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
  /** Container dimension for rubber-band calculation */
  containerSize?: { width: number; height: number };
  /** Minimum movement threshold before drag commits (hysteresis) */
  hysteresis?: number;
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean;
}

interface UseDirectManipulationReturn {
  /** Attach to the element that should be draggable */
  ref: (el: HTMLElement | null) => void;
  /** Current drag position (relative to start) */
  position: { x: number; y: number };
  /** Whether currently dragging */
  isDragging: boolean;
  /** Current velocity during drag */
  velocity: { x: number; y: number };
  /** Manually cancel drag */
  cancel: () => void;
}

/**
 * Direct manipulation hook — implements Apple's 1:1 drag tracking with:
 * - Pointer Events + setPointerCapture for continuous tracking
 * - Grab offset respect (element stays under finger where grabbed)
 * - Velocity tracking for spring handoff
 * - Rubber-banding at boundaries
 * - Hysteresis threshold before commit
 * - Reduced motion support
 */
export function useDirectManipulation(
  options: UseDirectManipulationOptions = {},
): UseDirectManipulationReturn {
  const {
    onDragStart,
    onDrag,
    onDragEnd,
    axis = "both",
    bounds,
    containerSize,
    hysteresis = 10, // ~10px threshold
    preventDefault = true,
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const velocityTracker = useRef(new VelocityTracker());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const grabOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const hasCommittedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const setElementRef = useCallback((el: HTMLElement | null) => {
    elementRef.current = el;
  }, []);

  const cancel = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    dragStartRef.current = null;
    grabOffsetRef.current = null;
    hasCommittedRef.current = false;
    velocityTracker.current.reset();
    setIsDragging(false);
    setVelocity({ x: 0, y: 0 });
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (prefersReducedMotion()) return;

      const element = elementRef.current;
      if (!element) return;

      // Only left button / primary touch
      if (event.button !== 0 && event.pointerType !== "touch") return;

      if (preventDefault) {
        event.preventDefault();
      }

      // Capture pointer so we keep receiving events even if pointer leaves element
      element.setPointerCapture(event.pointerId);

      const rect = element.getBoundingClientRect();
      const grabOffset = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      dragStartRef.current = { x: event.clientX, y: event.clientY };
      grabOffsetRef.current = grabOffset;
      hasCommittedRef.current = false;
      velocityTracker.current.reset();
      velocityTracker.current.update(event.clientX, event.clientY);

      setIsDragging(true);
      onDragStart?.(event, grabOffset);
    },
    [onDragStart, preventDefault],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isDragging || !dragStartRef.current || !grabOffsetRef.current)
        return;

      if (preventDefault) {
        event.preventDefault();
      }

      velocityTracker.current.update(event.clientX, event.clientY);
      const currentVelocity = velocityTracker.current.getVelocity();
      setVelocity(currentVelocity);

      const dx = event.clientX - dragStartRef.current.x;
      const dy = event.clientY - dragStartRef.current.y;

      // Check hysteresis threshold before committing
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (!hasCommittedRef.current && distance < hysteresis) {
        return;
      }
      hasCommittedRef.current = true;

      // Apply axis constraint
      let newX = axis === "y" ? 0 : dx;
      let newY = axis === "x" ? 0 : dy;

      // Apply rubber-banding at bounds
      if (bounds && containerSize) {
        if (bounds.minX !== undefined && newX < bounds.minX) {
          const overshoot = bounds.minX - newX;
          newX = bounds.minX - rubberband(overshoot, containerSize.width);
        }
        if (bounds.maxX !== undefined && newX > bounds.maxX) {
          const overshoot = newX - bounds.maxX;
          newX = bounds.maxX + rubberband(overshoot, containerSize.width);
        }
        if (bounds.minY !== undefined && newY < bounds.minY) {
          const overshoot = bounds.minY - newY;
          newY = bounds.minY - rubberband(overshoot, containerSize.height);
        }
        if (bounds.maxY !== undefined && newY > bounds.maxY) {
          const overshoot = newY - bounds.maxY;
          newY = bounds.maxY + rubberband(overshoot, containerSize.height);
        }
      }

      const newPosition = { x: newX, y: newY };
      setPosition(newPosition);
      onDrag?.(event, newPosition, currentVelocity);
    },
    [
      isDragging,
      axis,
      bounds,
      containerSize,
      hysteresis,
      onDrag,
      preventDefault,
    ],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent) => {
      if (!isDragging) return;

      const element = elementRef.current;
      if (element && element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }

      const releaseVelocity = velocityTracker.current.getVelocity();
      setVelocity(releaseVelocity);
      onDragEnd?.(event, releaseVelocity);

      cancel();
    },
    [isDragging, onDragEnd, cancel],
  );

  const handlePointerCancel = useCallback(
    (event: PointerEvent) => {
      if (!isDragging) return;

      const element = elementRef.current;
      if (element && element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }

      cancel();
    },
    [isDragging, cancel],
  );

  // Attach/remove pointer event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerCancel);
    element.addEventListener("lostpointercapture", handlePointerCancel);

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerCancel);
      element.removeEventListener("lostpointercapture", handlePointerCancel);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  ]);

  return {
    ref: setElementRef,
    position,
    isDragging,
    velocity,
    cancel,
  };
}

/**
 * Hook for swipeable sheets/drawers — combines direct manipulation with spring animation.
 * Handles: drag to dismiss, flick to dismiss, snap back on release below threshold.
 */
export function useSwipeableSheet(
  elementRef: React.RefObject<HTMLElement>,
  options: {
    onDismiss?: () => void;
    dismissThreshold?: number; // px to drag before dismiss commits
    direction?: "down" | "up" | "left" | "right";
    springConfig?: { damping: number; response: number };
  } = {},
): { isDragging: boolean; dragOffset: number } {
  const { onDismiss, dismissThreshold = 100, direction = "down" } = options;
  const [dragOffset, setDragOffset] = useState(0);
  const velocityTracker = useRef(new VelocityTracker());
  const dragStartRef = useRef<number | null>(null);
  const hasCommittedRef = useRef(false);

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (prefersReducedMotion()) return;
      if (event.button !== 0 && event.pointerType !== "touch") return;

      const element = elementRef.current;
      if (!element) return;
      element.setPointerCapture(event.pointerId);

      dragStartRef.current =
        direction === "down" || direction === "up"
          ? event.clientY
          : event.clientX;
      velocityTracker.current.reset();
      velocityTracker.current.update(
        direction === "down" || direction === "up"
          ? event.clientY
          : event.clientX,
        0,
      );
      hasCommittedRef.current = false;
      setDragOffset(0);
    },
    [direction],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (dragStartRef.current === null) return;

      const current =
        direction === "down" || direction === "up"
          ? event.clientY
          : event.clientX;
      const delta = current - dragStartRef.current;

      // Apply direction constraint (only allow drag in dismiss direction)
      const isDismissDirection =
        (direction === "down" && delta > 0) ||
        (direction === "up" && delta < 0) ||
        (direction === "right" && delta > 0) ||
        (direction === "left" && delta < 0);

      if (!isDismissDirection) {
        setDragOffset(0);
        return;
      }

      velocityTracker.current.update(current, 0);

      if (!hasCommittedRef.current && Math.abs(delta) < 10) {
        return;
      }
      hasCommittedRef.current = true;

      // Apply rubber-band resistance
      const boundedDelta =
        Math.sign(delta) * Math.min(Math.abs(delta), dismissThreshold * 2);
      setDragOffset(boundedDelta);
    },
    [direction, dismissThreshold],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent) => {
      if (dragStartRef.current === null) return;

      const element = elementRef.current;
      if (element && element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }

      const velocity = velocityTracker.current.getVelocity();
      const releaseVelocity =
        direction === "down" || direction === "up" ? velocity.y : velocity.x;

      // Dismiss if dragged past threshold OR flicked with sufficient velocity
      const shouldDismiss =
        Math.abs(dragOffset) > dismissThreshold ||
        Math.abs(releaseVelocity) > 500;

      if (shouldDismiss && onDismiss) {
        onDismiss();
      } else {
        // Snap back with spring
        setDragOffset(0);
      }

      dragStartRef.current = null;
      hasCommittedRef.current = false;
    },
    [direction, dragOffset, dismissThreshold, onDismiss],
  );

  const handlePointerCancel = useCallback(() => {
    setDragOffset(0);
    dragStartRef.current = null;
    hasCommittedRef.current = false;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerCancel);
    element.addEventListener("lostpointercapture", handlePointerCancel);

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerCancel);
      element.removeEventListener("lostpointercapture", handlePointerCancel);
    };
  }, [
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  ]);

  return { isDragging: dragOffset !== 0, dragOffset };
}

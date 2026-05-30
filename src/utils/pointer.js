export function getClientPoint(event) {
  if (typeof event.clientX === "number" && typeof event.clientY === "number") {
    return { clientX: event.clientX, clientY: event.clientY };
  }
  const touch = event.touches?.[0] ?? event.changedTouches?.[0];
  if (touch) {
    return { clientX: touch.clientX, clientY: touch.clientY };
  }
  return null;
}

export function getNormalizedPoint(event, element) {
  const point = getClientPoint(event);
  if (!point || !element) return null;

  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  return {
    x: clamp((point.clientX - rect.left) / rect.width, 0, 1),
    y: clamp((point.clientY - rect.top) / rect.height, 0, 1),
  };
}

/** Primary finger / mouse button only */
export function isPrimaryPointer(event) {
  return event.button === 0 || event.pointerType === "touch";
}

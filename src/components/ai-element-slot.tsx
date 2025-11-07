import React, { createContext, useContext } from "react";
import { isValidCSSDimension } from "../utils";

interface AIElementSlotProps {
  height?: string | number;
  width?: string | number;
  children: React.ReactNode;
}

const SlotContext = createContext(false);

export const useSlotContext = () => useContext(SlotContext);

/**
 * AIElementSlot - A container component that provides context wraps <AIElement />.
 *
 * This component serves as the required parent wrapper for <AIElement /> components.
 *
 * @param children - <AIElement /> to be rendered within the slot
 * @param height - Optional height dimension (string with CSS units or number for pixels)
 * @param width - Optional width dimension (string with CSS units or number for pixels)
 */
const AIElementSlot: React.FC<{ children: React.ReactNode }> = (
  props: AIElementSlotProps,
) => {
  const { height, width, children } = props;

  const style: React.CSSProperties = {};

  if (height !== undefined) {
    if (isValidCSSDimension(height)) {
      style.height = typeof height === "number" ? `${height}px` : height;
    } else {
      console.warn(`Invalid CSS value for height: ${height}`);
    }
  }

  if (width !== undefined) {
    if (isValidCSSDimension(width)) {
      style.width = typeof width === "number" ? `${width}px` : width;
    } else {
      console.warn(`Invalid CSS value for width: ${width}`);
    }
  }

  return (
    <SlotContext.Provider value={true}>
      <div className="parent-wrapper" style={style}>
        {children}
      </div>
    </SlotContext.Provider>
  );
};

export default AIElementSlot;

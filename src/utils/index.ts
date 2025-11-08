export const isValidCSSDimension = (value: string | number): boolean => {
  if (typeof value === "number") {
    return !isNaN(value) && isFinite(value);
  }

  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  // Create a temporary element to test the CSS value
  const testElement = document.createElement("div");
  const originalValue = testElement.style.height;

  try {
    testElement.style.height = value;
    const isValid =
      testElement.style.height !== originalValue ||
      value === "initial" ||
      value === "inherit" ||
      value === "unset";
    testElement.style.height = originalValue;
    return isValid;
  } catch {
    return false;
  }
};

export const stringifyObjectInterface = (obj: any): string => {
  const processValue = (value: any, depth: number = 0): string => {
    const indent = "  ".repeat(depth);

    if (value === null) {
      return "null";
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "[]";
      }
      const items = value.map(
        (item, index) =>
          `${indent}  [${index}]: ${processValue(item, depth + 1)}`,
      );
      return `[\n${items.join(",\n")}\n${indent}]`;
    }

    if (typeof value === "object") {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return "{}";
      }
      const properties = keys.map(
        (key) => `${indent}  ${key}: ${processValue(value[key], depth + 1)}`,
      );
      return `{\n${properties.join(",\n")}\n${indent}}`;
    }

    return typeof value;
  };

  return processValue(obj);
};

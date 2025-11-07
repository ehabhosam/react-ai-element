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

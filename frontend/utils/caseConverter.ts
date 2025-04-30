// camelCase -> snake_case 변환
export function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result: any, key) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

// snake_case -> camelCase 변환
export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result: any, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

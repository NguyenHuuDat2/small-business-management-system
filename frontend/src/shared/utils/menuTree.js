export function flattenSidebar(items = []) {
  const result = [];

  for (const item of items) {
    if (item?.path) {
      result.push(item);
    }

    if (item?.children?.length) {
      result.push(...flattenSidebar(item.children));
    }
  }

  return result;
}
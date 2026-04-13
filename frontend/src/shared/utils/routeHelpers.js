export function findFirstPath(items = []) {
  for (const item of items) {
    if (item?.path) return item.path;

    if (item?.children?.length) {
      const childPath = findFirstPath(item.children);
      if (childPath) return childPath;
    }
  }

  return null;
}
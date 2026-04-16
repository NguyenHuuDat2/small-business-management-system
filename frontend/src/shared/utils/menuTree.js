export function flattenSidebar(items = []) {
  const result = [];

  function walk(list) {
    list.forEach(item => {
      result.push(item);

      if (item.children && item.children.length > 0) {
        walk(item.children);
      }
    });
  }

  walk(items);
  return result;
}
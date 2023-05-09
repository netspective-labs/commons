const posixPathRE = /^((\/?)(?:[^/]*\/)*)((\.{1,2}|[^/]+?|)(\.[^./]*|))[/]*$/;
// asdasdsad
/**
 * Given POSIX-style path see if it's a file-sys style route. This function is
 * useful in browsers to detect a server route based on document.location.
 * For example, if you have a navigation utility that needs to set the active
 * path you could run this function to get the component parts (such as name,
 * directory, modifiers, etc.) and find the active page. If there are any extra
 * extensions in the file they are returned as "modifiers".
 * @param text the string to detect and see if it's POSIX-style path
 * returns undefined if it doesn't match a path or components.
 */
export function detectFileSysStyleRoute(text: string) {
  const components = posixPathRE.exec(text)?.slice(1);
  if (!components || components.length !== 5) return undefined;
  /////////////////////////////////////
  const modifiers: string[] = [];
  const parsedPath = {
    root: components[1],
    dir: components[0]?.slice(0, -1),
    base: components[2],
    ext: components[4],
    name: components[3],
    modifiers,
  };

  let modifierIndex = parsedPath.name?.lastIndexOf(".");
  if (modifierIndex && modifierIndex > 0) {
    let ppn = parsedPath.name;
    let modifier: string | undefined = ppn?.substring(modifierIndex);
    while (modifier && modifier.length > 0) {
      modifiers.push(modifier);
      ppn = ppn?.substring(0, ppn.length - modifier.length);

      modifierIndex = ppn?.lastIndexOf(".");
      modifier =
        modifierIndex && modifierIndex > 0
          ? ppn?.substring(modifierIndex)
          : undefined;
    }
    parsedPath.name = ppn;
  }

  return parsedPath;
}

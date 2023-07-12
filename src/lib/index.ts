/**
 * to check if the string ends with any of the given strings
 */
export const endsWithAny = (str: string, suffixes: string[]) => {
    return suffixes.some((suffix) => {
      return str.endsWith(suffix);
    });
  };


export const Values = {
    NairaSymbol: "₦",
    DollarSymbol: '$',
    OptimizationUrl: "https://res.cloudinary.com/sammxin/image/fetch/t_media_lib_thumb/"
}

export const splitWithModify: (str: string, splitter: string, mod: string) => string = (str, splitter, mod) => {
  const splitted = str.split(splitter);
  return [splitted[0], splitter, mod, splitted[1]].join('');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export interface TextInterpolateStrategy<
  InterpolateProps extends Record<string, string>,
  InterpolatePropKey extends keyof InterpolateProps = keyof InterpolateProps,
> {
  readonly replace:
    | ((
        unwrappedToken: InterpolatePropKey,
        wrappedToken: string,
      ) => string | false)
    | {
        [Token in InterpolatePropKey]: (
          token: InterpolatePropKey,
          wrappedToken: string,
        ) => string;
      };
  readonly regExp?: RegExp;
  readonly ignore?: (token: string) => string;
  readonly unwrap?: (wrapped: string) => string;
}

export type TextInterpolator = (text: string) => string;

/**
 * Create a function which, when executed, will "interpolate" (replace) typed
 * tokens using custom function(s). Javascript string template literals are
 * much more powerful and be the first choice but sometimes we have a need where
 * a few, basic and a priori-known, text tokens need to be replaced at runtime.
 * @param strategy the replacers, regExp and token style (e.g. `${xyz}` or `{xyz}` or `{{xyz}}`) to use
 * @returns (text: string) => string
 */
export function textInterpolator<
  InterpolateProps extends Record<string, string>,
  InterpolatePropKey extends keyof InterpolateProps = keyof InterpolateProps,
>(strategy: TextInterpolateStrategy<InterpolateProps, InterpolatePropKey>) {
  const {
    replace,
    regExp = /\${([^${}]*)}/g, // matches ${xyz}
    ignore = (token: string) => token, // return as-is if we're ignoring
    unwrap = (wrapped: string) => wrapped.slice(2, wrapped.length - 1), // extract 'xyz' from '${xyz}'
  } = strategy;
  const interpolateObservable =
    typeof replace === "function"
      ? (text: string) => {
          const interpolated: InterpolateProps = {} as Any;
          const transformedText = text.replace(regExp, (wrappedToken) => {
            const token = unwrap(wrappedToken);
            const result = replace(token as InterpolatePropKey, wrappedToken);
            if (result) {
              (interpolated as Any)[token] = result;
              return result;
            }
            return ignore(wrappedToken);
          });
          return {
            interpolated,
            transformedText,
          };
        }
      : (text: string) => {
          const interpolated: InterpolateProps = {} as Any;
          const transformedText = text.replace(regExp, (wrappedToken) => {
            const token = unwrap(wrappedToken);
            if (token in replace) {
              const result = replace[token as InterpolatePropKey](
                token as InterpolatePropKey,
                wrappedToken,
              );
              (interpolated as Any)[token] = result;
              return result;
            }
            return ignore(wrappedToken);
          });
          return {
            interpolated,
            transformedText,
          };
        };
  const interpolate = (text: string): string => {
    const ioResult = interpolateObservable(text);
    return ioResult.transformedText;
  };
  return {
    interpolateObservable,
    interpolate,
  };
}

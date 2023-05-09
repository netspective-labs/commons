import path from "node:path";
import * as m from "./memoize.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export const apiMssFactory = ({
  isApiAvailable,
  mssStatsInstances = new Map(),
  isInDevelopment,
}: {
  readonly isApiAvailable: () => boolean;
  readonly mssStatsInstances?: Map<
    string,
    {
      readonly key: string;
      gets: number;
      sets: number;
      readonly reject: Error[];
    }
  >;
  readonly isInDevelopment: boolean;
}) => {
  const mssStatsFactory = (key: string) => {
    let msssInstance = mssStatsInstances.get(key);
    if (!msssInstance) {
      msssInstance = { key, gets: 0, sets: 0, reject: [] };
      mssStatsInstances.set(key, msssInstance);
    }
    return msssInstance;
  };

  // Rationale: <valid-url-path-chars> minus <invalid-file-system-chars>
  // [1] valid url path chars: https://tools.ietf.org/html/rfc3986
  // [2] invalid file system chars: https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
  const invalidChars = /[^a-zA-Z0-9\-._~!$&'()+,;=@]/g;

  // provide a fileName supplier for a given key
  const mssFileNameSupplier =
    (key: string) =>
    <V>(_value?: V) =>
      path.join(
        process.cwd(),
        "src",
        "cache",
        "memoized-api-responses",
        key.replace(invalidChars, "-").replaceAll(/-+/g, "-"),
      ) + ".memoized.json";

  const instances = new Map<string, m.MemoizeStoreStrategy<string, Any>>();
  return <V>(key: string): m.MemoizeStoreStrategy<string, V> => {
    let instance = instances.get(key);
    if (!instance) {
      const fsMSS = m.fsJsonMemoizeStoreStrategy({
        fileNameSupplier: mssFileNameSupplier(key),
        acceptPersistedFile: (stats, fn) => {
          const accept = () => {
            // if we're running in dev mode, always read from fs cache
            if (isInDevelopment) return true;

            if (isApiAvailable()) {
              // if we're running "production" (or "build") mode, only read from cache if not more than a few minutes old
              const ageInMS = Date.now() - stats.mtime.valueOf();
              if (ageInMS > 1000 * 60 * 3) return new Error("time expired");
              return true;
            } else {
              // if there's no API token available, we always accept the cache
              return true;
            }
          };
          const result = accept();
          if (typeof result !== "boolean" || !result) {
            mssStatsFactory(fn).reject.push(result);
          }
          return result;
        },
      });
      // wrap the instance in an instrumentation layer so we can capture stats
      instance = {
        get: (key: string) => {
          mssStatsFactory(key).gets++;
          return fsMSS.get(key);
        },
        set: (key, value) => {
          mssStatsFactory(key).sets++;
          return fsMSS.set(key, value);
        },
        toKey: fsMSS.toKey,
      };
    }
    return instance;
  };
};

export const memoizableApiResponse = (options: {
  readonly isApiAvailable: () => boolean;
  readonly isInDevelopment: boolean;
}) => {
  const instances = new Map<string, (...args: Any) => Promise<Any>>();
  return <A extends unknown[], V>(
    apiCallFn: (...args: A) => Promise<V>,
    key: string,
  ): ((...args: A) => Promise<V>) => {
    let instance = instances.get(key);
    if (!instance) {
      instance = m.memoize(apiCallFn, apiMssFactory(options)<V>(key));
      instances.set(key, instance);
    }
    return instance;
  };
};

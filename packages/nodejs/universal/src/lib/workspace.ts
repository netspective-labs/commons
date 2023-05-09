/**
 * Converts a file URL to a path string.
 * @param url of a file URL
 */
export function fromFileUrl(url: string | URL): string {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"),
  );
}

export type GitWorkTreePath = string;
export type GitEntry = string;
export type GitDir = string;
export type GitTag = string;
export type GitBranchOrTag = string;

export interface ManagedGitReference {
  readonly paths: GitPathsSupplier;
}

export interface GitAsset extends ManagedGitReference {
  readonly assetPathRelToWorkTree: string;
  readonly gitBranchOrTag: GitBranchOrTag;
}

export interface GitPathsSupplier {
  readonly workTreePath: GitWorkTreePath; // git --work-tree argument
  readonly gitDir: GitDir; // git --git-dir argument
  readonly assetAbsWorkTreePath: (asset: GitAsset) => GitEntry;
}

export interface GitWorkTreeAsset extends GitAsset, ManagedGitReference {}

export interface GitWorkTreeAssetUrlResolver<Identity extends string> {
  readonly identity: Identity;
  readonly gitAssetUrl: (
    asset: GitWorkTreeAsset,
    fallback?: () => string | undefined,
  ) => string | undefined;
}

export interface GitWorkTreeAssetUrlResolvers<Identity extends string> {
  readonly gitAssetUrlResolver: (
    identity: string,
  ) => GitWorkTreeAssetUrlResolver<Identity> | undefined;
  readonly gitAssetUrlResolvers: Iterable<
    GitWorkTreeAssetUrlResolver<Identity>
  >;
  readonly registerResolver: (
    resolver: GitWorkTreeAssetUrlResolver<Identity>,
  ) => void;
}

export interface GitWorkTreeAssetResolver {
  (
    candidate: GitEntry,
    gitBranchOrTag: GitBranchOrTag,
    paths: GitPathsSupplier,
  ): GitWorkTreeAsset | undefined;
}

export interface GitRemoteAnchor extends GitAsset {
  readonly href: string;
  readonly textContent: string;
}

export interface RouteGitRemoteResolver<Remote> {
  (fileSysPath: string, branch: GitBranchOrTag, paths: GitPathsSupplier):
    | Remote
    | undefined;
}

export type WorkspaceEditorIdentity = string;
export type EditableSourceFilePathAndName = string;
export type EditableSourceURI = string;
export type EditableTargetURI = string;

export interface WorkspaceEditorTarget {
  readonly identity: WorkspaceEditorIdentity;
  readonly editableTargetURI: EditableTargetURI;
  readonly openInWorkspaceHTML?: (classes?: string) => string;
}

export interface WorkspaceEditorTargetResolver<
  Target extends WorkspaceEditorTarget,
> {
  (src: EditableSourceFilePathAndName | EditableSourceURI, line?: number):
    | Target
    | undefined;
}

export interface ManagedGitResolvers<Identity extends string>
  extends GitWorkTreeAssetUrlResolvers<Identity> {
  readonly workTreeAsset: GitWorkTreeAssetResolver;
  readonly cicdBuildStatusHTML?: (...args: unknown[]) => string;
}

export const workspaceEditorTargetResolvers = [
  "vscode",
  "vscode-wsl",
  "vscode-ssh-remote",
  "vscode-windows",
  "vscode-linux",
  "vscode-mac",
] as const;

export function workspaceEditorResolver(
  type: (typeof workspaceEditorTargetResolvers)[number],
  options?: {
    readonly vscodeWslRemoteDistro?: () => string;
    readonly vscodeSsshRemoteHostname?: () => string;
  },
): WorkspaceEditorTargetResolver<WorkspaceEditorTarget> {
  switch (type) {
    case "vscode": // @deprecated: non-specific "vscode" is depracated, use specific vscode-* below
    case "vscode-wsl":
      return vscodeWslRemoteEditorResolver(
        options?.vscodeWslRemoteDistro?.() ?? "Debian",
      );
    case "vscode-ssh-remote":
      return vscodeSshRemoteEditorResolver(
        options?.vscodeSsshRemoteHostname?.() ??
          `${type}'s vscodeSsshRemoteHostname() supplier not supplied`,
      );
    case "vscode-windows":
      return vscodeWindowsRemoteEditorResolver();
    case "vscode-linux":
      return vscodeLinuxRemoteEditorResolver();
    case "vscode-mac":
      return vscodeMacRemoteEditorResolver();
  }
  return () => undefined;
}

export interface VsCodeWslWorkspaceEditorTarget extends WorkspaceEditorTarget {
  readonly wslDistroName: string;
}

export interface VsCodeSshWorkspaceEditorTarget extends WorkspaceEditorTarget {
  readonly sshHostName: string;
}

export function vscodeWslRemoteEditorResolver(
  wslDistroName: string,
): WorkspaceEditorTargetResolver<VsCodeWslWorkspaceEditorTarget> {
  return (src, line) => {
    if (src.startsWith("file:")) {
      src = fromFileUrl(src);
    }
    if (!src.startsWith("/")) src = `/${src}`;
    const editableTargetURI = `vscode://vscode-remote/wsl+${wslDistroName}${src}:${
      line || 1
    }`;
    return {
      identity: "vscode",
      wslDistroName,
      editableTargetURI,
      // deno-fmt-ignore
      openInWorkspaceHTML: (classes) =>
        `<a href="${editableTargetURI}" ${
          classes ? ` class="${classes}"` : ""
        } title="${editableTargetURI}">Open in VS Code</a>`,
    };
  };
}

export function vscodeSshRemoteEditorResolver(
  sshHostName: string,
): WorkspaceEditorTargetResolver<VsCodeSshWorkspaceEditorTarget> {
  return (src, line) => {
    if (src.startsWith("file:")) {
      src = fromFileUrl(src);
    }
    if (!src.startsWith("/")) src = `/${src}`;
    const editableTargetURI = `vscode://vscode-remote/ssh-remote+${sshHostName}${src}:${
      line || 1
    }`;
    return {
      identity: "vscode",
      sshHostName,
      editableTargetURI,
      // deno-fmt-ignore
      openInWorkspaceHTML: (classes) =>
        `<a href="${editableTargetURI}" ${
          classes ? ` class="${classes}"` : ""
        } title="${editableTargetURI}">Open in VS Code</a>`,
    };
  };
}

export function vscodeWindowsRemoteEditorResolver(): WorkspaceEditorTargetResolver<WorkspaceEditorTarget> {
  return (src, line) => {
    if (src.startsWith("file:")) {
      src = fromFileUrl(src);
    }
    if (!src.startsWith("/")) src = `/${src}`;
    const editableTargetURI = `vscode://file${src}:${line || 1}`;
    return {
      identity: "vscode-windows",
      editableTargetURI,
      // deno-fmt-ignore
      openInWorkspaceHTML: (classes) =>
        `<a href="${editableTargetURI}" ${
          classes ? ` class="${classes}"` : ""
        } title="${editableTargetURI}">Open in VS Code</a>`,
    };
  };
}

export function vscodeLinuxRemoteEditorResolver(): WorkspaceEditorTargetResolver<WorkspaceEditorTarget> {
  return (src, line) => {
    if (src.startsWith("file:")) {
      src = fromFileUrl(src);
    }
    if (!src.startsWith("/")) src = `/${src}`;
    const editableTargetURI = `vscode://file${src}:${line || 1}`;
    return {
      identity: "vscode-linux",
      editableTargetURI,
      // deno-fmt-ignore
      openInWorkspaceHTML: (classes) =>
        `<a href="${editableTargetURI}" ${
          classes ? ` class="${classes}"` : ""
        } title="${editableTargetURI}">Open in VS Code</a>`,
    };
  };
}

export function vscodeMacRemoteEditorResolver(): WorkspaceEditorTargetResolver<WorkspaceEditorTarget> {
  return (src, line) => {
    if (src.startsWith("file:")) {
      src = fromFileUrl(src);
    }
    if (!src.startsWith("/")) src = `/${src}`;
    const editableTargetURI = `vscode://file${src}:${line || 1}`;
    return {
      identity: "vscode-mac",
      editableTargetURI,
      // deno-fmt-ignore
      openInWorkspaceHTML: (classes) =>
        `<a href="${editableTargetURI}" ${
          classes ? ` class="${classes}"` : ""
        } title="${editableTargetURI}">Open in VS Code</a>`,
    };
  };
}

export const gitLabRemoteID = "gitLab-remote" as const;
export const vsCodeLocalID = "vscode-local" as const;

export type GitAssetUrlResolverIdentity =
  | typeof gitLabRemoteID
  | typeof vsCodeLocalID;

export function gitLabAssetUrlResolver(
  glEndpoint: string,
): GitWorkTreeAssetUrlResolver<GitAssetUrlResolverIdentity> {
  return {
    identity: gitLabRemoteID,
    gitAssetUrl: (asset) => {
      return `${glEndpoint}/-/tree/${asset.gitBranchOrTag}/${asset.assetPathRelToWorkTree}`;
    },
  };
}

export function gitLabWorkTreeAssetVsCodeURL(
  _glEndpoint: string,
): GitWorkTreeAssetUrlResolver<GitAssetUrlResolverIdentity> {
  return {
    identity: vsCodeLocalID,
    gitAssetUrl: () => `TODO`,
  };
}

export function typicalGitWorkTreeAssetUrlResolvers<Identity extends string>(
  ...defaults: GitWorkTreeAssetUrlResolver<Identity>[]
): GitWorkTreeAssetUrlResolvers<Identity> {
  const gitAssetUrlResolvers = new Map<
    string,
    GitWorkTreeAssetUrlResolver<Identity>
  >();
  defaults.forEach((resolver) =>
    gitAssetUrlResolvers.set(resolver.identity, resolver),
  );
  return {
    gitAssetUrlResolver: (identity) => gitAssetUrlResolvers.get(identity),
    gitAssetUrlResolvers: gitAssetUrlResolvers.values(),
    registerResolver: (resolver) =>
      gitAssetUrlResolvers.set(resolver.identity, resolver),
  };
}

export const typicalGitWorkTreeAssetResolver: GitWorkTreeAssetResolver = (
  entry,
  gitBranchOrTag,
  paths,
) => {
  const workTreePath = paths.workTreePath;
  if (entry.startsWith("/")) {
    if (entry.startsWith(workTreePath)) {
      return {
        assetPathRelToWorkTree: entry.substring(workTreePath.length + 1), // +1 is because we don't want a leading /
        gitAssetWorkTreeAbsPath: entry,
        gitBranchOrTag,
        paths,
      };
    }
    // the entry doesn't belong to paths.workTreePath
    return undefined;
  }
  return {
    assetPathRelToWorkTree: entry,
    gitAssetWorkTreeAbsPath: paths.workTreePath + "/" + entry,
    gitBranchOrTag,
    paths,
  };
};

export function gitLabResolvers(
  gitLabRemoteUrlPrefix: string,
  remoteServerHumanName: string,
) {
  const assetUrlResolver = gitLabAssetUrlResolver(gitLabRemoteUrlPrefix);
  const gitWorkTreeAssetVsCodeURL = gitLabWorkTreeAssetVsCodeURL(
    gitLabRemoteUrlPrefix,
  );

  const mGitResolvers: ManagedGitResolvers<string> = {
    ...typicalGitWorkTreeAssetUrlResolvers<string>(
      assetUrlResolver,
      gitWorkTreeAssetVsCodeURL,
    ),
    workTreeAsset: typicalGitWorkTreeAssetResolver,
    cicdBuildStatusHTML: () =>
      `<a href="${gitLabRemoteUrlPrefix}/-/commits/master"><img alt="pipeline status" src="${gitLabRemoteUrlPrefix}/badges/master/pipeline.svg"/></a>`,
  };

  const routeGitRemoteResolver: RouteGitRemoteResolver<GitRemoteAnchor> = (
    fileSysPath,
    branch,
    paths,
  ) => {
    const asset = mGitResolvers.workTreeAsset(fileSysPath, branch, paths);
    if (asset) {
      const href = assetUrlResolver.gitAssetUrl(asset);
      if (href) {
        const result: GitRemoteAnchor = {
          ...asset,
          href,
          textContent: `${fileSysPath.slice(
            fileSysPath.lastIndexOf("/") + 1,
          )} on ${remoteServerHumanName}`,
        };
        return result;
      }
    }
    return undefined;
  };

  return {
    mGitResolvers,
    routeGitRemoteResolver,
  };
}

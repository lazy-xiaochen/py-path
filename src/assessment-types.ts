export type TaskFile = { name: string; content: string };
export type CallArgument = string | number;
export type CallValue = string | number | boolean | null;
export type CallTarget = { module: string; name: string };
export type CaseChecks = {
  fixtures?: TaskFile[];
  artifacts?: TaskFile[];
  calls?: { args: CallArgument[]; expected: CallValue }[];
  note?: string;
};

export type TaskContract = {
  kind: 'function' | 'module' | 'file';
  files?: string[];
  target?: CallTarget;
};

export type RunInspection = {
  call?: CallTarget & { args: CallArgument[][] };
  artifacts?: string[];
};

export type InspectedFile = { name: string; content?: string; error?: string };

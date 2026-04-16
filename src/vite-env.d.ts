/// <reference types="vite/client" />

declare global {
  interface ImportMeta {
    readonly glob: (
      pattern: string,
      options?: { query?: string; import?: string; eager?: boolean }
    ) => Record<string, () => Promise<unknown>>
  }
}

export {}

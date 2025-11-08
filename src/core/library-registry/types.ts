/**
 * Type definitions for the library registry system
 */

export interface LibraryDefinition {
  /** The library object/module to be registered */
  library: any;
  /** Optional version info for debugging */
  version?: string;
  /** Optional description */
  description?: string;
}

export interface LibraryRegistry {
  /** Map of library names to their definitions */
  libraries: Map<string, LibraryDefinition>;
  /** Register a new library */
  register(name: string, definition: LibraryDefinition): void;
  /** Unregister a library */
  unregister(name: string): void;
  /** Get a registered library */
  get(name: string): any;
  /** Check if a library is registered */
  has(name: string): boolean;
  /** Get all registered library names */
  getRegisteredNames(): string[];
  /** Clear all registered libraries */
  clear(): void;
}

export interface DefaultLibraryConfig {
  /** Whether to include React hooks (useState, useEffect, etc.) */
  includeReactHooks?: boolean;
  /** Whether to include React utilities (createElement, Fragment, etc.) */
  includeReactUtils?: boolean;
  /** Custom React import name (default: 'react') */
  reactImportName?: string;
}

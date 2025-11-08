/**
 * Library Registry System
 *
 * This module provides a comprehensive system for registering and managing
 * external libraries that can be used in AI-generated components.
 *
 * @example
 * ```ts
 * import { registerLibrary } from './library-registry';
 * import lodash from 'lodash';
 *
 * // Register lodash for use in AI components
 * registerLibrary('lodash', lodash);
 *
 * // Now AI can generate code like:
 * // import { debounce } from 'lodash';
 * ```
 */

// Main registry implementation
export { libraryRegistry, LibraryRegistryImpl } from "./registry";

// User-facing API - removed as we only expose clean API through config

// Types
export type {
  LibraryDefinition,
  LibraryRegistry,
  DefaultLibraryConfig,
} from "./types";

// Default export for internal use
export { libraryRegistry as default } from "./registry";

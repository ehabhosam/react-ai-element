import React from "react";
import {
  LibraryDefinition,
  LibraryRegistry,
  DefaultLibraryConfig,
} from "./types";

/**
 * Core library registry implementation
 */
class LibraryRegistryImpl implements LibraryRegistry {
  public libraries = new Map<string, LibraryDefinition>();

  register(name: string, definition: LibraryDefinition): void {
    if (typeof definition.library === "undefined") {
      throw new Error(`Library definition for "${name}" cannot be undefined`);
    }

    this.libraries.set(name, definition);
    console.debug(`📚 Registered library: ${name}`, {
      version: definition.version,
      description: definition.description,
    });
  }

  unregister(name: string): void {
    const existed = this.libraries.delete(name);
    if (existed) {
      console.debug(`🗑️ Unregistered library: ${name}`);
    }
  }

  get(name: string): any {
    const definition = this.libraries.get(name);
    return definition?.library;
  }

  has(name: string): boolean {
    return this.libraries.has(name);
  }

  getRegisteredNames(): string[] {
    return Array.from(this.libraries.keys());
  }

  clear(): void {
    const count = this.libraries.size;
    this.libraries.clear();
    console.debug(`🧹 Cleared ${count} registered libraries`);
  }

  /**
   * Get import map compatible with the existing render system
   */
  getImportMap(): Record<string, any> {
    const importMap: Record<string, any> = {};

    for (const [name, definition] of this.libraries) {
      importMap[name] = definition.library;
    }

    return importMap;
  }

  /**
   * Register default React APIs and hooks
   */
  registerDefaultReactAPIs(config: DefaultLibraryConfig = {}): void {
    const {
      includeReactHooks = true,
      includeReactUtils = true,
      reactImportName = "react",
    } = config;

    // Register main React library
    this.register(reactImportName, {
      library: React,
      version: React.version,
      description: "React library with all APIs",
    });

    // Register React hooks individually for named imports
    if (includeReactHooks) {
      const reactHooksLibrary = {
        useState: React.useState,
        useEffect: React.useEffect,
        useContext: React.useContext,
        useReducer: React.useReducer,
        useCallback: React.useCallback,
        useMemo: React.useMemo,
        useRef: React.useRef,
        useImperativeHandle: React.useImperativeHandle,
        useLayoutEffect: React.useLayoutEffect,
        useDebugValue: React.useDebugValue,
        useDeferredValue: React.useDeferredValue,
        useTransition: React.useTransition,
        useId: React.useId,
        useSyncExternalStore: React.useSyncExternalStore,
        useInsertionEffect: React.useInsertionEffect,
      };

      // Filter out undefined hooks (for older React versions)
      const availableHooks = Object.fromEntries(
        Object.entries(reactHooksLibrary).filter(
          ([, hook]) => hook !== undefined,
        ),
      );

      this.register(`${reactImportName}/hooks`, {
        library: availableHooks,
        description: "React hooks for named imports",
      });
    }

    // Register React utilities for named imports
    if (includeReactUtils) {
      const reactUtilsLibrary = {
        createElement: React.createElement,
        Fragment: React.Fragment,
        Component: React.Component,
        PureComponent: React.PureComponent,
        memo: React.memo,
        forwardRef: React.forwardRef,
        createContext: React.createContext,
        createRef: React.createRef,
        isValidElement: React.isValidElement,
        cloneElement: React.cloneElement,
        Children: React.Children,
        Suspense: React.Suspense,
        lazy: React.lazy,
        StrictMode: React.StrictMode,
        Profiler: React.Profiler,
      };

      // Filter out undefined utilities
      const availableUtils = Object.fromEntries(
        Object.entries(reactUtilsLibrary).filter(
          ([, util]) => util !== undefined,
        ),
      );

      this.register(`${reactImportName}/utils`, {
        library: availableUtils,
        description: "React utilities for named imports",
      });
    }
  }

  /**
   * Debug method to log all registered libraries
   */
  debug(): void {
    console.group("📚 Registered Libraries");
    for (const [name, definition] of this.libraries) {
      console.log(`${name}:`, {
        hasLibrary: typeof definition.library !== "undefined",
        version: definition.version,
        description: definition.description,
        keys:
          typeof definition.library === "object"
            ? Object.keys(definition.library)
            : typeof definition.library,
      });
    }
    console.groupEnd();
  }
}

// Create and export singleton instance
export const libraryRegistry = new LibraryRegistryImpl();

// Initialize with default React APIs
libraryRegistry.registerDefaultReactAPIs();

// Export the class for testing or advanced use cases
export { LibraryRegistryImpl };

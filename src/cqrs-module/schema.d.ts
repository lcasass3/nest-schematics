export interface CqrsModuleOptions {
  /**
   * The name of the module.
   */
  name: string;
  /**
   * The path to create the module.
   */
  path?: string;
  /**
   * The path to insert the module declaration.
   */
  module?: string;
  /**
   * Metadata name affected by declaration insertion.
   */
  metadata?: string;
}

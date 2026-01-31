/**
 * Result returned by Cloudinary when attempting to delete a single asset using its public ID.
 *
 * - "ok"        → Asset was successfully deleted
 * - "not found" → Asset did not exist (already deleted or invalid ID)
 */
export type CloudinaryDestroyResult = {
    result: "ok" | "not found";
  };
  


  /**
   * Aggregated result for a bulk Cloudinary delete operation.
   *
   * Used when deleting multiple assets in parallel (e.g. during
   * property deletion cleanup).
   *
   * - success      → Indicates the delete operation completed
   * - deletedCount → Number of assets processed
   * - results      → Raw per-asset deletion results from Cloudinary
   */
  export type CloudinaryDeleteResult = {
    success: boolean;
    deletedCount: number;
    results: CloudinaryDestroyResult[];
  };

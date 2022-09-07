export class Context {
  constructor(readonly userId: string, readonly permissionsMap: { [key: string]: string[] }) {}

  getResourcePermissions(resourceId: string): string[] {
    return this.permissionsMap[resourceId] ?? [];
  }
}

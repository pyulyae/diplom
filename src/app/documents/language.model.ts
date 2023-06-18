export class Language {
  entityId: number | undefined;
  name: string | undefined;

  constructor(params: any) {
    if (!params) return;
    this.entityId = params.entityId;
    this.name = params.name;
  }
}

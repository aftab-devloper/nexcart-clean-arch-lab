export interface AIDescriptionPort {
  enhanceDescription(productName: string, rawDescription: string): Promise<string>;
}

export enum VerificationStatus {
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  UNSURE = 'UNSURE',
}

export interface BoundingBoxVertex {
  x: number;
  y: number;
}

export interface ExtractedField {
  value: string | null;
  boundingBox: BoundingBoxVertex[] | null;
}

export interface ExtractedData {
  fullName: ExtractedField;
  idNumber: ExtractedField;
  dateOfBirth: ExtractedField;
  expiryDate: ExtractedField;
}

export interface VerificationData {
  status: VerificationStatus;
  reasoning: string;
  extractedData: ExtractedData;
  confidenceScore: number;
}

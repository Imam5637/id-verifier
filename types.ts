export enum VerificationStatus {
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  UNSURE = 'UNSURE',
}

export interface ExtractedData {
  fullName: string | null;
  idNumber: string | null;
  dateOfBirth: string | null;
  expiryDate: string | null;
  rawText: string | null;
}

export interface VerificationData {
  status: VerificationStatus;
  reasoning: string;
  documentType: string | null;
  extractedData: ExtractedData;
  confidenceScore: number;
}
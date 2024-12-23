export interface EmailLinkingStatus {
  hasLinkedEmail: boolean;
  emailCount: number;
}

export interface OnboardingState {
  currentStep: 'email' | 'complete';
  isCompleted: boolean;
}
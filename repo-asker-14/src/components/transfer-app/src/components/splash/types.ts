
export interface SplashScreenProps {
  isVisible: boolean;
  isExiting?: boolean;
  backgroundColor?: string;
  logoWidth?: string;
  logoHeight?: string;
  customAcknowledment?: {
    madeInText?: string;
    authorizedText?: string;
  };
}

export interface BaseComponentProps {
  className?: string;
}

export interface PulseBackgroundProps extends BaseComponentProps {}

export interface TopTitleProps extends BaseComponentProps {}

export interface MainLogoPathProps extends BaseComponentProps {
  strokeColor?: string;
  fillColor?: string;
}

export interface AccentPathProps extends BaseComponentProps {
  fillColor?: string;
}

export interface LogoContainerProps extends BaseComponentProps {
  width?: string;
  height?: string;
  children: React.ReactNode;
}

export interface AcknowledgmentProps extends BaseComponentProps {
  madeInText?: string;
  authorizedText?: string;
}

export interface ProgressiveWhiteOverlayProps extends BaseComponentProps {
  isExiting?: boolean;
}

export interface QuantumBackgroundProps extends BaseComponentProps {
  isExiting?: boolean;
}

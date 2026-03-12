import { ReactNode } from 'react';

export interface WindowState {
  id: string;
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AppConfig {
  id: string;
  title: string;
  icon: ReactNode;
  component: string;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
  iframeUrl?: string;
}

export interface DesktopIcon {
  id: string;
  title: string;
  icon: ReactNode;
  appId: string;
}

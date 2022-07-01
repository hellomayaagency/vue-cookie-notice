export interface CustomWindow extends Window {
  gtag: (command: String, ...parameters: any) => void;
  dataLayer: {}[],
}

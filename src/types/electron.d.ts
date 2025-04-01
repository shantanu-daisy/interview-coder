export interface ElectronAPI {

  // TODO:
  openSubscriptionPortal: (authData: {
    id: string
    email: string
  }) => Promise<{ success: boolean; error?: string }>
  clearStore: () => Promise<{ success: boolean; error?: string }>
  getScreenshots: () => Promise<{
    success: boolean
    error?: string
    data: Array<{ path: string; preview: string }>
  }>
  updateContentDimensions: (dimensions: {
    width: number
    height: number
  }) => Promise<void>
  toggleMainWindow: () => Promise<{ success: boolean; error?: string }>
  triggerScreenshot: () => Promise<{ success: boolean; error?: string }>
  triggerProcessScreenshots: () => Promise<{ success: boolean; error?: string }>
  triggerReset: () => Promise<{ success: boolean; error?: string }>
  triggerMoveLeft: () => Promise<{ success: boolean; error?: string }>
  triggerMoveRight: () => Promise<{ success: boolean; error?: string }>
  triggerMoveUp: () => Promise<{ success: boolean; error?: string }>
  triggerMoveDown: () => Promise<{ success: boolean; error?: string }>
  onSubscriptionUpdated: (callback: () => void) => () => void
  onSubscriptionPortalClosed: (callback: () => void) => () => void
  startUpdate: () => Promise<{ success: boolean; error?: string }>
  installUpdate: () => void
  onUpdateAvailable: (callback: (info: any) => void) => () => void
  onUpdateDownloaded: (callback: (info: any) => void) => () => void
  decrementCredits: () => Promise<void>
  setInitialCredits: (credits: number) => Promise<void>
  onCreditsUpdated: (callback: (credits: number) => void) => () => void
  onOutOfCredits: (callback: () => void) => () => void
  openSettingsPortal: () => Promise<void>
  getPlatform: () => string
  getConfig: () => Promise<{ apiKey: string; model: string }>
  updateConfig: (config: { apiKey?: string; model?: string }) => Promise<boolean>
  checkApiKey: () => Promise<boolean>
  validateApiKey: (apiKey: string) => Promise<{ valid: boolean; error?: string }>
  openLink: (url: string) => void
  onApiKeyInvalid: (callback: () => void) => () => void
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void


  //GLOBAL EVENTS
  onUnauthorized: (callback: () => void) => () => void
  onApiKeyOutOfCredits: (callback: () => void) => () => void
  onScreenshotTaken: (
    callback: (data: { path: string; preview: string }) => void
  ) => () => void
  onProcessingNoScreenshots: (callback: () => void) => () => void
  onResetView: (callback: () => void) => () => void
  takeScreenshot: () => Promise<void>

  //INITIAL SOLUTION EVENTS
  deleteScreenshot: (
    path: string
  ) => Promise<{ success: boolean; error?: string }>
  onSolutionStart: (callback: () => void) => () => void
  onSolutionError: (callback: (error: string) => void) => () => void
  onSolutionSuccess: (callback: (data: any) => void) => () => void
  onProblemExtracted: (callback: (data: any) => void) => () => void

  

  onDebugStart: (callback: () => void) => () => void
  onDebugError: (callback: (error: string) => void) => () => void
  onDebugSuccess: (callback: (data: any) => void) => () => void

  // Add the updateApiKey method
  updateApiKey: (apiKey: string) => Promise<void>
  setApiKey: (
    apiKey: string
  ) => Promise<{ success: boolean; error?: string }>

  openExternal: (url: string) => Promise<void>

  onOpenQuestionBox: (callback: () => void) => () => void
  onOpenCheatsheet: (callback: () => void) => () => void
  askQuestion: (question: string) => Promise<{ success: boolean; answer?: string; error?: string }>
}


declare global {
  interface Window {
    electronAPI: ElectronAPI
    electron: {
      ipcRenderer: {
        on: (channel: string, func: (...args: any[]) => void) => void
        removeListener: (
          channel: string,
          func: (...args: any[]) => void
        ) => void
      }
    }
    __LANGUAGE__: string
    __IS_INITIALIZED__: boolean
  }
}

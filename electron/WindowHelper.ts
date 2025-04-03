// electron/WindowHelper.ts

import { BrowserWindow, screen } from "electron"
import { AppState } from "main"
import path from "node:path"

const isDev = process.env.NODE_ENV === "development"

const startUrl = isDev
  ? "http://localhost:5173"
  : `file://${path.join(__dirname, "../dist/index.html").replace(/\\/g, '/')}`

export class WindowHelper {
  private mainWindow: BrowserWindow | null = null
  private isWindowVisible: boolean = false
  private windowPosition: { x: number; y: number } | null = null
  private windowSize: { width: number; height: number } | null = null
  private appState: AppState

  // Initialize with explicit number type and 0 value
  private screenWidth: number = 0
  private screenHeight: number = 0
  private step: number = 0
  private currentX: number = 0
  private currentY: number = 0

  // Add this property to track focus
  private wasFocused: boolean = false

  // private overlayWindow: BrowserWindow | null = null

  constructor(appState: AppState) {
    this.appState = appState
  }

  public setWindowDimensions(width: number, height: number): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return

    // Get current window position
    const [currentX, currentY] = this.mainWindow.getPosition()

    // Get screen dimensions
    const primaryDisplay = screen.getPrimaryDisplay()
    const workArea = primaryDisplay.workAreaSize

    // Limit width as before
    const maxAllowedWidth = Math.floor(
      workArea.width * (this.appState.getHasDebugged() ? 0.5 : 0.3) // Reduced from 0.75/0.4
    )

    // Add height limit (70% of screen height)
    const maxAllowedHeight = Math.floor(workArea.height * 0.7)

    // Ensure width and height don't exceed max allowed values
    const newWidth = Math.min(width + 32, maxAllowedWidth)
    const newHeight = Math.min(Math.ceil(height), maxAllowedHeight)

    // Center the window horizontally if it would go off screen
    const maxX = workArea.width
    const newX = Math.min(Math.max(currentX, 0), maxX)

    // Update window bounds
    this.mainWindow.setBounds({
      x: newX,
      y: currentY,
      width: newWidth,
      height: newHeight
    })

    // Update internal state
    this.windowPosition = { x: newX, y: currentY }
    this.windowSize = { width: newWidth, height: newHeight }
    this.currentX = newX

    // Update overlay position after changing main window
    // this.updateOverlayPosition()
  }

  public createWindow(): void {
    if (this.mainWindow !== null) return

    // Debug: Log all existing windows
    console.log("Current browser windows:", BrowserWindow.getAllWindows().length)

    const primaryDisplay = screen.getPrimaryDisplay()
    const workArea = primaryDisplay.workAreaSize
    this.screenWidth = workArea.width
    this.screenHeight = workArea.height

    this.step = Math.floor(this.screenWidth / 10) // 10 steps
    this.currentX = 0 // Start at the left

    // Set initial dimensions here - make them smaller
    const initialWidth = Math.floor(workArea.width * 0.25) // 25% of screen width
    const initialHeight = Math.floor(workArea.height * 0.3) // 30% of screen height

    const windowSettings: Electron.BrowserWindowConstructorOptions = {
      height: initialHeight, // Set explicit height
      width: initialWidth,   // Set explicit width
      x: this.currentX,
      y: 0,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js")
      },
      show: true,
      frame: true,
      transparent: true,
      fullscreenable: false,
      hasShadow: false,
      focusable: true,
      alwaysOnTop: true,
      // backgroundColor: "#FF000000"
    }

    this.mainWindow = new BrowserWindow(windowSettings)
    // this.mainWindow.webContents.openDevTools()
    this.mainWindow.setContentProtection(true)
    this.mainWindow.setHiddenInMissionControl(true)

    if (process.platform === "darwin") {
      this.mainWindow.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true
      })
      this.mainWindow.setAlwaysOnTop(true, "floating")
    }

    this.mainWindow.loadURL(startUrl).catch((err) => {
      console.error("Failed to load URL:", err)
    })

    const bounds = this.mainWindow.getBounds()
    this.windowPosition = { x: bounds.x, y: bounds.y }
    this.windowSize = { width: bounds.width, height: bounds.height }
    this.currentX = bounds.x
    this.currentY = bounds.y

    // If you need to create a second overlay window
    // (Remove this if you're not explicitly creating a second window)
    // if (this.overlayWindow === null) {
    //   this.overlayWindow = new BrowserWindow({
    //     parent: this.mainWindow,
    //     frame: false,
    //     transparent: true,
    //     hasShadow: false,
    //     webPreferences: {
    //       nodeIntegration: true,
    //       contextIsolation: true,
    //       preload: path.join(__dirname, "preload.js")
    //     },
    //     backgroundColor: "#FF0000",
    //     // This makes it follow the parent window
    //     x: this.mainWindow.getBounds().x,
    //     y: this.mainWindow.getBounds().y,
    //     width: this.mainWindow.getBounds().width,
    //     height: this.mainWindow.getBounds().height
    //   })
      
    //   // Load minimal content for overlay
    //   this.overlayWindow.loadURL(`file://${path.join(__dirname, "../dist/overlay.html")}`)
    //     .catch(err => console.error("Failed to load overlay URL:", err))
    // }

    this.setupWindowListeners()
    this.isWindowVisible = true

    // setTimeout(() => this.resizeWindow(400, 300), 500); // 400x300 pixels
  }

  private setupWindowListeners(): void {
    if (!this.mainWindow) return

    this.mainWindow.on("move", () => {
      if (this.mainWindow) {
        const bounds = this.mainWindow.getBounds()
        this.windowPosition = { x: bounds.x, y: bounds.y }
        this.currentX = bounds.x
        this.currentY = bounds.y
        
        // Update overlay position when main window moves
        // this.updateOverlayPosition()
      }
    })

    this.mainWindow.on("resize", () => {
      if (this.mainWindow) {
        const bounds = this.mainWindow.getBounds()
        this.windowSize = { width: bounds.width, height: bounds.height }
      }
    })

    this.mainWindow.on("closed", () => {
      this.mainWindow = null
      this.isWindowVisible = false
      this.windowPosition = null
      this.windowSize = null
    })
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }

  public isVisible(): boolean {
    return this.isWindowVisible
  }

  public hideMainWindow(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      console.warn("Main window does not exist or is destroyed.")
      return
    }

    // Store focus state before hiding
    this.wasFocused = this.mainWindow.isFocused()

    const bounds = this.mainWindow.getBounds()
    this.windowPosition = { x: bounds.x, y: bounds.y }
    this.windowSize = { width: bounds.width, height: bounds.height }
    this.mainWindow.hide()
    this.isWindowVisible = false
  }

  public showMainWindow(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      console.warn("Main window does not exist or is destroyed.")
      return
    }

    const focusedWindow = BrowserWindow.getFocusedWindow()

    if (this.windowPosition && this.windowSize) {
      this.mainWindow.setBounds({
        x: this.windowPosition.x,
        y: this.windowPosition.y,
        width: this.windowSize.width,
        height: this.windowSize.height
      })
    }

    this.mainWindow.showInactive()

    if (focusedWindow && !focusedWindow.isDestroyed()) {
      focusedWindow.focus()
    }

    this.isWindowVisible = true
  }

  public toggleMainWindow(): void {
    if (this.isWindowVisible) {
      this.hideMainWindow()
    } else {
      this.showMainWindow()
    }
  }

  // New methods for window movement
  public moveWindowRight(): void {
    if (!this.mainWindow) return

    const windowWidth = this.windowSize?.width || 0
    const halfWidth = windowWidth / 2

    // Ensure currentX and currentY are numbers
    this.currentX = Number(this.currentX) || 0
    this.currentY = Number(this.currentY) || 0

    this.currentX = Math.min(
      this.screenWidth - halfWidth,
      this.currentX + this.step
    )
    this.mainWindow.setPosition(
      Math.round(this.currentX),
      Math.round(this.currentY)
    )
    
    // this.updateOverlayPosition()
  }

  public moveWindowLeft(): void {
    if (!this.mainWindow) return

    const windowWidth = this.windowSize?.width || 0
    const halfWidth = windowWidth / 2

    // Ensure currentX and currentY are numbers
    this.currentX = Number(this.currentX) || 0
    this.currentY = Number(this.currentY) || 0

    this.currentX = Math.max(-halfWidth, this.currentX - this.step)
    this.mainWindow.setPosition(
      Math.round(this.currentX),
      Math.round(this.currentY)
    )
    
    // this.updateOverlayPosition()
  }

  public moveWindowDown(): void {
    if (!this.mainWindow) return

    const windowHeight = this.windowSize?.height || 0
    const halfHeight = windowHeight / 2

    // Ensure currentX and currentY are numbers
    this.currentX = Number(this.currentX) || 0
    this.currentY = Number(this.currentY) || 0

    this.currentY = Math.min(
      this.screenHeight - halfHeight,
      this.currentY + this.step
    )
    this.mainWindow.setPosition(
      Math.round(this.currentX),
      Math.round(this.currentY)
    )
    
    // this.updateOverlayPosition()
  }

  public moveWindowUp(): void {
    if (!this.mainWindow) return

    const windowHeight = this.windowSize?.height || 0
    const halfHeight = windowHeight / 2

    // Ensure currentX and currentY are numbers
    this.currentX = Number(this.currentX) || 0
    this.currentY = Number(this.currentY) || 0

    this.currentY = Math.max(-halfHeight, this.currentY - this.step)
    this.mainWindow.setPosition(
      Math.round(this.currentX),
      Math.round(this.currentY)
    )
    
    // this.updateOverlayPosition()
  }

  // private updateOverlayPosition(): void {
  //   if (!this.mainWindow || !this.overlayWindow || this.overlayWindow.isDestroyed()) return
    
  //   const bounds = this.mainWindow.getBounds()
  //   // this.overlayWindow.setBounds(bounds)
  // }

  // Add a new method to explicitly resize the window
  public resizeWindow(width: number, height: number): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return

    this.mainWindow.setBounds({
      width: width,
      height: height,
      x: this.currentX,
      y: this.currentY
    })

    this.windowSize = { width, height }
    // this.updateOverlayPosition()
  }

  public resizeWindowByFactor(factor: number): void {
    if (!this.windowSize) return;
    
    const newWidth = Math.floor(this.windowSize.width * factor);
    const newHeight = Math.floor(this.windowSize.height * factor);
    this.resizeWindow(newWidth, newHeight);
  }
}

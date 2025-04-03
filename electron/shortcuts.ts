import { globalShortcut, app } from "electron"
import { AppState } from "./main" // Adjust the import path if necessary
import { PROCESSING_EVENTS } from "./constants"

export class ShortcutsHelper {
  private appState: AppState

  constructor(appState: AppState) {
    this.appState = appState
  }

  public registerGlobalShortcuts(): void {
    globalShortcut.register("CommandOrControl+Shift+H", async () => {
      const mainWindow = this.appState.getMainWindow()
      if (mainWindow) {
        console.log("Taking screenshot...")
        try {
          const screenshotPath = await this.appState.takeScreenshot()
          const preview = await this.appState.getImagePreview(screenshotPath)
          mainWindow.webContents.send("screenshot-taken", {
            path: screenshotPath,
            preview
          })
        } catch (error) {
          console.error("Error capturing screenshot:", error)
        }
      }
    })

    globalShortcut.register("CommandOrControl+Shift+Enter", async () => {
      await this.appState.processingHelper.processScreenshots()
    })

    globalShortcut.register("CommandOrControl+R", () => {
      console.log(
        "Command + R pressed. Canceling requests and resetting queues..."
      )

      // Cancel ongoing API requests
      this.appState.processingHelper.cancelOngoingRequests()

      // Clear both screenshot queues
      this.appState.clearQueues()

      console.log("Cleared queues.")

      // Update the view state to 'queue'
      this.appState.setView("queue")

      // Notify renderer process to switch view to 'queue'
      const mainWindow = this.appState.getMainWindow()
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("reset-view")
      }
    })

    // New shortcuts for moving the window
    globalShortcut.register("CommandOrControl+J", () => {
      console.log("Command/Ctrl + Left pressed. Moving window left.")
      this.appState.moveWindowLeft()
    })

    globalShortcut.register("CommandOrControl+K", () => {
      console.log("Command/Ctrl + Right pressed. Moving window right.")
      this.appState.moveWindowRight()
    })
    globalShortcut.register("CommandOrControl+L", () => {
      console.log("Command/Ctrl + down pressed. Moving window down.")
      this.appState.moveWindowDown()
    })
    globalShortcut.register("CommandOrControl+O", () => {
      console.log("Command/Ctrl + Up pressed. Moving window Up.")
      this.appState.moveWindowUp()
    })

    globalShortcut.register("CommandOrControl+Shift+B", () => {
      this.appState.toggleMainWindow()
      // If window exists and we're showing it, bring it to front
      const mainWindow = this.appState.getMainWindow()
      if (mainWindow && !this.appState.isVisible()) {
        // Force the window to the front on macOS
        if (process.platform === "darwin") {
          mainWindow.setAlwaysOnTop(true, "normal")
          // Reset alwaysOnTop after a brief delay
          setTimeout(() => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.setAlwaysOnTop(true, "floating")
            }
          }, 100)
        }
      }
    })
    globalShortcut.register("CommandOrControl+Shift+E", () => {
      // Open a text box and ask a question. when question is written, then it will submit the question
      const mainWindow = this.appState.getMainWindow()
      if (mainWindow && !mainWindow.isDestroyed()) {
        console.log("Command/Ctrl + SHIFT + E pressed. Opening question box.")
        mainWindow.webContents.send(PROCESSING_EVENTS.OPEN_QUESTION_BOX)
        
        // Ensure window is visible and focused when opening question box
        if (!this.appState.isVisible()) {
          this.appState.toggleMainWindow()
          
          // Force the window to the front on macOS
          if (process.platform === "darwin") {
            mainWindow.setAlwaysOnTop(true, "normal")
            // Reset alwaysOnTop after a brief delay
            setTimeout(() => {
              if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.setAlwaysOnTop(true, "floating")
              }
            }, 100)
          }
        }
      }
    })

    globalShortcut.register("CommandOrControl+Shift+C", () => {
      // Open the cheatsheet
      const mainWindow = this.appState.getMainWindow()
      if (mainWindow && !mainWindow.isDestroyed()) {
        console.log("Command/Ctrl + SHIFT + C pressed. Opening cheatsheet.")
        mainWindow.webContents.send(PROCESSING_EVENTS.OPEN_CHEATSHEET)
        
        // Ensure window is visible and focused when opening cheatsheet
        if (!this.appState.isVisible()) {
          this.appState.toggleMainWindow()
          
          // Force the window to the front on macOS
          if (process.platform === "darwin") {
            mainWindow.setAlwaysOnTop(true, "normal")
            // Reset alwaysOnTop after a brief delay
            setTimeout(() => {
              if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.setAlwaysOnTop(true, "floating")
              }
            }, 100)
          }
        }
      }
    })

    // Unregister shortcuts when quitting
    app.on("will-quit", () => {
      globalShortcut.unregisterAll()
    })
  }
}

import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastMessage,
  ToastVariant
} from "./components/ui/toast"
import Queue from "./_pages/Queue"
import { ToastViewport } from "@radix-ui/react-toast"
import { useEffect, useRef, useState, useCallback } from "react"
import Solutions from "./_pages/Solutions"
import Question from "./_pages/Question"
import Cheatsheet from "./_pages/Cheatsheet"
import { QueryClient, QueryClientProvider } from "react-query"
import ApiKeyAuth from "./components/ApiKeyAuth"
import { createContext, useContext } from "react"
import SubscribedApp from "./_pages/SubscribedApp"
import { UpdateNotification } from "./components/UpdateNotification"



import { WelcomeScreen } from "./components/WelcomeScreen"
import { SettingsDialog } from "./components/SettingsDialog"


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity
    }
  }
})

interface ToastContextType {
  showToast: (title: string, description: string, variant: ToastVariant) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const App: React.FC = () => {
  const [view, setView] = useState<"queue" | "solutions" | "debug" | "question" | "cheatsheet">("queue")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<ToastMessage>({
    title: "",
    description: "",
    variant: "neutral"
  })
  const [currentLanguage, setCurrentLanguage] = useState<string>("python")
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleApiKeySubmit = async (key: string) => {
    const result = await window.electronAPI.setApiKey(key)
    if (result.success) {
      setIsAuthenticated(true)
    }
  }

  const updateLanguage = useCallback((newLanguage: string) => {
    setCurrentLanguage(newLanguage)
    window.__LANGUAGE__ = newLanguage
  }, [])

    const markInitialized = useCallback(() => {
    setIsInitialized(true)
    window.__IS_INITIALIZED__ = true
  }, [])

  const showToast = (
    title: string,
    description: string,
    variant: ToastVariant
  ) => {
    setToastMessage({ title, description, variant })
    setToastOpen(true)
  }
  
  useEffect(() => {
    const autoAuthWithEnvKey = async () => {
      try {
        const envApiKey = import.meta.env.VITE_OPENAI_API_KEY
        if (envApiKey && envApiKey.trim() !== '') {
          const result = await window.electronAPI.setApiKey(envApiKey)
          if (result.success) {
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error("Failed to auto-authenticate with env variable:", error)
      }
    }

    const checkApiKey = async () => {
      try {
        const hasKey = await window.electronAPI.checkApiKey()
        
        // If no API key is found, show the settings dialog after a short delay
        if (!hasKey) {
          setTimeout(() => {
            setIsSettingsOpen(true)
          }, 1000)
        }
        setIsAuthenticated(hasKey)
      } catch (error) {
        console.error("Failed to check API key:", error)
      }
    }

    // checkApiKey()
    autoAuthWithEnvKey()
  }, [])
  

  useEffect(() => {
    if (isInitialized) {
      // Process all types of dropdown elements with a shorter delay
      const timer = setTimeout(() => {
        // Find both native select elements and custom dropdowns
        const selectElements = document.querySelectorAll('select');
        const customDropdowns = document.querySelectorAll('.dropdown-trigger, [role="combobox"], button:has(.dropdown)');
        
        // Enable native selects
        selectElements.forEach(dropdown => {
          dropdown.disabled = false;
        });
        
        // Enable custom dropdowns by removing any disabled attributes
        customDropdowns.forEach(dropdown => {
          if (dropdown instanceof HTMLElement) {
            dropdown.removeAttribute('disabled');
            dropdown.setAttribute('aria-disabled', 'false');
          }
        });
        
        console.log(`Enabled ${selectElements.length} select elements and ${customDropdowns.length} custom dropdowns`);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

     useEffect(() => {
    const unsubscribeSettings = window.electronAPI.onShowSettings(() => {
      console.log("Show settings dialog requested");
      setIsSettingsOpen(true);
    });
    
    return () => {
      unsubscribeSettings();
    };
  }, []);

    let initialLoad = false


  useEffect(() => {
    const cleanup = window.electronAPI.onResetView(() => {
      queryClient.invalidateQueries(["screenshots"])
      queryClient.invalidateQueries(["problem_statement"])
      queryClient.invalidateQueries(["solution"])
      queryClient.invalidateQueries(["new_solution"])
      setView("queue")
    })

    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const updateHeight = () => {
      if (!containerRef.current) return
      const height = containerRef.current.scrollHeight
      const width = containerRef.current.scrollWidth
      console.log("Updating dimensions", width, height)
      if (!initialLoad) {
        window.electronAPI?.updateContentDimensions({ width, height })
        initialLoad = true
      }    
    }

    const resizeObserver = new ResizeObserver(() => {
      updateHeight()
    })

    // Initial height update
    updateHeight()

    // Observe for changes
    resizeObserver.observe(containerRef.current)

    // Also update height when view changes
    const mutationObserver = new MutationObserver(() => {
      updateHeight()
    })

    mutationObserver.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [view]) // Re-run when view changes

//     useEffect(() => {

//     const initializeApp = async () => {
//       try {
        
//         // Load config including language and model settings
//         const config = await window.electronAPI.getConfig()
        
//         // Load language preference
//         if (config && config.language) {
//           updateLanguage(config.language)
//         } else {
//           updateLanguage("python")
//         }

        
        
//         // Model settings are now managed through the settings dialog
//         // and stored in config as extractionModel, solutionModel, and debuggingModel
        
//         markInitialized()
//       } catch (error) {
//         console.error("Failed to initialize app:", error)
//         // Fallback to defaults
//         updateLanguage("python")
//         markInitialized()
//       }
//     }
    
//     initializeApp()

//         const onApiKeyInvalid = () => {
//       showToast(
//         "API Key Invalid",
//         "Your OpenAI API key appears to be invalid or has insufficient credits",
//         "error"
//       )

//     }
//     window.electronAPI.onApiKeyInvalid(onApiKeyInvalid)
// // Cleanup function
//     return () => {
//       window.electronAPI.removeListener("API_KEY_INVALID", onApiKeyInvalid)

//       window.__IS_INITIALIZED__ = false
//       setIsInitialized(false)
//     }
//   }, [updateLanguage, markInitialized, showToast])

  useEffect(() => {
    const cleanupFunctions = [
      window.electronAPI.onSolutionStart(() => {
        setView("solutions")
      }),

      window.electronAPI.onUnauthorized(() => {
        queryClient.removeQueries(["screenshots"])
        queryClient.removeQueries(["solution"])
        queryClient.removeQueries(["problem_statement"])
        setView("queue")
      }),
      // Update this reset handler
      window.electronAPI.onResetView(() => {
        queryClient.removeQueries(["screenshots"])
        queryClient.removeQueries(["solution"])
        queryClient.removeQueries(["problem_statement"])
        setView("queue")
      }),
      window.electronAPI.onProblemExtracted((data: any) => {
        if (view === "queue") {
          queryClient.invalidateQueries(["problem_statement"])
          queryClient.setQueryData(["problem_statement"], data)
        }
      })
    ]
    return () => cleanupFunctions.forEach((cleanup) => cleanup())
  }, [])

  if (!isAuthenticated) {
    return <ApiKeyAuth onApiKeySubmit={handleApiKeySubmit} />
  }

  return (
    <div ref={containerRef} className="max-h-0 max-w-0 ">
      <QueryClientProvider client={queryClient} >
        <ToastProvider >
          <ToastContext.Provider value={{ showToast }}>
            {view === "queue" ? (
              <Queue setView={setView} />
            ) : view === "solutions" ? (
              <Solutions setView={setView} />
            ) : (
              <></>
            )}
          </ToastContext.Provider>
          <Toast
            open={toastOpen}
            onOpenChange={setToastOpen}
            variant={toastMessage.variant}
            duration={3000}
          >
            <ToastTitle>{toastMessage.title}</ToastTitle>
            <ToastDescription>{toastMessage.description}</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App

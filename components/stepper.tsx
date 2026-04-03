"use client"

import { cn } from "@/lib/utils"
import { Check, User, Users, ShoppingBag, CreditCard } from "lucide-react"

interface Step {
  id: number
  title: string
  shortTitle: string
  icon: React.ReactNode
}

interface StepperProps {
  currentStep: number
  onStepClick?: (step: number) => void
}

const steps: Step[] = [
  { id: 0, title: "Comprador", shortTitle: "Comprador", icon: <User className="h-4 w-4 sm:h-5 sm:w-5" /> },
  { id: 1, title: "Passageiros", shortTitle: "Passag.", icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" /> },
  { id: 2, title: "Extras", shortTitle: "Extras", icon: <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" /> },
  { id: 3, title: "Pagamento", shortTitle: "Pagam.", icon: <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" /> },
]

export function Stepper({ currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex items-flex-start justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className="flex items-center">
              {/* Left Connector */}
              {index > 0 ? (
                <div className="flex-1 min-w-[14px] max-w-[48px] h-0.5 sm:h-1">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      step.id <= currentStep ? "bg-primary" : "bg-muted-foreground/20"
                    )}
                  />
                </div>
              ) : (
                <div className="flex-1 min-w-[14px] max-w-[48px] invisible" /> // 👈 espaçador
              )}

              {/* Step Circle */}
              <button
                onClick={() => onStepClick?.(step.id)}
                disabled={step.id > currentStep}
                className={cn(
                  "relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  step.id < currentStep && "border-primary bg-primary text-primary-foreground cursor-pointer hover:opacity-80",
                  step.id === currentStep && "border-primary bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/20",
                  step.id > currentStep && "border-muted-foreground/30 bg-background text-muted-foreground cursor-not-allowed"
                )}
              >
                {step.id < currentStep ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  step.icon
                )}
              </button>

              {/* Right Connector */}
              {index < steps.length - 1 ? (
                <div className="flex-1 min-w-[14px] max-w-[48px] h-0.5 sm:h-1">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      step.id < currentStep ? "bg-primary" : "bg-muted-foreground/20"
                    )}
                  />
                </div>
              ) : (
                <div className="flex-1 min-w-[14px] max-w-[48px] invisible" /> // 👈 espaçador
              )}
            </div>

            {/* Label - centrado abaixo do círculo */}
            <span
              className={cn(
                "mt-2 text-[10px] sm:text-xs font-medium transition-colors text-center whitespace-nowrap",
                step.id <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <span className="hidden sm:inline">{step.title}</span>
              <span className="sm:hidden">{step.shortTitle}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useBooking } from "@/lib/booking-context"
import { clientSchema, type Client } from "@/lib/schemas"
import { formatDateInput, toISODate, fromISODate, formatCPF, formatPhone } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, Calendar, IdCard } from "lucide-react"

export function ClientTab() {
  const { state, setClient, setCanProceed } = useBooking()
  const [dateDisplay, setDateDisplay] = useState(() => fromISODate(state.client.birthDate || ""))
  const [cpfDisplay, setCpfDisplay] = useState(() => state.client.cpf || "")
  const [phoneDisplay, setPhoneDisplay] = useState(() => state.client.phone || "")
  const [allTouched, setAllTouched] = useState(() => !!(state.client.name || state.client.cpf))

  const {
    register,
    formState: { errors, isValid, touchedFields },
    getValues,
    setValue,
    trigger,
  } = useForm<Client>({
    resolver: zodResolver(clientSchema),
    mode: "all",
    defaultValues: state.client as Client,
  })

  useEffect(() => {
    setCanProceed(isValid)
  }, [isValid, setCanProceed])

  useEffect(() => {
    if (state.client.name || state.client.cpf) {
      setAllTouched(true)
      trigger()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const makeBlurHandler = (field: keyof Client, registerOnBlur: React.FocusEventHandler<HTMLInputElement>) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      registerOnBlur(e)
      setAllTouched(true)
      setClient(getValues())
    }

  const shouldShowError = (field: keyof Client) =>
    (allTouched || touchedFields[field]) && errors[field]

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value)
    setDateDisplay(formatted)
    if (formatted.length === 10) {
      setValue("birthDate", toISODate(formatted), { shouldValidate: true })
    } else {
      setValue("birthDate", "", { shouldValidate: allTouched || touchedFields.birthDate })
    }
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpfDisplay(formatted)
    setValue("cpf", formatted, { shouldValidate: allTouched || !!touchedFields.cpf })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setPhoneDisplay(formatted)
    setValue("phone", formatted, { shouldValidate: allTouched || !!touchedFields.phone })
  }

  const nameField = register("name")
  const cpfField = register("cpf")
  const rgField = register("rg")
  const emailField = register("email")
  const phoneField = register("phone")
  const birthDateField = register("birthDate")

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
          Dados do Comprador
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Preencha os dados do responsável pela compra
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
                <User className="h-4 w-4 text-primary" />
                Nome Completo
              </Label>
              <Input
                id="name"
                placeholder="Digite seu nome completo"
                {...nameField}
                onBlur={makeBlurHandler("name", nameField.onBlur)}
                className={shouldShowError("name") ? "border-destructive" : ""}
              />
              {shouldShowError("name") && (
                <p className="text-sm text-destructive">{errors.name?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="flex items-center gap-2 text-foreground">
                <IdCard className="h-4 w-4 text-primary" />
                CPF
              </Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={cpfDisplay}
                onChange={handleCPFChange}
                onBlur={makeBlurHandler("cpf", cpfField.onBlur)}
                maxLength={14}
                className={shouldShowError("cpf") ? "border-destructive" : ""}
              />
              {shouldShowError("cpf") && (
                <p className="text-sm text-destructive">{errors.cpf?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rg" className="flex items-center gap-2 text-foreground">
                <IdCard className="h-4 w-4 text-primary" />
                RG
              </Label>
              <Input
                id="rg"
                placeholder="Digite seu RG"
                {...rgField}
                onBlur={makeBlurHandler("rg", rgField.onBlur)}
                className={shouldShowError("rg") ? "border-destructive" : ""}
              />
              {shouldShowError("rg") && (
                <p className="text-sm text-destructive">{errors.rg?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...emailField}
                onBlur={makeBlurHandler("email", emailField.onBlur)}
                className={shouldShowError("email") ? "border-destructive" : ""}
              />
              {shouldShowError("email") && (
                <p className="text-sm text-destructive">{errors.email?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
                <Phone className="h-4 w-4 text-primary" />
                Telefone
              </Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={phoneDisplay}
                onChange={handlePhoneChange}
                onBlur={makeBlurHandler("phone", phoneField.onBlur)}
                maxLength={15}
                className={shouldShowError("phone") ? "border-destructive" : ""}
              />
              {shouldShowError("phone") && (
                <p className="text-sm text-destructive">{errors.phone?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Data de Nascimento
              </Label>
              <Input
                id="birthDate"
                placeholder="DD/MM/AAAA"
                value={dateDisplay}
                onChange={handleDateChange}
                onBlur={makeBlurHandler("birthDate", birthDateField.onBlur)}
                maxLength={10}
                className={shouldShowError("birthDate") ? "border-destructive" : ""}
              />
              {shouldShowError("birthDate") && (
                <p className="text-sm text-destructive">{errors.birthDate?.message}</p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
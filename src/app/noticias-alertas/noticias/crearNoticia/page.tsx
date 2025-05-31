"use client"
import { useIsAdmin } from "@/app/hooks/isAdmin"
import { useEffect, useState } from "react"
import CrearNoticiaForm from "../../Formularios/CrearNoticiaForm"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CrearNoticiaPage() {
  const [isLoading, setIsLoading] = useState(true)
  const isAdmin = useIsAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false)
    }
  }, [isAdmin])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 flex flex-col items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso restringido</AlertTitle>
          <AlertDescription>Solo los administradores pueden crear noticias.</AlertDescription>
        </Alert>
        <Button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white" onClick={() => router.push("/")}>
          Volver al inicio
        </Button>
      </div>
    )
  }

  return <CrearNoticiaForm />
}

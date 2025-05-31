"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useIsAdmin } from "../../../hooks/isAdmin"
import { Edit, Trash2, Save, X, Calendar, User, ExternalLink, ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "react-hot-toast"
import {
  obtenerNoticiaEspecifica,
  actualizarNoticia,
  eliminarNoticia,
  formatearFecha,
  validarDatosNoticia,
  type Noticia,
  type FormDataNoticia,
} from "../../utils"

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  noticiaTitle,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
  noticiaTitle: string
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Confirmar Eliminación</h3>
                    <p className="text-red-100 text-sm">Esta acción no se puede deshacer</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  ¿Estás seguro de que quieres eliminar la noticia{" "}
                  <span className="font-semibold text-gray-900">"{noticiaTitle}"</span>?
                </p>
                <p className="text-sm text-gray-500">
                  Esta acción eliminará permanentemente la noticia y no podrá ser recuperada.
                </p>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="group relative flex-1 overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <span>{isDeleting ? "Eliminando..." : "Eliminar"}</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function NoticiaDetalle() {
  const { idNoticia } = useParams()
  const router = useRouter()
  const isAdmin = useIsAdmin()

  const [noticia, setNoticia] = useState<Noticia | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editForm, setEditForm] = useState<FormDataNoticia>({
    titulo: "",
    descripcion: "",
    link: "",
    autor: "",
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchNoticia = async () => {
      if (!idNoticia || typeof idNoticia !== "string") {
        setLoading(false)
        return
      }

      try {
        const data = await obtenerNoticiaEspecifica(idNoticia)
        setNoticia(data)
        setEditForm({
          titulo: data.titulo,
          descripcion: data.descripcion,
          link: data.link || "",
          autor: data.autor,
        })
      } catch (error) {
        console.error("Error cargando la noticia:", error)
        toast.error("Error al cargar la noticia")
      } finally {
        setLoading(false)
      }
    }

    fetchNoticia()
  }, [idNoticia])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (noticia) {
      setEditForm({
        titulo: noticia.titulo,
        descripcion: noticia.descripcion,
        link: noticia.link || "",
        autor: noticia.autor,
      })
    }
  }

  const handleSave = async () => {
    if (!noticia) return
    setSaving(true)
    try {
      // Validar datos antes de enviar
      validarDatosNoticia(editForm)

      const updatedNoticia = await actualizarNoticia(noticia.idnoticia, editForm)
      setNoticia(updatedNoticia)
      setIsEditing(false)
      toast.success("¡Noticia actualizada exitosamente! ✨", { position: "top-center" })
    } catch (error) {
      console.error("Error actualizando la noticia:", error)
      if (error instanceof Error) {
        toast.error(error.message, { position: "top-center" })
      } else {
        toast.error("Error al actualizar la noticia", { position: "top-center" })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!noticia) return
    setDeleting(true)
    try {
      await eliminarNoticia(noticia.idnoticia)
      toast.success("¡Noticia eliminada correctamente! 🗑️", { position: "top-center" })
      router.push("/noticias")
    } catch (error) {
      console.error("Error eliminando la noticia:", error)
      if (error instanceof Error) {
        toast.error(error.message, { position: "top-center" })
      } else {
        toast.error("Error al eliminar la noticia", { position: "top-center" })
      }
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  const handleInputChange = (field: keyof FormDataNoticia, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Cargando noticia...</p>
        </motion.div>
      </div>
    )
  }

  if (!noticia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <p className="text-red-500 font-medium text-lg">No se encontró la noticia.</p>
          <button
            onClick={() => router.push("/noticias-alertas")}
            className="mt-4 text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a noticias
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/noticias-alertas")}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver a noticias
          </motion.button>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300"
              >
                {/* Edit Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg">
                    <Edit className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Editar Noticia</h1>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Título */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                    <input
                      type="text"
                      value={editForm.titulo}
                      onChange={(e) => handleInputChange("titulo", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white"
                      placeholder="Título de la noticia..."
                    />
                  </div>

                  {/* Descripción */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={editForm.descripcion}
                      onChange={(e) => handleInputChange("descripcion", e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white resize-none"
                      placeholder="Descripción de la noticia..."
                    />
                  </div>

                  {/* Link y Autor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Link <span className="text-gray-400">(opcional)</span>
                      </label>
                      <input
                        type="url"
                        value={editForm.link}
                        onChange={(e) => handleInputChange("link", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white"
                        placeholder="https://ejemplo.com"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Autor</label>
                      <input
                        type="text"
                        value={editForm.autor}
                        onChange={(e) => handleInputChange("autor", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white"
                        placeholder="Nombre del autor"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="group relative flex-1 overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {saving ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
                      </div>
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="group relative flex-1 overflow-hidden bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <div className="relative flex items-center justify-center gap-3">
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span>Cancelar</span>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="viewing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300"
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="inline-block bg-white/20 text-white text-sm px-4 py-2 rounded-full font-medium mb-4">
                        Noticia Completa
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold leading-tight">{noticia.titulo}</h1>
                    </div>

                    {isAdmin && (
                      <div className="flex gap-3">
                        <button
                          onClick={handleEdit}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-xl transition-all duration-300 hover:scale-110 group"
                        >
                          <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="bg-red-500/80 hover:bg-red-600 backdrop-blur-sm text-white p-3 rounded-xl transition-all duration-300 hover:scale-110 group"
                        >
                          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  {/* Article Content */}
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{noticia.descripcion}</p>
                  </div>

                  {/* External Link */}
                  {noticia.link && noticia.link.trim() !== "No existe una dirección a la noticia extendida" && (
                    <motion.a
                      href={noticia.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 px-6 py-4 rounded-xl transition-all duration-300 font-medium group"
                    >
                      <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Ver fuente original</span>
                      <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-blue-500 transition-colors"></div>
                    </motion.a>
                  )}

                  {/* Metadata */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Autor</p>
                          <p className="text-lg font-semibold text-gray-800">{noticia.autor}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                        <div className="bg-green-100 p-3 rounded-full">
                          <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Fecha de publicación</p>
                          <p className="text-lg font-semibold text-gray-800">{formatearFecha(noticia.fecha)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
        noticiaTitle={noticia?.titulo || ""}
      />
    </>
  )
}

export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-blue-800 font-medium">Proyecto Ingenieria de Software II</p>
        <div className="flex items-center gap-1 text-sm text-blue-600">
          <span>Desarrollado por:</span>
          <span className="font-medium">Juan David Muñoz, Juan José Santacruz, Juan Pablo Zuluaga</span>
        </div>
        <div className="text-xs text-blue-400 mt-2 md:mt-0">
          © {new Date().getFullYear()} - Todos los derechos reservados
        </div>
      </div>
    </footer>
  )
}

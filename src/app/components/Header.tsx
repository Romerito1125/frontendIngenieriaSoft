import UserMenu from "../components/UserMenu";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full px-4 py-2 flex justify-between items-center border-b">
      <div className="flex items-center space-x-2">
        {/* LOGO a la izquierda */}
        {/* TEXTO con fuente Lobster */}
        <Link
          href="/"
          className="text-2xl font-normal text-blue-900"
          style={{ fontFamily: "Lobster, cursive" }}
        >
          <Image src="/Logo.png" alt="Logo" width={60} height={60} />
        </Link>
      </div>

      {/* Menú a la derecha */}
      <UserMenu />
    </header>
  );
}

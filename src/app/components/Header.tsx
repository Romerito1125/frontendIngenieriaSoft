import UserMenu from "../components/UserMenu";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full px-4 py-2 flex justify-between items-center border-b">
    <Link href="/" className="text-lg font-bold text-blue-900 hover:underline">
      Proyecto MIO
    </Link>
      <UserMenu />
    </header>
  );
}


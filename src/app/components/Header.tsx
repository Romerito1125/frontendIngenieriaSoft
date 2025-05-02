import { Bars4Icon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-4 border-b border-black-200 bg-white">
      <div className="cursor-pointer">
        { /* <EllipsisVerticalIcon className="size-8 text-purple-500" /> */}
      </div>
      <div className="cursor-pointer">
        { /* <Bars4Icon className="size-8 text-black" /> */}
      </div>
      <div>Proyecto MIO</div>
    </header>
  );
}

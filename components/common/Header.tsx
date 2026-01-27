import Image from "next/image";
import { HeaderActions } from "./HeaderActions";

type HeaderProps = {
  title?: string;
};

export function Header({ title = "페이지" }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-5 px-5 py-[0.62rem]">
      {/* Left Logo */}
      <Image src="/logo.svg" alt="Logo" width={28} height={28} priority />

      {/* Center Title */}
      <h1 className="typo-body1-lg">{title}</h1>

      {/* Right Exit (Client) */}
      <HeaderActions />
    </header>
  );
}

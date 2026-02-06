import Image from "next/image";
import { HeaderActions } from "./HeaderActions";
import Link from "next/link";

type HeaderProps = {
  title?: string;
};

export function Header({ title = "" }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-5 px-5 py-2 h-13">
      {/* Left Logo */}
      <Link href="/">
        <Image src="/logo.svg" alt="Logo" width={28} height={28} priority />
      </Link>

      {/* Center Title */}
      <h1 className="typo-body1-lg">{title}</h1>

      {/* Right Exit (Client) */}
      <HeaderActions />
    </header>
  );
}

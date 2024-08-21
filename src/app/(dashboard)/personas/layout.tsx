// app/personas/layout.tsx

import NavTitle from "@/components/Nav/Title";
import { ROUTE_PERSONAS } from "@/data/routes";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavTitle>
        <Link href={ROUTE_PERSONAS}>Personas</Link>
      </NavTitle>
      <div className="relative py-10 px-8 flex-1 bg-gray-100 overflow-auto">
        <div className="min-h-full overflow-auto flex flex-col">{children}</div>
      </div>
    </>
  );
};

export default Layout;

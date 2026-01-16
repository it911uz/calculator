import React from "react";
import { navigation } from "../shared/nav-link";
import { usePathname } from "next/navigation";
import Link from "next/link";
interface IasideProps {
  isOpen: boolean;
}
const Aside: React.FC<IasideProps> = ({ isOpen }) => {
  const pathname = usePathname();
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-64 bg-[#282963] px-1
        transition-transform duration-300 ease-in-out
        shadow-xl z-30 pt-18
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <ul className="space-y-1 py-2">
        {navigation.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.pathName;
          return (
            <li key={i}>
              <Link
                href={item.pathName}
                className={`flex items-start gap-2 px-4 py-3 transition-all rounded-[3px]
                  ${
                    isActive
                      ? " text-white shadow "
                      : "text-gray-300 hover:text-white "
                  }
                `}
                style={{
                  background: isActive
                    ? "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)"
                    : "transparent",
                }}
              >
                <Icon size={18} />
                <span className="font-medium">{item.navName}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
export default Aside;

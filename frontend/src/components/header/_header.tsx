import Image from "next/image";
import { MdMenuOpen, MdOutlineMenu } from "react-icons/md";
import LogoImage from "@/building-icon-removebg-preview.png";

interface HeaderProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}
const Header: React.FC<HeaderProps> = ({ isOpen, setIsOpen }) => {
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    return (
        <header className="fixed top-0 left-0 right-0 py-2 px-4 shadow-sm shadow-[#d7d7f8] bg-white z-40">
            <div className="flex items-center gap-6">
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    {isOpen ? (
                        <MdMenuOpen size={25} color="#282963" />
                    ) : (
                        <MdOutlineMenu size={25} color="#282963" />
                    )}
                </button>
                <div className="w-8.75 h-8.75">
                    <Image
                        className="w-full h-full"
                        src={LogoImage}
                        alt="building-icon"
                        priority
                    />
                </div>
            </div>
        </header>
    );
};
export default Header;

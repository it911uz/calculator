import { AiOutlineApartment } from "react-icons/ai";
import { FaBuilding, FaCalculator } from "react-icons/fa";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { RiSettings4Fill } from "react-icons/ri";

interface INavigation {
    navName: string;
    icon: React.ComponentType<{ size?: string | number }>;
    pathName: string;
}
export const navigation: INavigation[] = [
    { navName: "Объекты", icon: FaBuilding, pathName: "/"},
    { navName: "Здания", icon: HiMiniBuildingOffice2, pathName: "/buildings"},
    { navName: "Квартиры", icon: AiOutlineApartment, pathName: "/apartments"},
    { navName: "Расчет", icon: FaCalculator, pathName: "/calculator-system"},
    { navName: "Настройки", icon: RiSettings4Fill, pathName:"/settings" },
]
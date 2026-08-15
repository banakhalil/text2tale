import { FaBookOpen, FaDna, FaGlobeAfrica, FaLandmark } from "react-icons/fa";
import type { IconType } from "react-icons";

const SUBJECT_ICONS: Record<number, IconType> = {
  1: FaDna, // علم الاحياء
  2: FaLandmark, // تاريخ
  3: FaGlobeAfrica, // جغرافيا
};

export const getSubjectIcon = (id: number): IconType => SUBJECT_ICONS[id] ?? FaBookOpen;

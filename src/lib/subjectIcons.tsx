import { FaBookOpen, FaDna, FaGlobeAfrica, FaLandmark } from "react-icons/fa";
import type { IconType } from "react-icons";

const SUBJECT_ICONS: Record<string, IconType> = {
  "تاريخ": FaLandmark,
  "علم الاحياء": FaDna,
  "جغرافيا": FaGlobeAfrica,
};

export const getSubjectIcon = (name: string): IconType =>
  SUBJECT_ICONS[name.trim()] ?? FaBookOpen;

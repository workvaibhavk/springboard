import Link from "next/link";
import { ChevronLeft } from "lucide-react";
export default function Back({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-[#665bca] hover:text-[#5548b8] mb-3 text-xl font-medium  p-2 rounded-md transition-colors duration-200    "
    >
      <ChevronLeft className="w-6 h-6 mr-2" />
      {children}
    </Link>
  );
}

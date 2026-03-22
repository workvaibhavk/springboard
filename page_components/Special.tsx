// import { useUser } from "@clerk/nextjs";
// import Link from "next/link";

// export default function Special() {
//     const { user, isLoaded } = useUser();

//     if (!isLoaded) return null;

//     return (
//         <div className="flex justify-center items-center bg-green-500 py-3">




//             {user?.publicMetadata?.role !== "subadmin" || "admin" ? (
//                 <div className="">
//                     <Link href="/subadmin/users"
//                         className="font-semibold text-xl">
//                         71 Certificates Generated in last 2 months and counting <button className="">hii</button>
//                     </Link>
//                 {/* </div> */}
//             ) : (
//                 <div className="hidden">
//                     <Link href="/subadmin/users"
//                         className="font-semibold text-xl">
//                         Welcome, Enter your admin page <button className="">hii</button>
//                     </Link>
//                 </div>
//             )}

//         </div>
//     )
// }

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Special() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return null;

    const role = user?.publicMetadata?.role;
    const isAdmin = role === "admin" || role === "subadmin";

    return (
        <div className="w-full flex justify-center px-4 py-3 bg-green-50 border-b border-green-200">
            {isAdmin ? (
                <Link
                    href="/subadmin/users"
                    className="flex items-center gap-3 bg-white border border-green-300 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                    <span className="text-green-600 text-xl">🔒</span>
                    <p className="text-green-900 font-medium text-sm md:text-base">
                        Manage and verify records
                    </p>
                </Link>
            ) : (
                <div className="flex items-center gap-3 bg-white border border-green-300 px-6 py-3 rounded-xl shadow-sm">
                    {/* <span className="text-green-600 text-xl">✔</span> */}
                    <p className="text-green-900 font-medium text-sm md:text-base">
                        <div className="mb-2 ">
                            71+ certificates issued and securely verified
                        </div>
                        Tap on Course Title to enable cheat

                        <div className="">
                            (9503984002 for queries)
                        </div>
                    </p>
                </div>
            )}

        </div>
    );
}
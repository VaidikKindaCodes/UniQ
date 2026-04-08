"use client";

import OperatorSidebar from "@/components/sidebar/OperatorSidebar";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function OperatorLayout({
    children,
}:{children:React.ReactNode
}){
    return(
        <ProtectedRoute roles={["operator","admin"]}>
            <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <OperatorSidebar/>
                <main className="flex-1 lg:ml-72 min-h-screen">
                    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                      {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}

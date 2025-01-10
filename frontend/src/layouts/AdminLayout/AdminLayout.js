import React from "react";
import "./AdminLayout.scss";
import { useAuth } from "../../hooks";
import { AdminDashboard, Login } from "../../pages";
import { Footer } from "../../components/Footer";
import { TopMenu } from "../../components/TopMenu";
import { Sidebar } from "../../components/Admin";



export function AdminLayout({ children }) {


  const { auth } = useAuth();
    if (!auth) return <Login />;
    return (
      <div className="admin-layout">
        <div className="admin-layout__topmenu">
          <TopMenu />
        </div>
        <div className="admin-layout__content">
         <div className="admin-layout__sidebar">
          <Sidebar />
         </div>
         <div className="admin-layout__main-content">
          <main>{children || <AdminDashboard />}</main>
        </div>
         </div>
        <div className="admin-layout__footer">
          <Footer />
        </div>
      </div>
    );
}




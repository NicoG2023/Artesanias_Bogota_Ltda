import React, {useEffect, useState, useMemo} from "react";
import { Navigate, Outlet } from "react-router-dom";

const ENTITY_KEY = "selectedEntity";

function ProtectedRoutes({isAdminRoute, isSuperAdminRoute}){
    const {auth} = useAuth();
    const {entidad, loading: entidadLoading} = useEntidad();
    const {isLoading, setIsLoading} = useState(true);

    useEffect(() => {
     if(!entidadLoading){
        setIsLoading(false);
     }
    }, entidadLoading);

    const storedEntity = useMemo(() => {
        const savedEntity = localStorage.getItem(ENTITY_KEY);
        return savedEntity ? JSON.parse(savedEntity) : entidad;
    }, [entidad]);

    const isAdmin = useMemo(() => {
     if(auth?.me?.entidades && storedEntity){
        return auth.me.entidades.some(
            (ent) => ent.entidad.id === storedEntity.id && entidad.is_staff
        );
     }
    return false;
    }, [auth, storedEntity]);

    const isSuperAdmin = useMemo(() =>{
        return auth?.me?.is_superuser;
    }, [auth]);

    if(isLoading){
        return <div>Loading...</div>;
    }
    if(isSuperAdminRoute && !isSuperAdmin){
        return <Navigate to = "/" />;
    }

    if(isAdminRoute && !isAdmin){
        return <Navigate to = "/" />;
    }

    return <Outlet />
}

export default ProtectedRoutes;

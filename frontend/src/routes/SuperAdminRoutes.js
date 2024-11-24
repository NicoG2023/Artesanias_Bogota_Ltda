import PrivateRoutes from './PrivateRoutes';

const superAdminROutes = [
    {path: "",
     element: <PrivateRoutes isSuperAdminRoute />, 
     children: [
        {
        path: "",
        element: (
            {/*<SuperAdminLayout>
                <Entidades />
               </SuperAdminLayout>*/}
        ),
        }
     ]
    },
]

export default superAdminROutes;
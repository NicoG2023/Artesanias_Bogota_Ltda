import AdminRoutes from "./AdminRoutes";
import ClientesRoutes from "./ClientesRoutes";
import StaffRoutes from "./StaffRoutes";
import UsuariosRoutes from "./UsuariosRoutes";
import { Error404 } from "../pages";
import { BasicLayout } from "../layouts";

const routes = [
  ...AdminRoutes,
  ...StaffRoutes,
  ...ClientesRoutes,
  ...UsuariosRoutes,
  {
    path: "*",
    element: (
      <BasicLayout>
        <Error404 />
      </BasicLayout>
    ),
  },
];

export default routes;

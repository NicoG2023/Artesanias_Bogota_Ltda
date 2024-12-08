import AdminRoutes from "./AdminRoutes";
import ClientesRoutes from "./ClientesRoutes";
import StaffRoutes from "./StaffRoutes";
import UsuariosRoutes from "./UsuariosRoutes";

const routes = [
  ...AdminRoutes,
  ...StaffRoutes,
  ...ClientesRoutes,
  ...UsuariosRoutes,
];

export default routes;

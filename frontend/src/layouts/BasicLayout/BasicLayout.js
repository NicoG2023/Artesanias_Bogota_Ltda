import "./BasicLayout.scss";
import { TopMenuUsuario, FooterUsuario } from "../../components";

export function BasicLayout({ children }) {
  return (
    <div className="basic-layout">
      <div className="basic-layout__topmenu">
        <TopMenuUsuario />
      </div>
      <div className="basic-layout__main-content">{children}</div>
      <div className="basic-layout__footer">
        <FooterUsuario />
      </div>
    </div>
  );
}

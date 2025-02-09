import "./Footer.scss";

export function Footer() {
  return (
    <footer className="footer">
      <p>Desarrollado con 💙 por el Equipo de Artesanías</p>
      <p className="copyright">© 2023 Todos los derechos reservados</p>
      <p className="contact">
        Contacto soporte:{" "}
        <a href="mailto:soporte@artesaniasbogota.com">
          soporte@artesaniasbogota.com
        </a>{" "}
        | Tel: +57 1 2345678
      </p>
    </footer>
  );
}

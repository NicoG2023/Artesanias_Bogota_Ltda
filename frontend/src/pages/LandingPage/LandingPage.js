import React, { useEffect } from "react";
import { Button, Icon, Grid, Card, Header, Container } from "semantic-ui-react";
import { MapaLanding, CartaProducto } from "../../components";
import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import artesaniaImg from "../../assets/artesanias-landing-page.png";
import { usePuntoVenta } from "../../hooks";
import { useProductos } from "../../hooks";
import "./LandingPage.scss";

export function LandingPage() {
  const navigate = useNavigate();
  const puntoVentaHook = usePuntoVenta();
  const { productos, loading, error } = useProductos();

  const handleExploraClick = () => {
    navigate("/productos");
  };

  const handleRegistroClick = () => {
    navigate("/registro");
  };

  const productTemplate = (producto) => <CartaProducto producto={producto} />;

  const categorias = [
    { id: 1, nombre: "Cerámica", icono: "gem" },
    { id: 2, nombre: "Textiles", icono: "bookmark" },
    { id: 3, nombre: "Madera", icono: "tree" },
    { id: 4, nombre: "Joyería", icono: "diamond" },
  ];

  const bestSellers = [
    {
      id: 101,
      nombre: "Jarrón Pintado a Mano",
      precio: 45.0,
      imagen: "",
    },
    {
      id: 102,
      nombre: "Bolso Tejido de Lana",
      precio: 60.0,
      imagen: "",
    },
    {
      id: 103,
      nombre: "Collar de Madera",
      precio: 25.5,
      imagen: "",
    },
  ];
  return (
    <div className="landing-page">
      {/* Sección Hero */}
      <div
        className="hero-section"
        style={{
          background: `url(${artesaniaImg}) center/cover no-repeat`,
        }}
      >
        <div className="hero-overlay"></div>
        <Container>
          <h1 className="hero-title">Encuentra la belleza de lo artesanal</h1>
          <p className="hero-subtitle">
            Apoya a nuestros artesanos y descubre piezas únicas con identidad.
          </p>
          <Button color="orange" size="large" onClick={handleExploraClick}>
            Explora nuestras artesanías
          </Button>
        </Container>
      </div>

      {/* Sección de categorías */}
      <Container className="categorias-section">
        <Header as="h2" textAlign="center" className="section-title">
          Explora nuestras categorías
        </Header>
        <Grid stackable columns={4} centered>
          {categorias.map((cat) => (
            <Grid.Column key={cat.id} textAlign="center">
              <div className="categoria-card">
                <Icon name={cat.icono} size="big" />
                <p>{cat.nombre}</p>
              </div>
            </Grid.Column>
          ))}
        </Grid>
      </Container>

      {/* Sección de best sellers */}
      <Container className="bestsellers-section">
        <Header as="h2" textAlign="center" className="section-title">
          Nuestros productos más vendidos
        </Header>
        {loading && <p>Cargando productos...</p>}
        {error && <p>Error al cargar productos</p>}
        {!loading && !error && (
          <Carousel
            value={productos}
            itemTemplate={productTemplate}
            numVisible={3}
            numScroll={1}
            responsiveOptions={[
              { breakpoint: "1024px", numVisible: 3, numScroll: 1 },
              { breakpoint: "768px", numVisible: 2, numScroll: 1 },
              { breakpoint: "560px", numVisible: 1, numScroll: 1 },
            ]}
            circular
            autoplayInterval={3000}
          />
        )}
      </Container>

      <Container className="mapa-section">
        <MapaLanding puntoVentaHook={puntoVentaHook} />
      </Container>

      {/* Sección CTA final */}
      <div className="cta-section">
        <Container textAlign="center">
          <Header as="h2" className="cta-title">
            ¿Listo para sumergirte en el mundo de la artesanía?
          </Header>
          <p className="cta-subtitle">
            Regístrate ahora y recibe ofertas exclusivas.
          </p>
          <Button
            color="yellow"
            size="large"
            className="cta-button"
            onClick={handleRegistroClick}
          >
            ¡Regístrate!
          </Button>
        </Container>
      </div>
    </div>
  );
}

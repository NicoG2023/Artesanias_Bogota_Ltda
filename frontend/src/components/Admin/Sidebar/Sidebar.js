import "./Sidebar.scss";
import { Link } from 'react-router-dom'

export function Sidebar(){
    return(
        <div className = "sideBar">
            <ul>
                <li>
                    <Link to="/admin">Inicio</Link>
                </li>    
                <li>
                    <Link to="/Analiticas">Analiticas</Link>
                </li>
                <li>
                    <Link to="/Inventario">Inventario</Link>
                </li>
                <li>
                    <Link to="/Ordenes">Ordenes</Link>
                </li>
                <li>
                    <Link to="/Usuarios">Usuarios</Link>
                </li>
            </ul>
        </div>
    );
}
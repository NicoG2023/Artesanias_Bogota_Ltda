import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {map} from "lodash";
import routes from "./routes";

export function Navigation(){
    return(
        <BrowserRouter>
            <Routes>
                {map(routes, (route, index)=> 
                <Route key={index} path={route.path} element={route.element}>
                    {route.children &&
                    route.children.map((child, childIndex)=>{
                        <Route
                            key = {childIndex}
                            path = {child.path}
                            element = {child.element}
                        />    
                    })}
                </Route>)}
            </Routes>
        </BrowserRouter>
    );
}

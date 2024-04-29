import React from "react"
import ReactDom, { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import Store from "./utils/store";

import WebsiteScraper from "./pages/user/Home";
import MusicPlayer from "./pages/user/Music";
import DownloadAudioPage from "./pages/user/AddMusic";






const AppLayout = () => {

    return (

        <>
            <Outlet/>
         
        </>
    )
}




const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <WebsiteScraper />
            },
            {
                path: "/music",
                element: <MusicPlayer />
            },
            {
                path: "/addMusic",
                element: <DownloadAudioPage />
            },
           
          


        ]
    },
  
  
   

])


const root = ReactDom.createRoot(document.getElementById('root'))

root.render(<RouterProvider router={appRouter} />) 
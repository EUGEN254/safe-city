import React from "react";

import { ToastContainer, toast } from "react-toastify";

const App = () => {
  <ToastContainer
    position="top-right"
    autoClose={3000}
    newestOnTop
    pauseOnHover
    closeOnClick
    draggable
    className="!z-[1000]"
    toastClassName="!min-h-12 !max-w-md !rounded-xl !shadow-lg"
    bodyClassName="!text-sm !p-3"
    progressClassName="!h-1"
    style={{ width: "auto", fontSize: "14px" }}
  />;
  return <div>App</div>;
};

export default App;

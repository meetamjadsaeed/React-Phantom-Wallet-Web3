import "../src/css/bootstrap.css";

import Context from "./components/Context";
import Content from "./components/Content";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

require("./App.css");
require("@solana/wallet-adapter-react-ui/styles.css");

function getWallet() {}

const App = () => {
  return (
    <>
      <ToastContainer />
      <Context>
        <Content />
      </Context>
    </>
  );
};

export default App;

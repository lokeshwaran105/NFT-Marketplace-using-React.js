import Footer from "../footer/Footer";
import Header from "../header/header";
import Routers from '../../routes/Router'


const Layout = () => {
  return (
    <div>
      <Header />
      <div>
        <Routers />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

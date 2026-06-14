import Header from "./Header";
import Footer from "./Footer";
import { CartProvider } from "../cart/CartProvider";
import { CartDrawer } from '../cart/CartDrawer';
import { CartToast } from '../cart/CartToast';
import TailoringDrawer from '../tailoring/TailoringDrawer';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col relative">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <TailoringDrawer />
        <CartToast />
      </div>
    </CartProvider>
  );
}

import Providers from "@/components/providers/Providers";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/layout/Preloader";
import Menu, { MenuProvider } from "@/components/layout/Menu";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Preloader />
      <Providers>
        <div className="grain min-h-svh">
          <CustomCursor />
          <MenuProvider>
            <Menu />
            {children}
          </MenuProvider>
        </div>
      </Providers>
    </>
  );
}

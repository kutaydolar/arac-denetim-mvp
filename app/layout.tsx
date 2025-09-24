import "./globals.css";

export const metadata = {
  title: "Araç Denetim",
  description: "Web App - Araç Denetim Formu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}

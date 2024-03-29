import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Nav from "@/components/Nav";
import { ThemeProvider } from "@/components/themeProvider";

// const inter = Inter({ subsets: ["latin"] });
export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Spotify to Youtube",
	description: "Transfer Spotify playlists to YouTube",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen font-sans antialiased",
					fontSans.variable
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Nav />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}

import "@/styles/globals.css";
import { StoreProvider } from "@/utils/Store";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {Component.auth ? (
          <Auth adminOnly={Component.auth.adminOnly}>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=Vous n'êtes pas connecté");
    },
  });
  if (status === "loading") {
    return <div>Chargement...</div>;
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push("/unauthorized?message=Vous n'êtes pas administrateur");
  }
  return children;
}

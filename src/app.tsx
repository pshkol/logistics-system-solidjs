import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import TopNav from "~/components/common/top-nav";
import "./app.css";
import { Toaster } from "solid-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

export default function App() {
  const client = new QueryClient();

  return (
    <Router
      root={(props) => (
        <QueryClientProvider client={client}>
          <Toaster />
          <TopNav />
          <Suspense>{props.children}</Suspense>
        </QueryClientProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

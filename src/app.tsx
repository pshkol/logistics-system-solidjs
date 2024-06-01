import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import TopNav from "~/components/common/top-nav";
import "./app.css";
import { Toaster } from "solid-toast";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <Toaster />
          <TopNav />
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

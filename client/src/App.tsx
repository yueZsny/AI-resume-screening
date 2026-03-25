import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import router from "./router";
import { ToastContainer } from "./components/Toast";
// import { PetDesktop } from "./components/pet";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      <Toaster
        position="top-center"
        richColors={false}
        expand
        closeButton={false}
        duration={3200}
        gap={10}
        icons={{
          success: (
            <CheckCircle2
              className="size-5 shrink-0 text-emerald-600"
              strokeWidth={2}
              aria-hidden
            />
          ),
          error: (
            <XCircle
              className="size-5 shrink-0 text-rose-600"
              strokeWidth={2}
              aria-hidden
            />
          ),
        }}
        toastOptions={{
          classNames: {
            toast:
              "group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.18)]",
            title: "text-sm font-semibold leading-snug",
            description: "text-xs font-normal leading-relaxed opacity-85",
            success:
              "!border-emerald-200/90 !bg-emerald-50 !text-emerald-950",
            error: "!border-rose-200/90 !bg-rose-50 !text-rose-950",
          },
        }}
      />
      {/* <PetDesktop /> */}
    </>
  );
}

export default App;

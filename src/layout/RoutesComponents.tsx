import { Route, Routes, useLocation } from "react-router-dom";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import LocationProvider from "./LocationProvider";
import { UserContextProvider } from "./UserContextProvider";
import DashboardLayout from "./DashboardLayout";
import ColumnToggleDemo from "../tables/ColumnToggleDemo";
import GraphicRecord from "../pages/GraphicRecord";
import BasicTestDefinitions from "../pages/BasicTestDefinitions";

const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const DashboardPage = React.lazy(() => import("../pages/DashboardPage"));
const RegisterPatients = React.lazy(() => import("../pages/RegisterPatients"));
const PatientsDetails = React.lazy(() => import("../pages/PatientsDetails"));
const BasicPatientDefinitions = React.lazy(
  () => import("../pages/BasicPatientDefinitions")
);

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center min-w-full">
    در حال دریافت اطلاعات...
  </div>
);

export default function RoutesWithAnimation() {
  const location = useLocation();
  const queryClient = new QueryClient();

  return (
    <LocationProvider>
      <AnimatePresence>
        <UserContextProvider>
          <QueryClientProvider client={queryClient}>
            <Routes location={location} key={location.key}>
              <Route
                index
                path="/"
                element={
                  <React.Suspense fallback={<Fallback />}>
                    <LoginPage />
                  </React.Suspense>
                }
              />

              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route
                  index
                  path="/dashboard"
                  element={
                    <React.Suspense fallback={<Fallback />}>
                      <DashboardPage />
                    </React.Suspense>
                  }
                />

                <Route
                  index
                  path="/dashboard/patients/batch-graphic-records/:uid"
                  element={
                    <React.Suspense fallback={<Fallback />}>
                      <GraphicRecord />
                    </React.Suspense>
                  }
                ></Route>

                <Route
                  index
                  path="/dashboard/patients-lists"
                  element={
                    <React.Suspense fallback={<Fallback />}>
                      <ColumnToggleDemo />
                    </React.Suspense>
                  }
                />

                <Route
                  index
                  path="/dashboard/patients-lists/:uid"
                  element={
                    <React.Suspense fallback={<Fallback />}>
                      <PatientsDetails />
                    </React.Suspense>
                  }
                />
                <Route
                  index
                  path="/dashboard/register-patient"
                  element={
                    <React.Suspense fallback={<Fallback />}>
                      <RegisterPatients />
                    </React.Suspense>
                  }
                />
              </Route>
              <Route element={<DashboardLayout />}>
                <Route
                  path="/dashboard/basic-patient-definitions"
                  index
                  element={
                    <React.Suspense fallback={<Fallback />}>
                      <BasicPatientDefinitions />
                    </React.Suspense>
                  }
                />

                <Route
                  path="/dashboard/basic-test-definitions"
                  index
                  element={
                    <React.Suspense fallback={<Fallback />}>
                      <BasicTestDefinitions />
                    </React.Suspense>
                  }
                />

                <Route
                  path="home"
                  element={
                    <React.Suspense fallback={<Fallback />}>
                      <div>Home Content for Basic Patient Definitions</div>
                    </React.Suspense>
                  }
                />
                <Route
                  path="link"
                  element={
                    <React.Suspense fallback={<Fallback />}>
                      <div>Link Content for Basic Patient Definitions</div>
                    </React.Suspense>
                  }
                />
              </Route>
            </Routes>
          </QueryClientProvider>
        </UserContextProvider>
      </AnimatePresence>
    </LocationProvider>
  );
}

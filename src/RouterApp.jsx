import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RtdtApp from "./rtdt/App";
import TrvApp from "./trv/App";
import LandingPage from "./LandingPage";

export default function RouterApp() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rtdt/*" element={<RtdtApp />} />
        <Route path="/trv/*" element={<TrvApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

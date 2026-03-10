import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RtdtApp from "./rtdt/App";

export default function RouterApp() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/rtdt" replace />} />
        <Route path="/rtdt/*" element={<RtdtApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

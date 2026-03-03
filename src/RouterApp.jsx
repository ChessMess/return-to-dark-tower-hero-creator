import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import V2App from "./v2/App";

export default function RouterApp() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<V2App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Suspense } from "react";
import LeadsClient from "./LeadsClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading leads...</div>}>
      <LeadsClient />
    </Suspense>
  );
}

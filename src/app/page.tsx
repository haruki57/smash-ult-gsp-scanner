export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import ClientTop from "./ClientTop";
import { fetchVipData } from "../utils/fetchVipData";

export default async function Page() {
  const { vipBorder, ranks } = await fetchVipData();

  return (
    <div>
      <ClientTop vipBorder={vipBorder} ranks={ranks} />
    </div>
  );
}

import ClientTop from "./ClientTop";

async function getVipData() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/kumamate",
    {
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    }
  );
  return response.json();
}

export default async function Page() {
  //const { vipBorder, ranks } = await getVipData();

  return (
    <div>
      {/* <ClientTop vipBorder={vipBorder} ranks={ranks} /> */}
      hoge
    </div>
  );
}

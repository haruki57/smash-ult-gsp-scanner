import ClientTop from "./ClientTop";

async function getVipData() {
  const response = await fetch("http://localhost:3000/api/kumamate", {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  });
  return response.json();
}

export default async function Page() {
  const { vipBorder, ranks } = await getVipData();

  return (
    <div>
      <ClientTop vipBorder={vipBorder} ranks={ranks} />
    </div>
  );
}

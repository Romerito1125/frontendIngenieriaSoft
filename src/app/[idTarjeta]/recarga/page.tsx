import RecargaPayU from "../../components/RecargaPayU";

export default async function RecargaPage({ params }: { params: { idTarjeta: string } }) {
  return <RecargaPayU idTarjeta={params.idTarjeta} />;
}

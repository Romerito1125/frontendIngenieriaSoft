import RecargaPayU from "../../components/RecargaPayU";

export default function RecargaPage({ params }: { params: { idTarjeta: string } }) {
  return <RecargaPayU idTarjeta={params.idTarjeta} />;
}

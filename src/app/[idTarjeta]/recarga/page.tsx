import RecargaPayU from "../../components/RecargaPayU";

interface PageProps {
  params: { idTarjeta: string };
}

export default function RecargaPage({ params }: PageProps) {
  // params.idTarjeta ya viene decodificado
  return <RecargaPayU idTarjeta={params.idTarjeta} />;
}

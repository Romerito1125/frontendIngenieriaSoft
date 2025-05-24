"use server"; // Opcional, para indicar que es un componente servidor (por defecto)

import RecargaPayU from "../../components/RecargaPayU";

type RecargaPageProps = {
  params: {
    idTarjeta: string;
  };
};

export default async function RecargaPage({ params }: RecargaPageProps) {
  // Aquí podrías agregar lógica async si la necesitas, p.ej. fetch de datos

  return <RecargaPayU idTarjeta={params.idTarjeta} />;
}

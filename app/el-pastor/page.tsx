import Image from "next/image";

export const metadata = {
  title: "Conozca a sus Pastores | La Biblia Nos Habla",
  description:
    "Conozca al Pastor Gilberto Maldonado y a la Hna. Yudelka Maldonado, su familia, llamado, servicio pastoral y obra misionera."
};

export default function NuestrosPastoresPage() {
  return (
    <section className="pastoresAprobados" aria-labelledby="pastores-title">
      <h1 id="pastores-title" className="srOnly">
        Pastor Gilberto Maldonado y Hna. Yudelka Maldonado
      </h1>

      <div className="pastoresAprobadosMarco">
        <Image
          src="/images/pastores/pastor-gilberto-y-hna-yudelka.webp"
          alt="Presentación del Pastor Gilberto Maldonado y la Hna. Yudelka Maldonado: matrimonio, llamado al ministerio, misiones, familia, servicio pastoral y predicación del Evangelio."
          width={1800}
          height={1200}
          priority
          sizes="100vw"
          className="pastoresAprobadosImagen"
        />
      </div>
    </section>
  );
}

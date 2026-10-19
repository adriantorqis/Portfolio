import type { Certificate } from "@/lib/types";

export function CertificateCard({ cert }: { cert: Certificate }) {
  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noreferrer"
      className="cert-card group flex h-full flex-col rounded-[1.25rem] border border-line bg-surface/50 p-6"
    >
      <div className="flex h-40 items-center justify-center">
        {cert.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote Credly badge art, fixed small size; no optimizer config needed
          <img
            src={cert.image}
            alt={cert.title ?? "Credly badge"}
            width={160}
            height={160}
            loading="lazy"
            draggable={false}
            className="h-36 w-36 object-contain drop-shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-105 group-hover:rotate-[-3deg] motion-reduce:transition-none"
          />
        ) : (
          <span className="eyebrow">Credly badge</span>
        )}
      </div>
      <p className="eyebrow mt-6">{cert.issuer ?? "Certification"}</p>
      <h3 className="display mt-2 text-lg leading-snug">{cert.title ?? "View credential"}</h3>
      <span className="link-underline mt-auto self-start pt-5 text-sm">
        View on Credly <span aria-hidden="true">&rarr;</span>
      </span>
    </a>
  );
}

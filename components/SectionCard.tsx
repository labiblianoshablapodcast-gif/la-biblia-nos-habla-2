import Link from "next/link";

export default function SectionCard({icon,title,description,href}:{icon:string;title:string;description:string;href:string}) {
  return <Link href={href} className="sectionCard"><span>{icon}</span><h3>{title}</h3><p>{description}</p></Link>;
}

import {youtube} from "@/data/youtube";

export default function Footer() {
  return (
    <footer>
      <div>
        <strong>La Biblia Nos Habla</strong>
        <p>Iglesia Príncipe de Paz · Philadelphia</p>
      </div>
      <div>
        <p>3661 N Marvine St.<br/>Philadelphia, PA</p>
      </div>
      <div>
        <p>Labiblianoshablapodcast@gmail.com</p>
        <p className="footerLinks">
          <a href={youtube.ministry.url} target="_blank" rel="noopener noreferrer">YouTube ministerial</a><br/>
          <a href={youtube.pastor.url} target="_blank" rel="noopener noreferrer">YouTube pastoral</a>
        </p>
      </div>
    </footer>
  );
}

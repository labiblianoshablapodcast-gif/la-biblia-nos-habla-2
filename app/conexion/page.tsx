import ConnectionForm from '@/components/ConnectionForm';

export default function Conexion(){
  return <>
    <section className="petitionApprovedHero">
      <div className="petitionApprovedPhoto" aria-label="Manos unidas en oración sobre una Santa Biblia al amanecer">
        <img src="/images/7F25B293-BDDC-497D-B359-CF3D7985B4FA.png" alt="Manos unidas en oración sobre una Santa Biblia al amanecer" />
        <div className="petitionApprovedShade" />
        <div className="petitionApprovedCopy">
          <h1>No tiene que <em>caminar solo.</em></h1>
          <blockquote>“La oración del justo<br/>puede mucho.”<cite>Santiago 5:16</cite></blockquote>
          <p>Cuéntenos cómo podemos ayudarle. Un miembro de nuestro equipo recibirá su solicitud y podrá darle seguimiento.</p>
        </div>
      </div>
    </section>

    <section className="petitionApprovedForm">
      <div className="petitionApprovedHeading">
        <span aria-hidden="true">♡</span>
        <div><h2>Envíe su petición</h2><p>Complete el formulario y permítanos orar y ayudarle en este tiempo.</p></div>
      </div>
      <ConnectionForm/>
      <div className="petitionApprovedPrivacy"><b>✓</b><div><strong>Privacidad</strong><p>Su información será tratada con respeto y solo será vista por personas autorizadas.</p></div></div>
    </section>

    <style>{`
      .petitionApprovedHero{background:#071c30;padding:0 18px;color:#fff}
      .petitionApprovedPhoto{position:relative;max-width:1120px;min-height:560px;margin:0 auto;overflow:hidden;border-radius:0 0 28px 28px;background:#071c30}
      .petitionApprovedPhoto>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block}
      .petitionApprovedShade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,20,34,.94) 0%,rgba(5,20,34,.70) 43%,rgba(5,20,34,.10) 76%),linear-gradient(0deg,rgba(5,20,34,.48),transparent 48%)}
      .petitionApprovedCopy{position:relative;z-index:2;width:min(570px,56%);padding:70px 54px}
      .petitionApprovedCopy h1{margin:0 0 26px;font:700 clamp(58px,6vw,82px)/.88 'Cormorant Garamond',serif;letter-spacing:-.03em;color:#fff}
      .petitionApprovedCopy h1 em{display:block;color:#e3ad34;font-style:normal}
      .petitionApprovedCopy blockquote{margin:0 0 22px;text-align:center;font:700 27px/1.12 'Cormorant Garamond',serif;color:#fff}
      .petitionApprovedCopy cite{display:block;margin-top:15px;font:500 15px/1.2 inherit;letter-spacing:.04em;font-style:normal}
      .petitionApprovedCopy p{margin:0;font-size:20px;line-height:1.55;color:rgba(255,255,255,.92)}
      .petitionApprovedForm{position:relative;z-index:3;width:min(900px,calc(100% - 36px));margin:-18px auto 80px;padding:28px;background:#fff;border:1px solid #e1e5e7;border-radius:24px;box-shadow:0 24px 60px rgba(7,24,41,.16)}
      .petitionApprovedHeading{display:flex;gap:18px;align-items:center;margin-bottom:10px}
      .petitionApprovedHeading>span{display:grid;place-items:center;flex:0 0 58px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#dba92e,#a66c05);color:#fff;font-size:31px}
      .petitionApprovedHeading h2{margin:0;font:700 40px/1 'Cormorant Garamond',serif;color:#102131}
      .petitionApprovedHeading p{margin:7px 0 0;color:#667681}
      .petitionApprovedForm .connectionIntro,.petitionApprovedForm .connectionFormHeading,.petitionApprovedForm .requestQuickChoices{display:none}
      .petitionApprovedForm .connectionFormModern{border:0;box-shadow:none}
      .petitionApprovedPrivacy{display:flex;gap:14px;margin-top:18px;padding:17px 20px;border-left:4px solid #d5a128;border-radius:12px;background:#fff6dc;color:#102131}
      .petitionApprovedPrivacy b{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#fff;color:#9a6a0c}
      .petitionApprovedPrivacy p{margin:4px 0 0;font-size:14px}
      @media(max-width:700px){
        .petitionApprovedHero{padding:0}
        .petitionApprovedPhoto{min-height:385px;border-radius:0}
        .petitionApprovedPhoto>img{object-position:54% center}
        .petitionApprovedShade{background:linear-gradient(90deg,rgba(5,20,34,.88) 0%,rgba(5,20,34,.52) 53%,rgba(5,20,34,.02) 100%),linear-gradient(0deg,rgba(5,20,34,.28),transparent 55%)}
        .petitionApprovedCopy{width:100%;padding:21px 32px 18px}
        .petitionApprovedCopy h1{max-width:360px;font-size:clamp(39px,10.6vw,50px);line-height:.91;margin-bottom:12px}
        .petitionApprovedCopy blockquote{width:250px;margin:0 0 12px 7px;font-size:18px;line-height:1.12;text-align:center;font-style:italic}
        .petitionApprovedCopy cite{font-size:12px;margin-top:10px;font-style:normal}
        .petitionApprovedCopy p{width:52%;min-width:255px;margin:0;font-size:14.5px;line-height:1.38}
        .petitionApprovedForm{width:calc(100% - 40px);margin:-22px auto 105px;padding:18px 18px 16px;border-radius:20px}
        .petitionApprovedHeading{padding:0 4px 9px;gap:13px}
        .petitionApprovedHeading>span{flex-basis:50px;width:50px;height:50px;font-size:26px}
        .petitionApprovedHeading h2{font-size:30px}
        .petitionApprovedHeading p{font-size:13px;line-height:1.3}
        .petitionApprovedForm .ministryFormModern{padding:9px 4px 4px}
        .petitionApprovedForm .connectionSubmitRow p{display:none}
        .petitionApprovedForm .connectionSubmitRow{display:block}
        .petitionApprovedForm .connectionSubmitRow .btn{width:100%;justify-content:center}
        .petitionApprovedPrivacy{margin:13px 4px 4px}
      }
    `}</style>
  </>;
}

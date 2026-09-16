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
        .petitionApprovedPhoto{min-height:350px;border-radius:0}
        .petitionApprovedPhoto>img{object-position:54% center}
        .petitionApprovedShade{background:linear-gradient(90deg,rgba(5,20,34,.88) 0%,rgba(5,20,34,.52) 53%,rgba(5,20,34,.02) 100%),linear-gradient(0deg,rgba(5,20,34,.28),transparent 55%)}
        .petitionApprovedCopy{width:100%;padding:17px 30px 14px}
        .petitionApprovedCopy h1{max-width:330px;font-size:clamp(36px,9.7vw,46px);line-height:.91;margin-bottom:9px}
        .petitionApprovedCopy blockquote{width:235px;margin:0 0 8px 6px;font-size:16.5px;line-height:1.1;text-align:center;font-style:italic}
        .petitionApprovedCopy cite{font-size:11px;margin-top:7px;font-style:normal}
        .petitionApprovedCopy p{width:51%;min-width:238px;margin:0;font-size:13.5px;line-height:1.34}
        .petitionApprovedForm{width:calc(100% - 40px);margin:-20px auto 105px;padding:15px 16px 14px;border-radius:20px}
        .petitionApprovedHeading{padding:0 3px 7px;gap:11px}
        .petitionApprovedHeading>span{flex-basis:46px;width:46px;height:46px;font-size:24px}
        .petitionApprovedHeading h2{font-size:28px}
        .petitionApprovedHeading p{font-size:12.5px;line-height:1.25;margin-top:4px}
        .petitionApprovedForm .ministryFormModern{padding:6px 3px 3px}
        .petitionApprovedForm .connectionFieldGrid{gap:10px}
        .petitionApprovedForm .connectionFieldGrid label{gap:5px}
        .petitionApprovedForm .connectionFieldGrid label>span{font-size:12px}
        .petitionApprovedForm .connectionFieldGrid input,.petitionApprovedForm .connectionFieldGrid select{min-height:44px;padding-top:9px;padding-bottom:9px}
        .petitionApprovedForm .connectionFieldGrid textarea{min-height:92px}
        .petitionApprovedForm .connectionSubmitRow p{display:none}
        .petitionApprovedForm .connectionSubmitRow{display:block}
        .petitionApprovedForm .connectionSubmitRow .btn{width:100%;justify-content:center}
        .petitionApprovedPrivacy{margin:11px 3px 3px;padding:14px 16px}
      }
    `}</style>
  </>;
}

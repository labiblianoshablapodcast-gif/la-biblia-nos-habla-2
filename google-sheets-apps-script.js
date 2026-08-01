/** Google Apps Script para guardar solicitudes en Google Sheets. */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Solicitudes');
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(),data.Nombre||'',data.Correo||'',data.Telefono||'',data.Solicitud||'',data.Mensaje||'']);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}

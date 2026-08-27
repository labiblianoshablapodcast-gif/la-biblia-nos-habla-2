import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {confirmationProblem,boundedEmailRequest,EmailRequestTimeout,resendFeedback} from '../lib/email-confirmation.ts';
const file=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('recognizes expired confirmation in fragment or query without echoing provider data',()=>{
 assert.equal(confirmationProblem('','#error=access_denied&error_code=otp_expired'),true);
 assert.equal(confirmationProblem('?error_code=otp_expired',''),true);
 assert.equal(confirmationProblem('','#error=access_denied&error_description=Email+link+is+invalid+or+has+expired'),true);
 for(const hash of ['','#galeria','#access_token=private&refresh_token=secret','#error=unrelated','#error_description=%3Cscript%3E'])assert.equal(confirmationProblem('',hash),false);
 assert.equal(confirmationProblem('?code=private',''),false);
});
test('resend wait resolves, rejects and times out without accepting late completion',async()=>{
 assert.equal(await boundedEmailRequest(Promise.resolve(5),20),5);
 const error=new Error('network');
 await assert.rejects(boundedEmailRequest(Promise.reject(error),20),error);
 let complete;
 const pending=new Promise(resolve=>{complete=resolve;});
 const bounded=boundedEmailRequest(pending,5);
 await assert.rejects(bounded,EmailRequestTimeout);complete('late');
 await assert.rejects(bounded,EmailRequestTimeout);
});
test('resend errors are actionable and do not expose account existence or provider details',()=>{
 assert.match(resendFeedback('over_email_send_rate_limit'),/límite/);
 assert.match(resendFeedback('email_address_not_authorized'),/ministerio/);
 assert.equal(resendFeedback('private provider detail'),resendFeedback());
});
test('resend is an explicit consented action, rate-limited locally and never creates an account',()=>{
 const help=file('components/KidsConfirmationHelp.tsx');
 assert.ok(help.includes('if(!adult||inFlight.current||Date.now()<retryAt.current'));
 assert.ok(help.includes('Date.now()+60000'));
 assert.ok(help.includes('auth.resend({type:"signup",email:email.trim()})'));
 assert.ok(help.includes('Si esa cuenta necesita confirmación'));
 assert.ok(!help.includes('auth.signUp'));assert.ok(!help.includes('console.'));assert.ok(!help.includes('localStorage'));
 const notice=file('components/EmailConfirmationNotice.tsx');
 assert.ok(notice.includes('href="/kids/padres#confirmacion"'));
 assert.ok(!notice.includes('dangerouslySetInnerHTML'));assert.ok(!notice.includes('auth.'));assert.ok(!notice.includes('fetch('));
 assert.ok(file('components/KidsParents.tsx').includes('!signedIn&&<KidsConfirmationHelp/>'));
 assert.ok(file('components/KidsParents.tsx').includes('await withTimeout(createClient().auth.getUser())'));
 assert.ok(file('app/layout.tsx').includes('<EmailConfirmationNotice/>'));
});

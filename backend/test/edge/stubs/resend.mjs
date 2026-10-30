// esm.sh resend yerine (yalnızca canlıdaki eski sürümün testi için): fetch'e yönlendirir.
export class Resend {
  constructor(key) { this.key = key; this.emails = { send: async (body) => (await fetch('https://api.resend.com/emails', { method: 'POST', body: JSON.stringify(body) })).json() }; }
}

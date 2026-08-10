import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase-config"
import { createDownloadToken } from "@/lib/data-request-token"

// Bump when the wording of the conditions on /stiahnut-data changes, so every
// stored request says which version of the text its author actually agreed to.
const CONSENT_VERSION = "2026-08-05"

const THROTTLE_MINUTES = 5

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

async function sendDownloadEmail(email: string, downloadUrl: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.DATA_REQUEST_FROM
  if (!apiKey || !from) return false

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Dáta o výskyte medveďa hnedého / Brown bear occurrence data",
      html: `
        <p>Dobrý deň,</p>
        <p>ďakujeme za záujem o dáta o výskyte medveďa hnedého. Súbor si stiahnete tu:</p>
        <p><a href="${downloadUrl}">${downloadUrl}</a></p>
        <p>Odkaz platí 7 dní. Dáta poskytli LESY Slovenskej republiky, š.p., a pri akomkoľvek použití ich uveďte ako zdroj.</p>
        <hr>
        <p>Hello,</p>
        <p>thank you for your interest in the brown bear occurrence data. Download the file here:</p>
        <p><a href="${downloadUrl}">${downloadUrl}</a></p>
        <p>The link is valid for 7 days. The data was provided by LESY Slovenskej republiky, š.p.; please credit them in any use.</p>
        <p>LCI &ndash; Large carnivores Initiative o.z.</p>
      `,
    }),
  })

  return response.ok
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Neplatná požiadavka." }, { status: 400 })
  }

  const { email, fullName, organization, purpose, consent } = body

  if (!isValidEmail(email) || !isFilled(fullName) || !isFilled(purpose)) {
    return NextResponse.json({ error: "Vyplňte meno, e-mail a účel použitia." }, { status: 400 })
  }
  if (consent !== true) {
    return NextResponse.json({ error: "Bez súhlasu s podmienkami dáta poskytnúť nemôžeme." }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "Evidencia žiadostí nie je dostupná. Skúste to neskôr." },
      { status: 503 },
    )
  }

  const throttleSince = new Date(Date.now() - THROTTLE_MINUTES * 60 * 1000).toISOString()
  const { data: recent } = await supabase
    .from("data_requests")
    .select("id")
    .eq("email", email)
    .gte("created_at", throttleSince)
    .limit(1)

  if (recent && recent.length > 0) {
    return NextResponse.json(
      { error: `Na túto adresu sme odkaz práve poslali. Skúste o ${THROTTLE_MINUTES} minút.` },
      { status: 429 },
    )
  }

  const { data: created, error: insertError } = await supabase
    .from("data_requests")
    .insert({
      email,
      full_name: fullName.trim(),
      organization: isFilled(organization) ? organization.trim() : null,
      purpose: purpose.trim(),
      consent: true,
      consent_version: CONSENT_VERSION,
      ip_address: request.headers.get("x-forwarded-for"),
      user_agent: request.headers.get("user-agent"),
    })
    .select("id")
    .single()

  if (insertError || !created) {
    console.error("Nepodarilo sa uložiť žiadosť o dáta:", insertError)
    return NextResponse.json({ error: "Žiadosť sa nepodarilo uložiť." }, { status: 500 })
  }

  const downloadUrl = `${request.nextUrl.origin}/api/data-request/download?token=${createDownloadToken(created.id)}`
  const sent = await sendDownloadEmail(email, downloadUrl)

  if (sent) {
    await supabase.from("data_requests").update({ sent_at: new Date().toISOString() }).eq("id", created.id)
  }

  return NextResponse.json({ sent }, { status: sent ? 200 : 202 })
}

import { NextResponse } from "next/server";
import { Resend } from "resend";

type EventStatusRequest = {
  email: string;
  customerName: string;
  eventDate: string;
  startTime: string;
  guests: number;
  eventType: string;
  status: "approved" | "declined";
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      return NextResponse.json(
        { error: "E-postinställningarna saknas." },
        { status: 500 },
      );
    }

    const body =
      (await request.json()) as EventStatusRequest;

    if (
      !body.email ||
      !body.customerName ||
      !body.eventDate ||
      !body.startTime ||
      !body.guests ||
      !body.eventType ||
      !body.status
    ) {
      return NextResponse.json(
        { error: "Eventuppgifter saknas." },
        { status: 400 },
      );
    }

    const resend = new Resend(apiKey);

    const approved =
      body.status === "approved";

    const subject = approved
      ? "Din eventförfrågan hos Daloona är godkänd"
      : "Angående din eventförfrågan hos Daloona";

    const title = approved
      ? "Eventet är godkänt"
      : "Förfrågan kunde inte godkännas";

    const mainMessage = approved
      ? `
        Din förfrågan är godkänd. Vi ser fram emot att välkomna er till Daloona.
      `
      : `
        Tack för din förfrågan. Tyvärr har vi inte möjlighet att godkänna eventet enligt de önskemål som skickades in.
      `;

    const extraMessage = approved
      ? `
        Om ni behöver ändra något kring antal gäster, tid eller upplägg ber vi er kontakta restaurangen i god tid.
      `
      : `
        Ni är varmt välkomna att kontakta Daloona om ni vill diskutera ett annat datum eller upplägg.
      `;

    const { data, error } =
      await resend.emails.send({
        from: fromEmail,
        to: body.email,
        subject,
        html: `
          <!doctype html>
          <html lang="sv">
            <body style="margin:0;background:#171512;font-family:Arial,sans-serif;">
              <div style="padding:40px 16px;">
                <div style="max-width:600px;margin:auto;background:#F3EEE3;color:#191815;border:1px solid #D8CDBD;">

                  <div style="background:#191815;padding:34px;text-align:center;">
                    <p style="margin:0;color:#B08A52;font-size:12px;font-weight:bold;letter-spacing:4px;">
                      DALOONA
                    </p>

                    <h1 style="margin:16px 0 0;color:white;font-family:Georgia,serif;font-size:36px;font-weight:normal;">
                      ${escapeHtml(title)}
                    </h1>
                  </div>

                  <div style="padding:36px;">
                    <p style="font-size:18px;line-height:1.7;">
                      Hej ${escapeHtml(body.customerName)},
                    </p>

                    <p style="color:#676158;font-size:16px;line-height:1.7;">
                      ${mainMessage}
                    </p>

                    <div style="margin:28px 0;border-top:1px solid #D8CDBD;border-bottom:1px solid #D8CDBD;padding:20px 0;">
                      ${detailRow("Typ av event", body.eventType)}
                      ${detailRow("Datum", body.eventDate)}
                      ${detailRow("Starttid", body.startTime.slice(0, 5))}
                      ${detailRow("Antal gäster", String(body.guests))}
                    </div>

                    <div style="margin-top:24px;padding:20px;background:#E8DFD0;border-left:4px solid #B08A52;">
                      <p style="margin:0;color:#676158;font-size:14px;line-height:1.7;">
                        ${extraMessage}
                      </p>
                    </div>

                    <p style="margin:24px 0 0;color:#676158;font-size:14px;line-height:1.7;">
                      Med vänliga hälsningar,<br />
                      Daloona
                    </p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      });

    if (error) {
      console.error("Resend-fel:", error);

      return NextResponse.json(
        { error: "Mejlet kunde inte skickas." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
    });
  } catch (error) {
    console.error("Eventmejl-fel:", error);

    return NextResponse.json(
      { error: "Ett oväntat fel uppstod." },
      { status: 500 },
    );
  }
}

function detailRow(
  label: string,
  value: string,
) {
  return `
    <div style="display:flex;justify-content:space-between;gap:20px;padding:8px 0;">
      <span style="color:#676158;">${escapeHtml(label)}</span>
      <strong style="text-align:right;">${escapeHtml(value)}</strong>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
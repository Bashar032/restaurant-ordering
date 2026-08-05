import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { Resend } from "resend";

type ConfirmationRequest = {
  email: string;
  customerName: string;
  bookingReference: string;
  tableNumber: string;
  guests: number;
  bookingDate: string;
  bookingTime: string;
  areaName: string;
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

    const body = (await request.json()) as ConfirmationRequest;

    if (
      !body.email ||
      !body.customerName ||
      !body.bookingReference ||
      !body.tableNumber ||
      !body.bookingDate ||
      !body.bookingTime ||
      !body.areaName ||
      !Number.isInteger(body.guests) ||
      body.guests < 1
    ) {
      return NextResponse.json(
        { error: "Bokningsuppgifter saknas eller är ogiltiga." },
        { status: 400 },
      );
    }

    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "daloona-logo.png",
    );

    if (!fs.existsSync(logoPath)) {
      console.error("Daloona-loggan saknas:", logoPath);

      return NextResponse.json(
        { error: "Daloona-loggan kunde inte hittas." },
        { status: 500 },
      );
    }

    const logoContent = fs.readFileSync(logoPath).toString("base64");

    const resend = new Resend(apiKey);

    const tableName =
      body.tableNumber.trim().toUpperCase() === "LOUNGE"
        ? "Lounge"
        : `Bord ${body.tableNumber.trim()}`;

    const bookingNumber = body.bookingReference
      .slice(0, 8)
      .toUpperCase();

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: body.email.trim().toLowerCase(),
      subject: "Din bokning hos Daloona är bekräftad",
      html: `
        <!doctype html>
        <html lang="sv">
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>Din bokning hos Daloona är bekräftad</title>
          </head>

          <body
            style="
              margin:0;
              padding:0;
              background:#171512;
              font-family:Arial,Helvetica,sans-serif;
              color:#191815;
            "
          >
            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="background:#171512;"
            >
              <tr>
                <td align="center" style="padding:40px 16px;">
                  <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                      max-width:600px;
                      background:#F3EEE3;
                      border:1px solid #D8CDBD;
                    "
                  >
                    <tr>
                      <td
                        align="center"
                        style="
                          background:#191815;
                          padding:34px 24px;
                        "
                      >
                        <img
                          src="cid:daloona-logo"
                          alt="Daloona"
                          width="150"
                          style="
                            display:block;
                            width:150px;
                            max-width:100%;
                            height:auto;
                            margin:0 auto 22px;
                          "
                        />

                        <h1
                          style="
                            margin:0;
                            color:#ffffff;
                            font-family:Georgia,'Times New Roman',serif;
                            font-size:36px;
                            line-height:1.2;
                            font-weight:400;
                          "
                        >
                          Bokningen är bekräftad
                        </h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:36px 30px;">
                        <p
                          style="
                            margin:0;
                            font-size:18px;
                            line-height:1.7;
                            color:#191815;
                          "
                        >
                          Hej ${escapeHtml(body.customerName)},
                        </p>

                        <p
                          style="
                            margin:16px 0 0;
                            color:#676158;
                            font-size:16px;
                            line-height:1.7;
                          "
                        >
                          Tack för din bokning. Vi ser fram emot att
                          välkomna dig till Daloona.
                        </p>

                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="
                            margin:28px 0;
                            border-top:1px solid #D8CDBD;
                            border-bottom:1px solid #D8CDBD;
                          "
                        >
                          ${detailRow("Datum", body.bookingDate)}
                          ${detailRow("Tid", body.bookingTime)}
                          ${detailRow("Avdelning", body.areaName)}
                          ${detailRow("Bord", tableName)}
                          ${detailRow(
                            "Antal gäster",
                            String(body.guests),
                          )}
                          ${detailRow(
                            "Bokningsnummer",
                            bookingNumber,
                          )}
                        </table>

                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="
                            margin-top:28px;
                            background:#E8DFD0;
                            border-left:4px solid #B08A52;
                          "
                        >
                          <tr>
                            <td style="padding:20px;">
                              <p
                                style="
                                  margin:0;
                                  font-size:14px;
                                  font-weight:700;
                                  color:#191815;
                                "
                              >
                                Viktig information om sen ankomst
                              </p>

                              <p
                                style="
                                  margin:10px 0 0;
                                  color:#676158;
                                  font-size:14px;
                                  line-height:1.7;
                                "
                              >
                                Bordet hålls i 15 minuter efter bokad tid.
                                Om ni blir mer än 15 minuter sena kan
                                bokningen avbokas av restaurangen.
                                Kontakta därför Daloona i förväg om ni vet
                                att ni blir sena.
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p
                          style="
                            margin:24px 0 0;
                            color:#676158;
                            font-size:14px;
                            line-height:1.7;
                          "
                        >
                          Behöver du ändra eller avboka bokningen kan du
                          kontakta restaurangen och ange ditt
                          bokningsnummer.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      attachments: [
        {
          content: logoContent,
          filename: "daloona-logo.png",
          contentId: "daloona-logo",
        },
      ],
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
    console.error("E-postfel:", error);

    return NextResponse.json(
      { error: "Ett oväntat fel uppstod när mejlet skulle skickas." },
      { status: 500 },
    );
  }
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td
        style="
          padding:10px 0;
          color:#676158;
          font-size:14px;
          line-height:1.5;
        "
      >
        ${escapeHtml(label)}
      </td>

      <td
        align="right"
        style="
          padding:10px 0;
          color:#191815;
          font-size:14px;
          line-height:1.5;
          font-weight:700;
        "
      >
        ${escapeHtml(value)}
      </td>
    </tr>
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
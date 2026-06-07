export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  try {
    const { email, recaptchaToken } = JSON.parse(event.body);

    // Verificar reCAPTCHA v3
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`,
      { method: 'POST' }
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.success || verifyData.score < 0.5) {
      return { statusCode: 400, body: JSON.stringify({ error: 'reCAPTCHA inválido', debug: verifyData }) };
    }

    const apiKeyBrevo = process.env.APIBREVO;

    const datosBrevo = {
      email,
      listIds: 5,
      updateEnabled: true
    };

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKeyBrevo
      },
      body: JSON.stringify(datosBrevo)
    });

    return {
      statusCode: res.status,
      body: JSON.stringify({ success: res.ok })
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}

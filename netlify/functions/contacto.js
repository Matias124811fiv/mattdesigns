export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  try {
    const { recaptchaToken, ...formData } = JSON.parse(event.body);

    // Verificar reCAPTCHA v3
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`,
      { method: 'POST' }
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.success || verifyData.score < 0.5) {
      return { statusCode: 400, body: JSON.stringify({ error: 'reCAPTCHA inválido' }) };
    }

    // Reenviar a Formspree
    const formspreeRes = await fetch('https://formspree.io/f/xgoqbnjw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    return {
      statusCode: formspreeRes.status,
      body: JSON.stringify({ success: formspreeRes.ok })
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}

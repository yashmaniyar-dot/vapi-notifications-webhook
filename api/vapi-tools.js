export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  const payload = req.body;
  const toolCalls = payload?.message?.toolCallList ?? [];

  const results = toolCalls.map((tc) => {
    const toolCallId = tc.id;
    const name = tc?.function?.name;

    // Vapi args can be object or JSON string
    let argsRaw = tc?.function?.arguments ?? {};
    let args = argsRaw;
    if (typeof argsRaw === "string") {
      try {
        args = JSON.parse(argsRaw);
      } catch {
        args = { _raw: argsRaw };
      }
    }

    if (name === "send_payment_reminder") {
      // Stub for now: we’ll wire real SMS + email next
      return {
        toolCallId,
        result: { ok: true, received: args }
      };
    }

    return {
      toolCallId,
      result: { ok: false, error: `Unknown tool: ${name}` }
    };
  });

  return res.status(200).json({ results });
}

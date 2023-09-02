require("dotenv").config();

export function trataErr(err: any, res: any) {
  if (process.env.NODE_ENV === "test") {
    console.log(err);
  }
  if (err.code === "ER_DUP_ENTRY") {
    res.status(500).json({ existe: true });
  } else if (err?.name === "TokenExpiredError") {
    res.status(401).json();
  } else if (err?.name === "JsonWebTokenError") {
    res.status(401).json();
  } else if (err?.message === "No Local") {
    res.status(400).json({ badLocal: true });
  } else {
    res.status(500).json();
  }
}

export function requisicaoRuim(condicao: boolean, res: any) {
  if (condicao) {
    res.status(400).json();
    return true;
  }
  return false;
}

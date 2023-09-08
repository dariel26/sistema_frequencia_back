export function userError(err: any, res: any) {
  if (process.env.NODE_ENV === "test") {
    console.log(err);
  }
  if (err.code === "ER_DUP_ENTRY") {
    res.status(500).json({ message: "Os dados fornecidos já existem nos registros ou estão duplicados." });
  } else if (err?.name === "TokenExpiredError") {
    res.status(401).json({message: "Sua sessão expirou, faça login novamente."});
  } else if (err?.name === "JsonWebTokenError") {
    res.status(401).json({message: "Algo deu errado ao criar sua sessão, tente novamente."});
  } else if (err?.message === "No Local") {
    res.status(400).json({ badLocal: true });
  } else if (err?.message === "NO ADMINS") {
    res.status(400).json({message: "A operação não pode ser realizada pois o sistema ficaria sem ADMINS"});
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

'use client';

import { Button } from "../components/common";



export default function Error({ reset }: { reset: () => void }) {
  return (
    <div>
      <h2>Erro ao buscar informações no servidor</h2>
      <Button title="Tentar novamente" color="error" onClick={() => reset()} />
    </div>
  );
}

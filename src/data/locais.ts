import type { Local } from '@/types/alerta';

export const LOCAIS: Local[] = [
  { id: 'santana', nome: 'Santana', lat: -23.502, lng: -46.625 },
  { id: 'fiap-paulista', nome: 'FIAP Paulista', lat: -23.5641, lng: -46.6524 },
  { id: 'se', nome: 'Sé', lat: -23.5503, lng: -46.6339 },
  { id: 'tatuape', nome: 'Tatuapé', lat: -23.54, lng: -46.576 },
  { id: 'paulista', nome: 'Av. Paulista (MASP)', lat: -23.5614, lng: -46.6559 },
  { id: 'pinheiros', nome: 'Pinheiros', lat: -23.567, lng: -46.693 },
  { id: 'ipiranga', nome: 'Ipiranga', lat: -23.586, lng: -46.61 },
  { id: 'vila-formosa', nome: 'Vila Formosa', lat: -23.56, lng: -46.515 },
  { id: 'lapa', nome: 'Lapa', lat: -23.52, lng: -46.7 },
  { id: 'vila-mariana', nome: 'Vila Mariana', lat: -23.589, lng: -46.634 },
];

export function localPorId(id: string): Local | undefined {
  return LOCAIS.find((l) => l.id === id);
}

import 'leaflet/dist/leaflet.css';

import { router } from 'expo-router';
import type * as Leaflet from 'leaflet';
import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Fonts, Radius, StatusColors } from '@/constants/theme';
import { localPorId } from '@/data/locais';
import { PONTO_IOT, pontosSimulados } from '@/data/pontos';
import type { PontoMonitorado, Rota } from '@/types/alerta';
import { ROTULO_STATUS, SIMBOLO_STATUS } from '@/utils/format';

type Props = {
  pontos: PontoMonitorado[];
  rotas: Rota[];
};

type MapaPronto = {
  L: typeof Leaflet;
  mapa: Leaflet.Map;
};

const CENTRO_SAO_PAULO: Leaflet.LatLngTuple = [-23.555, -46.62];
const ZOOM_INICIAL = 11;

const COR_ROTA = '#0B4F8A';

const COORDENADAS_PONTOS: Leaflet.LatLngTuple[] = [PONTO_IOT, ...pontosSimulados()].map((p) => [
  p.lat,
  p.lng,
]);

function criarIcone(L: typeof Leaflet, ponto: PontoMonitorado) {
  const status = ponto.leituraAtual?.status;
  const cores = status
    ? StatusColors[status]
    : { background: '#60646C', text: '#ffffff' };
  const tamanho = ponto.fonte === 'SENSOR_IOT' ? 34 : 26;
  const borda = ponto.fonte === 'SENSOR_IOT' ? '3px solid #0C2C4A' : '2px solid #ffffff';

  return L.divIcon({
    className: '',
    iconSize: [tamanho, tamanho],
    iconAnchor: [tamanho / 2, tamanho / 2],
    html: `<div style="box-sizing:border-box;width:${tamanho}px;height:${tamanho}px;display:flex;align-items:center;justify-content:center;border-radius:${Radius.small}px;border:${borda};background:${cores.background};color:${cores.text};font:700 15px sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.45)">${status ? SIMBOLO_STATUS[status] : '?'}</div>`,
  });
}

function marcarExtremo(
  L: typeof Leaflet,
  camada: Leaflet.LayerGroup,
  local: { nome: string; lat: number; lng: number },
  tipo: 'origem' | 'destino',
  lado: 'left' | 'right'
) {
  const fundo = tipo === 'origem' ? '#ffffff' : COR_ROTA;
  const borda = tipo === 'origem' ? COR_ROTA : '#ffffff';

  L.marker([local.lat, local.lng], {
    icon: L.divIcon({
      className: '',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      html: `<div style="box-sizing:border-box;width:16px;height:16px;border-radius:50%;border:3px solid ${borda};background:${fundo};box-shadow:0 0 0 1px ${COR_ROTA}"></div>`,
    }),
    interactive: false,
    keyboard: false,
    zIndexOffset: -500,
  })
    .bindTooltip(`<span style="font-family:${Fonts.semibold}">${local.nome}</span>`, {
      permanent: true,
      direction: lado,
      offset: [lado === 'left' ? -8 : 8, 0],
      className: 'rotulo-rota',
      pane: 'overlayPane',
    })
    .addTo(camada);
}

export function SensorMap({ pontos, rotas }: Props) {
  const container = useRef<ComponentRef<typeof View>>(null);
  const [pronto, setPronto] = useState<MapaPronto | null>(null);

  useEffect(() => {
    let ativo = true;
    let mapa: Leaflet.Map | undefined;

    import('leaflet').then((modulo) => {
      const elemento = container.current as unknown as HTMLElement | null;
      if (!ativo || !elemento) return;

      const L = (modulo.default ?? modulo) as typeof Leaflet;
      mapa = L.map(elemento, { scrollWheelZoom: false, zoomSnap: 0.5 }).setView(
        CENTRO_SAO_PAULO,
        ZOOM_INICIAL
      );
      mapa.attributionControl.setPrefix(false);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa);
      setPronto({ L, mapa });
    });

    return () => {
      ativo = false;
      mapa?.remove();
    };
  }, []);

  useEffect(() => {
    if (!pronto) return;
    const { L, mapa } = pronto;
    const camada = L.layerGroup().addTo(mapa);

    for (const rota of rotas) {
      const origem = localPorId(rota.origemId);
      const destino = localPorId(rota.destinoId);
      if (!origem || !destino) continue;
      const trajeto: Leaflet.LatLngTuple[] = [
        [origem.lat, origem.lng],
        [destino.lat, destino.lng],
      ];
      L.polyline(trajeto, { color: '#ffffff', weight: 8, opacity: 0.9, interactive: false }).addTo(camada);
      L.polyline(trajeto, { color: COR_ROTA, weight: 4, dashArray: '12 8', interactive: false }).addTo(camada);
      const origemAOeste = origem.lng < destino.lng;
      marcarExtremo(L, camada, origem, 'origem', origemAOeste ? 'left' : 'right');
      marcarExtremo(L, camada, destino, 'destino', origemAOeste ? 'right' : 'left');
    }

    for (const ponto of pontos) {
      const leitura = ponto.leituraAtual;
      const resumo = leitura
        ? `${ponto.nome}: ${ROTULO_STATUS[leitura.status]}, ${leitura.nivelCm} cm`
        : `${ponto.nome}: sem dados`;

      L.marker([ponto.lat, ponto.lng], {
        icon: criarIcone(L, ponto),
        title: resumo,
        alt: resumo,
        zIndexOffset: ponto.fonte === 'SENSOR_IOT' ? 1000 : 0,
      })
        .on('click', () =>
          router.push({ pathname: '/sensor/[id]', params: { id: ponto.id } })
        )
        .addTo(camada);
    }

    return () => {
      camada.remove();
    };
  }, [pronto, pontos, rotas]);

  useEffect(() => {
    if (!pronto) return;
    const { L, mapa } = pronto;
    const limites = L.latLngBounds(COORDENADAS_PONTOS);

    for (const rota of rotas) {
      for (const local of [localPorId(rota.origemId), localPorId(rota.destinoId)]) {
        if (local) limites.extend([local.lat, local.lng]);
      }
    }
    mapa.fitBounds(limites, {
      paddingTopLeft: [28, 48],
      paddingBottomRight: [28, 28],
      animate: false,
    });
  }, [pronto, rotas]);

  return (
    <View
      ref={container}
      style={styles.mapa}
      accessibilityLabel="Mapa com os pontos monitorados. A mesma informação está na lista abaixo."
    />
  );
}

const styles = StyleSheet.create({
  mapa: {
    width: '100%',
    height: 320,
    zIndex: 0,
  },
});

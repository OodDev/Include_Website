"use client";

import { useCallback, useRef, useState } from "react";
import type { Box, Device } from "@/lib/model";
import type { Capture, Hotspot, PageInfo } from "@/lib/pages";
import { liveUrl } from "@/lib/pages";
import { IconCrop, IconExternal, IconMonitor, IconPhone, IconX } from "./Icons";

interface CaptureViewerProps {
  page: PageInfo;
  device: Device;
  onDevice: (device: Device) => void;
  capture: Capture | null;
  selectedHotspotId: string;
  box: Box | null;
  onHotspot: (hotspot: Hotspot) => void;
  onBox: (box: Box) => void;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function CaptureViewer({
  page,
  device,
  onDevice,
  capture,
  selectedHotspotId,
  box,
  onHotspot,
  onBox,
}: CaptureViewerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [selecting, setSelecting] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [drag, setDrag] = useState<Box | null>(null);

  const relative = useCallback((event: React.PointerEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clamp((event.clientX - rect.left) / rect.width),
      y: clamp((event.clientY - rect.top) / rect.height),
    };
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!selecting) return;
    const point = relative(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setStart(point);
    setDrag({ x: point.x, y: point.y, w: 0, h: 0 });
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!selecting || !start) return;
    const point = relative(event);
    if (!point) return;
    setDrag({
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      w: Math.abs(point.x - start.x),
      h: Math.abs(point.y - start.y),
    });
  };

  const onPointerUp = () => {
    if (!selecting) return;
    if (drag && drag.w > 0.015 && drag.h > 0.008) {
      onBox(drag);
      setSelecting(false);
    }
    setStart(null);
    setDrag(null);
  };

  const toggleSelecting = () => {
    setSelecting((value) => !value);
    setStart(null);
    setDrag(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-pill bg-mist p-0.5" role="group" aria-label="Vista">
            <button
              type="button"
              onClick={() => onDevice("desktop")}
              aria-pressed={device === "desktop"}
              className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11px] font-semibold transition ${
                device === "desktop" ? "bg-white text-slate shadow-sm" : "text-slate/80"
              }`}
            >
              <IconMonitor className="h-3.5 w-3.5" />
              Computer
            </button>
            <button
              type="button"
              onClick={() => onDevice("mobile")}
              aria-pressed={device === "mobile"}
              className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11px] font-semibold transition ${
                device === "mobile" ? "bg-white text-slate shadow-sm" : "text-slate/80"
              }`}
            >
              <IconPhone className="h-3.5 w-3.5" />
              Telefono
            </button>
          </div>
          <a
            href={liveUrl(page.path)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-petrol-deep underline decoration-petrol/40 underline-offset-2 hover:decoration-petrol"
          >
            Apri la pagina live
            <IconExternal className="h-3 w-3" />
          </a>
        </div>

        {capture ? (
          <button
            type="button"
            onClick={toggleSelecting}
            aria-pressed={selecting}
            className={`btn btn-quiet gap-1.5 px-2 py-1 text-[11px] font-semibold ${
              selecting ? "bg-rust/10 text-rust" : "text-slate/80"
            }`}
          >
            <IconCrop className="h-3.5 w-3.5" />
            {selecting ? "Annulla selezione" : "Seleziona un’area"}
          </button>
        ) : null}
      </div>

      {!capture ? (
        <div className="rounded-card border border-dashed border-slate/25 bg-paper/70 p-6 text-center">
          <p className="text-sm font-semibold">Anteprima non ancora disponibile</p>
          <p className="mx-auto mt-1 max-w-sm text-[0.8125rem] leading-relaxed text-slate/80">
            Aprite la pagina live e scrivete qui sotto il nome della sezione che volete indicare.
          </p>
        </div>
      ) : (
        <>
          <div className="max-h-[540px] overflow-auto overscroll-contain rounded-card border border-mist bg-[#eef1f3] p-2">
            <div
              className={`relative mx-auto ${device === "mobile" ? "w-[min(380px,100%)]" : "w-full"}`}
            >
              <div ref={frameRef} className="relative select-none">
                {/* eslint-disable-next-line @next/next/no-img-element -- static capture, fixed dimensions */}
                <img
                  src={capture.file}
                  alt={`Anteprima di ${page.label}`}
                  draggable={false}
                  className="block h-auto w-full rounded-[10px] bg-white"
                />

                {!selecting &&
                  capture.hotspots.map((hotspot) => (
                    <button
                      key={hotspot.id}
                      type="button"
                      className="hotspot"
                      aria-pressed={selectedHotspotId === hotspot.id}
                      aria-label={`Sezione: ${hotspot.label}`}
                      onClick={() => onHotspot(hotspot)}
                      style={{
                        left: `${hotspot.rect.x * 100}%`,
                        top: `${hotspot.rect.y * 100}%`,
                        width: `${hotspot.rect.w * 100}%`,
                        height: `${hotspot.rect.h * 100}%`,
                      }}
                    >
                      <span className="hotspot-tag">{hotspot.label}</span>
                    </button>
                  ))}

                {box && !selecting ? (
                  <div
                    className="pointer-events-none absolute rounded-[10px] border-2 border-rust bg-rust/10"
                    style={{
                      left: `${box.x * 100}%`,
                      top: `${box.y * 100}%`,
                      width: `${box.w * 100}%`,
                      height: `${box.h * 100}%`,
                    }}
                  />
                ) : null}

                {selecting ? (
                  <div
                    className="absolute inset-0 cursor-crosshair touch-none"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    role="presentation"
                  >
                    <div className="pointer-events-none sticky top-2 mx-auto w-fit rounded-pill bg-slate/85 px-3 py-1 text-[11px] font-semibold text-white">
                      Trascinate un rettangolo sull’anteprima
                    </div>
                  </div>
                ) : null}

                {drag ? (
                  <div
                    className="pointer-events-none absolute rounded-[6px] border-2 border-dashed border-rust bg-rust/10"
                    style={{
                      left: `${drag.x * 100}%`,
                      top: `${drag.y * 100}%`,
                      width: `${drag.w * 100}%`,
                      height: `${drag.h * 100}%`,
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>

          {capture.hotspots.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {capture.hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => onHotspot(hotspot)}
                  aria-pressed={selectedHotspotId === hotspot.id}
                  className={`max-w-full truncate rounded-pill border px-2.5 py-1 text-[11px] font-semibold transition ${
                    selectedHotspotId === hotspot.id
                      ? "border-petrol-deep bg-petrol-deep text-white"
                      : "border-slate/15 bg-white text-slate/80 hover:border-petrol-deep hover:text-petrol-deep"
                  }`}
                  title={hotspot.label}
                >
                  {hotspot.label}
                </button>
              ))}
              {box && !selectedHotspotId ? (
                <span className="inline-flex items-center gap-1 rounded-pill bg-rust/10 px-2.5 py-1 text-[11px] font-semibold text-rust">
                  Area selezionata
                  <IconX className="h-3 w-3" />
                </span>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

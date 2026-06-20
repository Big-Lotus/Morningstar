"use client";

import Spline from "@splinetool/react-spline";
import type { Application, SplineEvent } from "@splinetool/runtime";
import { useCallback, useEffect, useRef, useState } from "react";

type SplineRuntimeStageProps = {
  className?: string;
};

declare global {
  interface Window {
    __morningstarSplineDebug?: {
      app: Application;
      objects: Array<{ name: string; uuid: string }>;
      events: ReturnType<Application["getSplineEvents"]> | null;
      eventsError?: string;
      forwardedPointerEvents: number;
      lastEvent?: SplineEvent;
    };
  }
}

const sceneUrl = "/api/spline/scene.splinecode";
const fallbackSplineUrl = "/api/spline";
const sceneZoom = 0.72;

export function SplineRuntimeStage({ className = "" }: SplineRuntimeStageProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const splineAppRef = useRef<Application | null>(null);
  const forwardedPointerEventsRef = useRef(0);
  const pendingPointerEventRef = useRef<PointerEvent | MouseEvent | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback((app: Application) => {
    splineAppRef.current = app;
    app.setGlobalEvents(true);
    app.setZoom(sceneZoom);

    let events: ReturnType<Application["getSplineEvents"]> | null = null;
    let eventsError: string | undefined;

    try {
      events = app.getSplineEvents();
    } catch (error) {
      eventsError =
        error instanceof Error ? error.message : "Unable to read Spline events.";
    }

    window.__morningstarSplineDebug = {
      app,
      objects: app.getAllObjects().map((object) => ({
        name: object.name,
        uuid: object.uuid
      })),
      events,
      eventsError,
      forwardedPointerEvents: forwardedPointerEventsRef.current
    };

    setIsLoaded(true);
  }, []);

  const handleSplineEvent = useCallback((event: SplineEvent) => {
    window.__morningstarSplineDebug = window.__morningstarSplineDebug
      ? {
          ...window.__morningstarSplineDebug,
          lastEvent: event
        }
      : undefined;
  }, []);

  useEffect(() => {
    const forwardPointerToCanvas = () => {
      pointerFrameRef.current = null;

      const sourceEvent = pendingPointerEventRef.current;
      const canvas = stageRef.current?.querySelector("canvas");

      if (!sourceEvent || !canvas || sourceEvent.target === canvas) {
        return;
      }

      canvas.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          cancelable: true,
          pointerId: "pointerId" in sourceEvent ? sourceEvent.pointerId : 1,
          pointerType:
            "pointerType" in sourceEvent ? sourceEvent.pointerType : "mouse",
          clientX: sourceEvent.clientX,
          clientY: sourceEvent.clientY,
          screenX: sourceEvent.screenX,
          screenY: sourceEvent.screenY,
          movementX: "movementX" in sourceEvent ? sourceEvent.movementX : 0,
          movementY: "movementY" in sourceEvent ? sourceEvent.movementY : 0,
          buttons: sourceEvent.buttons,
          ctrlKey: sourceEvent.ctrlKey,
          shiftKey: sourceEvent.shiftKey,
          altKey: sourceEvent.altKey,
          metaKey: sourceEvent.metaKey
        })
      );

      canvas.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          cancelable: true,
          clientX: sourceEvent.clientX,
          clientY: sourceEvent.clientY,
          screenX: sourceEvent.screenX,
          screenY: sourceEvent.screenY,
          movementX: "movementX" in sourceEvent ? sourceEvent.movementX : 0,
          movementY: "movementY" in sourceEvent ? sourceEvent.movementY : 0,
          buttons: sourceEvent.buttons,
          ctrlKey: sourceEvent.ctrlKey,
          shiftKey: sourceEvent.shiftKey,
          altKey: sourceEvent.altKey,
          metaKey: sourceEvent.metaKey
        })
      );

      forwardedPointerEventsRef.current += 1;

      if (window.__morningstarSplineDebug) {
        window.__morningstarSplineDebug.forwardedPointerEvents =
          forwardedPointerEventsRef.current;
      }
    };

    const preservePageWheelScroll = (event: WheelEvent) => {
      const startX = window.scrollX;
      const startY = window.scrollY;

      window.setTimeout(() => {
        const scrollWasBlocked =
          event.defaultPrevented &&
          window.scrollX === startX &&
          window.scrollY === startY;

        if (scrollWasBlocked) {
          window.scrollBy({
            left: event.deltaX,
            top: event.deltaY,
            behavior: "auto"
          });
        }
      }, 0);
    };

    const schedulePointerForward = (event: PointerEvent | MouseEvent) => {
      pendingPointerEventRef.current = event;

      if (pointerFrameRef.current === null) {
        pointerFrameRef.current = window.requestAnimationFrame(
          forwardPointerToCanvas
        );
      }
    };

    window.addEventListener("pointermove", schedulePointerForward, {
      capture: true,
      passive: true
    });
    window.addEventListener("mousemove", schedulePointerForward, {
      capture: true,
      passive: true
    });
    window.addEventListener("wheel", preservePageWheelScroll, {
      capture: true,
      passive: true
    });

    return () => {
      window.removeEventListener("pointermove", schedulePointerForward, {
        capture: true
      });
      window.removeEventListener("mousemove", schedulePointerForward, {
        capture: true
      });
      window.removeEventListener("wheel", preservePageWheelScroll, {
        capture: true
      });

      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }
    };
  }, []);

  return (
    <div ref={stageRef} className={`morningstar-spline-stage ${className}`}>
      <iframe
        src={fallbackSplineUrl}
        title="Interactive 3D computer fallback"
        frameBorder="0"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full border-0 opacity-100"
        allow="autoplay; fullscreen"
        allowFullScreen
        loading="eager"
      />
      <Spline
        scene={sceneUrl}
        onLoad={handleLoad}
        onSplineFollow={handleSplineEvent}
        onSplineLookAt={handleSplineEvent}
        onSplineMouseHover={handleSplineEvent}
        renderOnDemand={false}
        className={`pointer-events-none absolute inset-0 z-[2] h-full w-full transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <style jsx global>{`
        .morningstar-spline-stage canvas {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}

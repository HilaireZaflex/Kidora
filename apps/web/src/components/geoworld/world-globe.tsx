"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { geoCentroid, geoEquirectangular, geoPath } from "d3-geo";
import { useEffect, useMemo, useRef, useImperativeHandle } from "react";
import { countryFromUv, type Country } from "@/lib/geography/model";
export type GlobeController = {
  zoom: (direction: "in" | "out") => void;
  reset: () => void;
};
function CameraControls({
  selected,
  controllerRef,
}: {
  selected: Country | null;
  controllerRef: React.RefObject<GlobeController | null>;
}) {
  const { camera, gl, invalidate } = useThree();
  const controls = useMemo(() => {
    const orbit = new OrbitControls(camera);
    orbit.enablePan = false;
    orbit.minDistance = 1.55;
    orbit.maxDistance = 4.5;
    return orbit;
  }, [camera]);
  useImperativeHandle(
    controllerRef,
    () => ({
      zoom: (direction) => {
        camera.position.multiplyScalar(direction === "in" ? 0.85 : 1.15);
        controls.update();
        invalidate();
      },
      reset: () => {
        camera.position.set(0, 0.7, 3);
        controls.update();
        invalidate();
      },
    }),
    [camera, controls, invalidate],
  );
  useEffect(() => {
    controls.connect(gl.domElement);
    const redraw = () => invalidate();
    controls.addEventListener("change", redraw);
    return () => {
      controls.removeEventListener("change", redraw);
      controls.dispose();
    };
  }, [camera, controllerRef, controls, gl, invalidate]);
  useEffect(() => {
    if (!selected) return;
    const [longitude, latitude] = geoCentroid(selected);
    const lon = (longitude * Math.PI) / 180;
    const lat = (latitude * Math.PI) / 180;
    camera.position.set(
      3 * Math.cos(lat) * Math.sin(lon),
      3 * Math.sin(lat),
      3 * Math.cos(lat) * Math.cos(lon),
    );
    controls.update();
    invalidate();
  }, [selected, camera, controls, invalidate]);
  return null;
}
function Earth({
  countries,
  selected,
  onSelect,
}: {
  countries: Country[];
  selected: Country | null;
  onSelect: (country: Country | null) => void;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Texture cartographique indisponible");
    context.fillStyle = "#b9dcd9";
    context.fillRect(0, 0, 1024, 512);
    const path = geoPath(
      geoEquirectangular()
        .scale(1024 / (2 * Math.PI))
        .translate([512, 256]),
      context,
    );
    countries.forEach((country) => {
      context.beginPath();
      path(country);
      context.fillStyle = country.id === selected?.id ? "#e5a552" : "#6f9d7d";
      context.fill();
      context.strokeStyle = "#f1f5dd";
      context.lineWidth = 0.65;
      context.stroke();
    });
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [countries, selected]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh
      rotation={[0, -Math.PI / 2, 0]}
      onClick={(event) => {
        if (event.delta > 5 || !event.uv) return;
        event.stopPropagation();
        onSelect(countryFromUv(countries, event.uv.x, event.uv.y));
      }}
    >
      <sphereGeometry args={[1, 64, 48]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
export default function WorldGlobe({
  countries,
  selected,
  onSelect,
}: {
  countries: Country[];
  selected: Country | null;
  onSelect: (country: Country | null) => void;
}) {
  const controllerRef = useRef<GlobeController | null>(null);
  return (
    <div className="globe-interaction">
      <div
        className="globe-canvas"
        role="img"
        aria-label="Globe terrestre 3D. Fais glisser pour tourner ; la liste permet une sélection au clavier."
      >
        <Canvas
          camera={{ position: [0, 0.7, 3], fov: 45 }}
          dpr={[1, 1.5]}
          frameloop="demand"
          gl={{ antialias: false, powerPreference: "low-power" }}
        >
          <color attach="background" args={["#edf2e9"]} />
          <CameraControls selected={selected} controllerRef={controllerRef} />
          <Earth
            countries={countries}
            selected={selected}
            onSelect={onSelect}
          />
        </Canvas>
      </div>
      <div className="globe-controls" aria-label="Commandes du globe">
        <button
          type="button"
          onClick={() => controllerRef.current?.zoom("in")}
          aria-label="Zoom avant"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => controllerRef.current?.zoom("out")}
          aria-label="Zoom arrière"
        >
          −
        </button>
        <button type="button" onClick={() => controllerRef.current?.reset()}>
          Recentrer
        </button>
      </div>
    </div>
  );
}

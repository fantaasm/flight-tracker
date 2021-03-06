import { Tooltip } from "react-leaflet";
import { DivIcon, divIcon } from "leaflet";
import planeImgOrange from "../public/plane-orange.webp";
import { memo, ReactElement, useMemo, useState } from "react";
import ReactLeafletDriftMarker from "react-leaflet-drift-marker";
import { Plane, PlaneDetails } from "../types/plane";
import { renderToString } from "react-dom/server";

type Props = {
  plane: Plane;
  setSelectedPlane: (plane: PlaneDetails | null) => void;
};

const PlaneMarker = ({ plane, setSelectedPlane }: Props): JSX.Element => {
  const [tooltip, setTooltip] = useState<boolean>(false);

  const orangePlaneIcon: DivIcon = useMemo(
    () =>
      divIcon({
        className: "overflow-hidden",
        iconSize: [32, 32],
        html: renderToString(<MarkerIcon />),
      }),
    [Math.floor(plane.trueTrack % 5) === 0, plane.isSelected]
  );

  function MarkerIcon(): ReactElement {
    return (
      // <div>
      <img
        // priority
        // layout={"fixed"}
        width="32px"
        height="32px"
        style={{ transform: `rotate(${plane.trueTrack}deg)` }}
        className={`hover:hue-rotate-60 click:hue-rotate-60 overflow-hidden ${plane.isSelected === true && "hue-rotate-90"}`}
        src={planeImgOrange.src}
        alt="plane.webp"
      />
      // </div>
    );
  }

  return (
    <ReactLeafletDriftMarker
      position={[plane.latitude, plane.longitude]}
      icon={orangePlaneIcon}
      eventHandlers={{
        mouseover: (e) => {
          setTooltip(true);
        },
        mouseout: (e) => {
          setTooltip(false);
        },
        click: (e) => {
          setSelectedPlane(plane as PlaneDetails);
        },
      }}
      duration={8000}
    >
      {tooltip && <Tooltip direction={"top"}>{plane.callSign}</Tooltip>}
    </ReactLeafletDriftMarker>
  );
};

function areEqual(prevProps: Props, nextProps: Props): boolean {
  if (nextProps.plane.isSelected) {
    return false;
  }
  return (
    prevProps.plane.longitude === nextProps.plane.longitude &&
    prevProps.plane.latitude === nextProps.plane.latitude &&
    prevProps.plane.isSelected === nextProps.plane.isSelected
  );
}

export default memo(PlaneMarker, areEqual);

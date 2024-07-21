import { useState } from "react";


function Tooltip({spot}) {
    const [tooltipInfo, setTooltipInfo] = useState({
        isVisible: false,
        position: { x: 0, y: 0 },
        spot: null
      });

      const handleMouseMove = (e, spot) => {
        setTooltipInfo({
          isVisible: true,
          position: { x: e.clientX, y: e.clientY },
          spot: spot
        });
      };

      const handleMouseLeave = () => {
        setTooltipInfo({
          isVisible: false,
          position: { x: 0, y: 0 },
          spot: null
        });
      };

    return(
        <>
           {tooltipInfo.isVisible && (
                          <div className="tooltip" style={{ top: tooltipInfo.position.y + 20, left: tooltipInfo.position.x -45 }}>
                            {spot.name}
                          </div>
                        )}
                        <img
                          className="preview"
                          src={spot.previewImage}
                          alt={spot.id}
                          onMouseMove={(e) => handleMouseMove(e, spot)}
                          onMouseLeave={handleMouseLeave}
                        />
        </>
    );
}


export default Tooltip

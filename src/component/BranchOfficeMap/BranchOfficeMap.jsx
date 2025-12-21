import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const branches = [
  {
    id: 1,
    name: "Dhaka Head Office",
    lat: 23.8103,
    lng: 90.4125,
    address: "Dhaka, Bangladesh"
  },
  {
    id: 2,
    name: "Chattogram Branch",
    lat: 22.3569,
    lng: 91.7832,
    address: "Chattogram, Bangladesh"
  },
  {
    id: 3,
    name: "Sylhet Branch",
    lat: 24.8949,
    lng: 91.8687,
    address: "Sylhet, Bangladesh"
  }
];

const BranchOfficeMap = () => {
  return (
    <section className="my-16 px-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Our Branch Offices</h2>
        <p className="text-sm opacity-70 mt-2">
          Find our locations across Bangladesh
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <MapContainer
            center={[23.8103, 90.4125]}
            zoom={6}
            scrollWheelZoom={false}
            className="h-[450px] w-full rounded-lg"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {branches.map(branch => (
              <Marker key={branch.id} position={[branch.lat, branch.lng]}>
                <Popup>
                  <strong>{branch.name}</strong>
                  <br />
                  {branch.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default BranchOfficeMap;

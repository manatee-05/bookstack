import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PrintableLabels = ({ locations }) => {
  return (
    <div className="hidden print:block w-full">
      <div className="grid grid-cols-2 gap-8 gap-y-12">
        {locations.map((location) => (
          <div
            key={location.id}
            className="flex flex-col items-center justify-center border-2 border-black p-6 rounded-lg page-break-inside-avoid"
            style={{ width: '3in', height: '2in', margin: '0 auto' }}
          >
            <QRCodeSVG
              value={location.name}
              size={100}
              level="H"
              includeMargin={true}
            />
            <div className="mt-4 text-center">
              <h3 className="font-bold text-lg leading-tight text-black">{location.name}</h3>
              {location.description && (
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">{location.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintableLabels;

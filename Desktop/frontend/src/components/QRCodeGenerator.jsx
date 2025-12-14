import React from 'react';
import { QRCode } from 'react-qr-code';

const QRCodeGenerator = ({ value, size = 128 }) => {
  return (
    <div className="flex justify-center p-4">
      <QRCode 
        value={value} 
        size={size}
        level="H"
        className="max-w-full h-auto"
      />
    </div>
  );
};

export default QRCodeGenerator;
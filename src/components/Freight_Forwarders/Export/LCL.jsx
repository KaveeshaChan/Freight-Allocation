// Export/AirFreight.js
import React from 'react';

const ExportLCL = ({ order }) => {
  return (
    <div>
      <h2>Export - LCL</h2>
      <p>Order Number: {order.OrderNumber}</p>
      <p>From: {order.From}</p>
      <p>To: {order.To}</p>
      <p>Shipment Ready Date: {order.ShipmentReadyDate}</p>
      <p>Target Date: {order.TargetDate}</p>
      <p>Additional Notes: {order.AdditionalNotes}</p>
      {/* Display other relevant order details here */}
    </div>
  );
};

export default ExportLCL;
// Export/AirFreight.js
import React from 'react';

const ExportAirFreight = ({ order }) => {
  return (
    <div>
      <h2>Export - Air Freight</h2>
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

export default ExportAirFreight;
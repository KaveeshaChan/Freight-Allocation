import React from 'react';
import { FiClock, FiX, FiBox, FiTruck, FiAnchor, FiMapPin, FiCalendar, FiPackage } from 'react-icons/fi';

const OrderDetailsPopup = ({
  order,
  closePopup,
  handlePendingOrder,
  handleCancelOrder,
  showCancelReason,
  setShowCancelReason,
  cancelReason,
  setCancelReason,
  impactLevel,
  setImpactLevel,
  cancelType,
  setCancelType,
  priority,
  setPriority
}) => {
  const renderOrderDetails = (order) => {
    const Section = ({ title, icon, children }) => (
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h4 className="font-semibold text-lg text-blue-600">{title}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children}
        </div>
      </div>
    );

    const DetailItem = ({ label, value, icon }) => (
      value ? (
        <div className="flex justify-between items-center p-2 bg-white rounded-lg hover:bg-gray-50">
          <div className="flex items-center gap-2 text-gray-500">
            {icon}
            <span>{label}</span>
          </div>
          <span className="text-gray-700 font-medium">{value}</span>
        </div>
      ) : null
    );

    return (
      <div className="space-y-6">
        <Section title="Basic Info" icon={<FiBox className="text-blue-500" />}>
          <DetailItem
            label="Order Number"
            value={`#${order.orderNumber}`}
            icon={<FiPackage className="text-sm" />}
          />
          <DetailItem
            label="Order Type"
            value={order.orderType}
            icon={<FiTruck className="text-sm" />}
          />
          <DetailItem
            label="Shipment Type"
            value={order.shipmentType}
            icon={<FiAnchor className="text-sm" />}
          />
        </Section>

        <Section title="Route Details" icon={<FiMapPin className="text-green-500" />}>
          <DetailItem
            label="Route"
            value={`${order.from} → ${order.to}`}
            icon={<FiTruck className="text-sm" />}
          />
          <DetailItem
            label="Shipment Ready Date"
            value={new Date(order.shipmentReadyDate).toLocaleDateString()}
            icon={<FiCalendar className="text-sm" />}
          />
          <DetailItem
            label="Target Date"
            value={new Date(order.targetDate).toLocaleDateString()}
            icon={<FiCalendar className="text-sm" />}
          />
        </Section>

        {order.shipmentType === 'airFreight' && (
          <Section title="Cargo Details" icon={<FiPackage className="text-purple-500" />}>
            <DetailItem label="Cargo Type" value={order.cargoType} />
            <DetailItem label="Gross Weight" value={order.grossWeight ? `${order.grossWeight} kg` : ''} />
            <DetailItem label="Chargeable Weight" value={order.chargeableWeight ? `${order.chargeableWeight} kg` : ''} />
            <DetailItem label="Cargo CBM" value={order.cargoCBM} />
          </Section>
        )}

        {order.shipmentType === 'fcl' && (
          <Section title="Container Details" icon={<FiAnchor className="text-teal-500" />}>
            <DetailItem label="Containers" value={order.numberOfContainers} />
            <DetailItem label="Container Type" value={order.containerType} />
          </Section>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <button 
        onClick={closePopup} 
        className="fixed inset-x-50 top-12 text-gray-400 hover:text-gray-600 bg-white rounded-full p-2 transition-colors z-50"
      >
        <FiX className="text-2xl" />
      </button>
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full max-h-[70vh] overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
        </div>
          {renderOrderDetails(order)}

        {/* Action Sections */}
        <div className="space-y-4 mt-6">
          {/* Pending Action Section - Only show when not in cancel mode */}
          {!showCancelReason && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <FiClock className="text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Mark as Pending</h4>
                  <p className="text-xs text-blue-600 opacity-80">
                    This will move the order to pending status for later processing
                  </p>
                </div>
                <button
                  onClick={() => handlePendingOrder(order.OrderID)}
                  className="ml-auto px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Confirm Pending</span>
                </button>
              </div>
            </div>
          )}

          {/* Cancel Action Section */}
          <div className={`p-4 rounded-lg border ${showCancelReason ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-start gap-3">
              <FiX className={`text-red-500 shrink-0 mt-1 ${showCancelReason ? 'animate-pulse' : ''}`} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <h4 className="font-medium text-red-800">Cancel Order</h4>
                    <p className="text-xs text-red-600 opacity-80">
                      This will send an email notification to all active freight forwarders automatically
                    </p>
                  </div>
                  {!showCancelReason && (
                    <button
                      onClick={() => setShowCancelReason(true)}
                      className="ml-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
                    >
                      Start Cancellation
                    </button>
                  )}
                </div>

                {showCancelReason && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <label className="font-medium text-gray-500">Cancellation Reason*</label>
                        <span className="text-gray-400">{cancelReason.length}/200</span>
                      </div>
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Detailed reason for cancellation..."
                        className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-300 h-32"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setShowCancelReason(false);
                          setCancelReason('');
                        }}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                      >
                        Discard
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order, cancelReason)}
                        disabled={!cancelReason.trim() || cancelReason.length < 5}
                        className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default OrderDetailsPopup;
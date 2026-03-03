import React, { useState } from 'react';

/**
 * GroupUsersPanel Component
 * Shows all users in the group session and their individual orders
 */
const GroupUsersPanel = ({ session, currentUserId }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!session || !session.users) {
    return null;
  }

  const userColors = [
    'from-orange-400 to-orange-500',
    'from-green-400 to-green-500',
    'from-purple-400 to-purple-500',
    'from-pink-400 to-pink-500',
    'from-blue-400 to-blue-500',
    'from-yellow-400 to-yellow-500',
    'from-red-400 to-red-500',
    'from-indigo-400 to-indigo-500',
  ];

  const userEntries = Object.entries(session.users);

  const calculateUserTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  return (
    <div className="fixed md:right-4 md:top-24 md:w-80 bottom-0 left-0 right-0 md:bottom-auto md:left-auto bg-white md:rounded-2xl rounded-t-2xl shadow-2xl border-2 md:border-blue-500 border-t-blue-500 z-30 md:max-h-[calc(100vh-8rem)] max-h-[70vh] flex flex-col">
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 md:rounded-t-2xl rounded-t-2xl cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-between"
      >
        <div>
          <h3 className="font-bold text-lg">👥 Group Members</h3>
          <p className="text-xs text-blue-100">{userEntries.length} {userEntries.length === 1 ? 'person' : 'people'} ordering</p>
        </div>
        <span className={`text-2xl transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>

      {/* User List */}
      {isExpanded && (
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {userEntries.map(([userId, user], index) => {
            const isCurrentUser = userId === currentUserId;
            const colorClass = userColors[index % userColors.length];
            // Convert Firebase object to array if needed
            const userItems = Array.isArray(user.items) ? user.items : (user.items ? Object.values(user.items) : []);
            const userTotal = calculateUserTotal(userItems);

            return (
              <div
                key={userId}
                className={`rounded-xl border-2 overflow-hidden ${
                  isCurrentUser ? 'border-yellow-400 shadow-lg' : 'border-gray-200'
                }`}
              >
                {/* User Header */}
                <div className={`bg-gradient-to-r ${colorClass} text-white p-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {isCurrentUser ? '👤' : '👥'}
                      </span>
                      <div>
                        <p className="font-bold">
                          {user.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
                              YOU
                            </span>
                          )}
                        </p>
                        <p className="text-xs opacity-90">
                        {userItems.length} {userItems.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Items */}
                <div className="bg-gray-50 p-3">
                  {userItems.length === 0 ? (
                    <p className="text-sm text-gray-500 italic text-center py-2">
                      No items yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {userItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg p-2 flex items-center justify-between border border-gray-200"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-2xl">{item.image}</span>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-800">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {item.quantity}x ₦{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">
                              ₦{(item.quantity * item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* User Subtotal */}
                      {userTotal > 0 && (
                        <div className="border-t-2 border-gray-300 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-700">
                              Subtotal:
                            </span>
                            <span className="text-base font-bold text-gray-900">
                              ₦{userTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Total Summary */}
      {isExpanded && (
        <div className="bg-gradient-to-r from-green-100 to-blue-100 border-t-2 border-gray-300 p-4 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-600 font-semibold">GROUP TOTAL</p>
              <p className="text-sm text-gray-700">
                {userEntries.reduce((sum, [, user]) => {
                  const items = Array.isArray(user.items) ? user.items : (user.items ? Object.values(user.items) : []);
                  return sum + items.length;
                }, 0)} items
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                ₦{userEntries.reduce((sum, [, user]) => {
                  const items = Array.isArray(user.items) ? user.items : (user.items ? Object.values(user.items) : []);
                  return sum + calculateUserTotal(items);
                }, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupUsersPanel;

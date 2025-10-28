"use client";

import React from "react";
import {
  Package,
  ShoppingCart,
  ClipboardList,
  PackageCheck,
  Truck,
  PackageOpen,
  MapPin,
  Users,
  BarChart3,
  Settings,
  CheckCircle2,
  RotateCcw,
  Warehouse,
  ScanBarcode,
  AlertCircle,
  FileText,
  RefreshCcw,
  ListCheck,
} from "lucide-react";

const WMSDashboard = () => {
  const menuItems = [
    {
      icon: ListCheck,
      label: "Inventory",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/inventory",
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/orders",
    },
    {
      icon: ClipboardList,
      label: "Picking",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/picking",
    },
    {
      icon: PackageCheck,
      label: "Packing",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/packing",
    },
    {
      icon: Truck,
      label: "Shipping",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/shipping",
    },
    {
      icon: ScanBarcode,
      label: "Receiving",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/receiving",
    },
    {
      icon: MapPin,
      label: "Locations",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/locations",
    },
    {
      icon: RefreshCcw,
      label: "Cycle Count",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/cycle-count",
    },
    {
      icon: RotateCcw,
      label: "Returns",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/returns",
    },
    {
      icon: Users,
      label: "Staff",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/staff",
    },
    {
      icon: BarChart3,
      label: "Reports",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/reports",
    },
    {
      icon: Settings,
      label: "Settings",
      color: "bg-gradient-to-t bg-gradient from-blue-600 to-blue-500",
      href: "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Warehouse className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">WMS Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ScanBarcode className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <AlertCircle className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">24</div>
            <div className="text-xs text-gray-500">Pending Orders</div>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-500">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid Menu */}
      <div className="p-6 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center gap-3 active:scale-95 transform transition-transform"
              onClick={() => console.log(`Navigate to ${item.href}`)}
            >
              <div className={`${item.color} p-4 rounded-full`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg">
            <ScanBarcode className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Scan</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg">
            <ClipboardList className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Tasks</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg">
            <Package className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Search</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WMSDashboard;

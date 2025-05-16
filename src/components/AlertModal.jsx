// components/AlertModal.jsx
import { useEffect } from 'react'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'

const AlertModal = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        if (message) {
          const timer = setTimeout(() => {
            onClose()
          }, 5000)
          return () => clearTimeout(timer)
        }
      }, [message, onClose])
    
      if (!message) return null
    
      // Konfigurasi berdasarkan tipe alert
      const alertConfig = {
        success: {
          icon: CheckCircleIcon,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-100',
        },
        error: {
          icon: XCircleIcon,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100',
        },
        warning: {
          icon: ExclamationTriangleIcon,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
        },
        info: {
          icon: InformationCircleIcon,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
        },
      }
    
      const { icon: Icon, iconColor, bgColor } = alertConfig[type]
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={onClose} />
      
      <div
        role="alert"
        className={`flex items-center gap-4 p-4 rounded-lg ${bgColor} animate-fade-in-up`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default AlertModal
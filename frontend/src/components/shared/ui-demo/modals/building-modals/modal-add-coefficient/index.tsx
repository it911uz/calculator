"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

function CoefficientModalContent({ isOpen, onClose }: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  return (
    <div
      className={`
        w-full overflow-hidden transition-all duration-500 ease-in-out
        ${isOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}
      `}
    >
      <div className="h-[600px] w-full bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-sm px-3 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-900">Конфигурация коэффициентов</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Настройка коэффициентов для расчета стоимости
        </p>

        <div className="h-full flex flex-col">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="w-[50%]">
              <h3 className="font-semibold mb-2">Базовые коэффициенты</h3>
              <div className="space-y-2">
                <form className="flex flex-col gap-4" action="">
                    <label htmlFor="">
                        <Input
                            type="text"
                            placeholder="Имя коэффициент"
                            className="bg-white"
                        />
                    </label>
                    <label htmlFor="">
                        <Input
                            type="number"
                            placeholder="Здания ид"
                            className="bg-white"
                        />
                    </label>
                </form>
              
              </div>
            </div>
            
            <button>+</button>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Дополнительные параметры</h3>
              <div className="space-y-2">
                
                
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 mb-4">Добавьте дополнительные коэффициенты</p>
              <button className="bg-[#282964] text-white px-6 py-2 rounded hover:bg-indigo-900 transition-colors">
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ModalAddedCoefficientProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalAddedCoefficient({ 
  isOpen, 
  onClose 
}: ModalAddedCoefficientProps) {
  return (
    <div className="w-full">
      <CoefficientModalContent isOpen={isOpen} onClose={onClose} />
    </div>
  );
}

export function ModalAddedCoefficientWithInternalToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
      >
        Конфигурация коэффициентов
      </button>
      
      <CoefficientModalContent 
        isOpen={open} 
        onClose={() => setOpen(false)} 
      />
    </div>
  );
}
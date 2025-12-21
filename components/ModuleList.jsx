// components/ModuleList.jsx
"use client"

import { Circle, CheckCircle } from 'lucide-react'

export default function ModuleList({
    modules,
    currentModule,
    completedModules,
    onModuleSelect
}) {
    const completionPercentage = modules.length > 0
        ? Math.round((completedModules.length / modules.length) * 100)
        : 0;

    return (
        <div className="flex flex-col w-4/12 bg-white border border-gray-200 p-6 rounded-xl shadow-sm
        ">
            <div className='flex justify-between'>
                <h4 className='text-2xl font-semibold'>Course Modules</h4>
                <span className='bg-green-100 text-green-700 text-sm rounded-lg p-2'>
                    {completionPercentage}% Complete
                </span>
            </div>

            <div className='flex flex-col gap-2 mt-4 '>
                {modules.map((module, index) => {
                    const isCurrent = currentModule?.id === module.id;
                    const isCompleted = completedModules.includes(module.id);

                    return (
                        <button
                            key={module.id}
                            onClick={() => onModuleSelect(module, index)}
                            className={`cursor-pointer flex p-4 border-2 rounded-xl
                                ${isCurrent
                                    ? 'bg-blue-100/50 border-blue-600 border-l-4'
                                    : 'border-[#dfdfdf] hover:bg-gray-100'
                                }`}
                        >
                            <div className='flex space-x-4'>
                                {isCompleted ? (
                                    <CheckCircle className="text-green-600 flex-shrink-0" />
                                ) : (
                                    <Circle className="text-gray-400 flex-shrink-0" />
                                )}

                                <div className="text-start">
                                    <h4 className="text-md font-semibold">Module {module.order} <span className='text-sm text-gray-600 font-normal'> ({Math.floor(module.duration_seconds / 60)}min {module.duration_seconds % 60}s)</span></h4>
                                    <p className="text-xs text-gray-600">{module.title}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
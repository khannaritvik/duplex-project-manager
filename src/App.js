import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, AlertTriangle, Calendar, DollarSign, Home, Building, Clock, Target, Edit3, BarChart3, TrendingUp, ChevronDown, ChevronUp, List, Download, Upload } from 'lucide-react';

const DuplexProjectManager = () => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [selectedPhase, setSelectedPhase] = useState('phase1');
  const [showMasterTasks, setShowMasterTasks] = useState(false);
  const [showGantt, setShowGantt] = useState(false);
  const [showBudgetTracker, setShowBudgetTracker] = useState(false);
  const [actualCosts, setActualCosts] = useState(new Map());

  // Auto-save and load data from localStorage
  useEffect(() => {
    try {
      // Load saved data when app starts
      const savedTasks = localStorage.getItem('duplex-completed-tasks');
      const savedCosts = localStorage.getItem('duplex-actual-costs');
      const savedPhase = localStorage.getItem('duplex-selected-phase');
      
      console.log('Loading data:', { savedTasks, savedCosts, savedPhase }); // Debug log
      
      if (savedTasks) {
        const taskArray = JSON.parse(savedTasks);
        setCompletedTasks(new Set(taskArray));
        console.log('Loaded tasks:', taskArray);
      }
      if (savedCosts) {
        const costsObject = JSON.parse(savedCosts);
        const costsMap = new Map();
        Object.entries(costsObject).forEach(([key, value]) => {
          costsMap.set(key, value);
        });
        setActualCosts(costsMap);
        console.log('Loaded costs:', costsObject);
      }
      if (savedPhase) {
        setSelectedPhase(savedPhase);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Auto-save whenever data changes
  useEffect(() => {
    if (completedTasks.size > 0) { // Only save if there's actual data
      try {
        const taskArray = Array.from(completedTasks);
        localStorage.setItem('duplex-completed-tasks', JSON.stringify(taskArray));
        console.log('Saved tasks:', taskArray); // Debug log
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    }
  }, [completedTasks]);

  useEffect(() => {
    if (actualCosts.size > 0) { // Only save if there's actual data
      try {
        const costsObject = {};
        actualCosts.forEach((value, key) => {
          costsObject[key] = value;
        });
        localStorage.setItem('duplex-actual-costs', JSON.stringify(costsObject));
        console.log('Saved costs:', costsObject); // Debug log
      } catch (error) {
        console.error('Error saving costs:', error);
      }
    }
  }, [actualCosts]);

  useEffect(() => {
    try {
      localStorage.setItem('duplex-selected-phase', selectedPhase);
    } catch (error) {
      console.error('Error saving phase:', error);
    }
  }, [selectedPhase]);

  // Export/Import functionality
  const exportData = () => {
    const data = {
      completedTasks: [...completedTasks],
      actualCosts: Object.fromEntries(actualCosts),
      selectedPhase: selectedPhase,
      exportDate: new Date().toISOString(),
      projectName: 'Duplex Renovation Project'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duplex-project-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setCompletedTasks(new Set(data.completedTasks || []));
          setActualCosts(new Map(Object.entries(data.actualCosts || {})));
          setSelectedPhase(data.selectedPhase || 'phase1');
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Updated financial parameters with correct rental rates
  const monthlyCarryingCosts = 4854.17;
  const mainFloorIncome = 3500; // $1750 average for 3BR main floors
  const currentMonthlyLoss = monthlyCarryingCosts - mainFloorIncome;
  const fullRentalIncome = 5700; // All 4 units
  const postRefiSurplus = fullRentalIncome - 3200; // After refinance

  // Master task list in proper execution order
  const masterTaskList = [
    // IMMEDIATE SAFETY & HABITABILITY (Sep 15 - Oct 1)
    { id: 'struct_engineer_consult', name: 'Emergency structural engineer consultation', phase: 'Safety', critical: true, trades: ['Engineer'], cost: 2500, days: 2 },
    { id: 'emergency_permits', name: 'File emergency building permits', phase: 'Safety', critical: true, trades: ['Admin'], cost: 400, days: 1 },
    { id: 'sump_pump_repair', name: 'Repair sump pump systems', phase: 'Safety', critical: true, trades: ['Plumber'], cost: 2000, days: 2 },
    { id: 'plumbing_safety_fix', name: 'Install missing caps, fix hazards', phase: 'Safety', critical: true, trades: ['Plumber'], cost: 800, days: 1 },
    { id: 'electrical_safety_fix', name: 'Fix wiring hazards, label panels', phase: 'Safety', critical: true, trades: ['Electrician'], cost: 1200, days: 2 },
    { id: 'appliance_order', name: 'Order appliances for main floors', phase: 'Safety', critical: true, trades: ['Admin'], cost: 4500, days: 1 },
    
    // MAIN FLOOR FINISHING
    { id: 'lvp_11832', name: 'Install LVP flooring 11832 main', phase: 'Safety', critical: true, trades: ['Flooring'], cost: 2800, days: 2 },
    { id: 'carpet_11834', name: 'Install carpet 11834 main', phase: 'Safety', critical: true, trades: ['Flooring'], cost: 1500, days: 1 },
    { id: 'appliance_install', name: 'Install main floor appliances', phase: 'Safety', critical: true, trades: ['Appliance Tech'], cost: 800, days: 2 },
    { id: 'attic_insulation', name: 'Install attic insulation', phase: 'Safety', critical: true, trades: ['Insulation'], cost: 4000, days: 2 },
    { id: 'main_floor_clean', name: 'Professional cleaning', phase: 'Safety', critical: true, trades: ['Cleaner'], cost: 800, days: 1 },
    { id: 'safety_inspection', name: 'Safety inspection & occupancy', phase: 'Safety', critical: true, trades: ['Inspector'], cost: 200, days: 1 },
    
    // SUITE PLANNING & PERMITS (Oct 1 - Nov 1)
    { id: 'architect_rush', name: 'Rush architect plans (both suites)', phase: 'Permits', critical: true, trades: ['Architect'], cost: 4500, days: 10 },
    { id: 'structural_engineer_suite', name: 'Structural engineer for egress', phase: 'Permits', critical: true, trades: ['Engineer'], cost: 1500, days: 5 },
    { id: 'development_permits', name: 'Submit development permits', phase: 'Permits', critical: true, trades: ['Admin'], cost: 500, days: 2 },
    { id: 'building_permits_suite', name: 'Submit building permits', phase: 'Permits', critical: true, trades: ['Admin'], cost: 1000, days: 7 },
    { id: 'material_bulk_order', name: 'Bulk order all suite materials', phase: 'Permits', critical: false, trades: ['Admin'], cost: 0, days: 3 },
    
    // ROUGH-IN PHASE (Nov 1 - Dec 20) - BOTH SUITES SIMULTANEOUSLY
    { id: 'egress_windows_cut', name: 'Cut egress windows (both suites)', phase: 'Rough-in', critical: true, trades: ['Concrete', 'Glazier'], cost: 9000, days: 5 },
    { id: 'structural_framing', name: 'Frame walls/ceilings (both suites)', phase: 'Rough-in', critical: true, trades: ['Framer'], cost: 7000, days: 8 },
    { id: 'electrical_rough_both', name: 'Electrical rough-in (separate panels)', phase: 'Rough-in', critical: true, trades: ['Electrician'], cost: 6000, days: 6 },
    { id: 'plumbing_rough_both', name: 'Plumbing rough-in (both suites)', phase: 'Rough-in', critical: true, trades: ['Plumber'], cost: 7000, days: 8 },
    { id: 'hvac_rough_both', name: 'HVAC systems (both suites)', phase: 'Rough-in', critical: true, trades: ['HVAC'], cost: 2500, days: 4 },
    { id: 'rough_inspections', name: 'All rough-in inspections', phase: 'Rough-in', critical: true, trades: ['Inspector'], cost: 500, days: 2 },
    
    // SUITE 11832 FINISHING (Dec 20 - Jan 20)
    { id: 'insulation_11832', name: 'Insulation/vapor barrier 11832', phase: 'Finish 11832', critical: false, trades: ['Insulation'], cost: 1800, days: 3 },
    { id: 'drywall_11832', name: 'Drywall installation 11832', phase: 'Finish 11832', critical: false, trades: ['Drywall'], cost: 3500, days: 8 },
    { id: 'flooring_11832_suite', name: 'LVP flooring 11832 suite', phase: 'Finish 11832', critical: false, trades: ['Flooring'], cost: 2200, days: 3 },
    { id: 'kitchen_cabinets_11832', name: 'Kitchen cabinets 11832', phase: 'Finish 11832', critical: false, trades: ['Cabinet'], cost: 3000, days: 3 },
    { id: 'countertops_11832', name: 'Countertops 11832', phase: 'Finish 11832', critical: false, trades: ['Countertop'], cost: 1000, days: 2 },
    { id: 'bathroom_11832', name: 'Bathroom completion 11832', phase: 'Finish 11832', critical: false, trades: ['Plumber', 'Tiler'], cost: 2500, days: 5 },
    { id: 'appliances_11832_suite', name: 'Suite appliances 11832', phase: 'Finish 11832', critical: false, trades: ['Appliance Tech'], cost: 2000, days: 1 },
    { id: 'electrical_final_11832', name: 'Final electrical 11832', phase: 'Finish 11832', critical: false, trades: ['Electrician'], cost: 500, days: 2 },
    { id: 'paint_11832', name: 'Paint & trim 11832', phase: 'Finish 11832', critical: false, trades: ['Painter'], cost: 1200, days: 3 },
    
    // SUITE 11834 FINISHING (Jan 20 - Jan 31)
    { id: 'insulation_11834', name: 'Insulation/vapor barrier 11834', phase: 'Finish 11834', critical: false, trades: ['Insulation'], cost: 1500, days: 2 },
    { id: 'drywall_11834', name: 'Drywall installation 11834', phase: 'Finish 11834', critical: false, trades: ['Drywall'], cost: 3000, days: 6 },
    { id: 'flooring_11834_suite', name: 'LVP flooring 11834 suite', phase: 'Finish 11834', critical: false, trades: ['Flooring'], cost: 2000, days: 2 },
    { id: 'kitchen_11834', name: 'Kitchen installation 11834', phase: 'Finish 11834', critical: false, trades: ['Cabinet', 'Countertop'], cost: 3500, days: 3 },
    { id: 'bathroom_11834', name: 'Bathroom completion 11834', phase: 'Finish 11834', critical: false, trades: ['Plumber', 'Tiler'], cost: 2500, days: 4 },
    { id: 'appliances_11834_suite', name: 'Suite appliances 11834', phase: 'Finish 11834', critical: false, trades: ['Appliance Tech'], cost: 1800, days: 1 },
    { id: 'electrical_final_11834', name: 'Final electrical 11834', phase: 'Finish 11834', critical: false, trades: ['Electrician'], cost: 500, days: 2 },
    { id: 'paint_11834', name: 'Paint & trim 11834', phase: 'Finish 11834', critical: false, trades: ['Painter'], cost: 1000, days: 2 },
    
    // FINAL COMPLETION
    { id: 'final_inspections_both', name: 'Final inspections both suites', phase: 'Completion', critical: true, trades: ['Inspector'], cost: 500, days: 1 },
    { id: 'exterior_touchups', name: 'Exterior repairs & cleanup', phase: 'Completion', critical: false, trades: ['General'], cost: 2000, days: 3 },
    { id: 'landscaping', name: 'Landscaping & curb appeal', phase: 'Completion', critical: false, trades: ['Landscaper'], cost: 1500, days: 2 },
    { id: 'final_cleaning', name: 'Final professional cleaning', phase: 'Completion', critical: false, trades: ['Cleaner'], cost: 600, days: 1 }
  ];

  // Updated project phases
  const phases = {
    phase1: {
      name: 'Main Floor Habitability (Sep 15 - Oct 1)',
      deadline: 'Oct 1, 2025',
      budget: 29000,
      color: 'bg-red-100 border-red-300',
      priority: 'CRITICAL',
      description: 'Get main floors rented ASAP - $1,354/month savings!',
      tasks: masterTaskList.slice(0, 12) // First 12 tasks
    },
    phase2: {
      name: 'Suite Permits & Design (Oct 1 - Nov 1)',
      deadline: 'Nov 1, 2025',
      budget: 7500,
      color: 'bg-yellow-100 border-yellow-300',
      priority: 'CRITICAL',
      description: 'Fast-track permits for simultaneous construction',
      tasks: masterTaskList.slice(12, 17) // Next 5 tasks
    },
    phase3: {
      name: 'Simultaneous Rough-In (Both Suites) (Nov 1 - Dec 20)',
      deadline: 'Dec 20, 2025',
      budget: 32000,
      color: 'bg-blue-100 border-blue-300',
      priority: 'HIGH',
      description: 'Maximum efficiency - both suites together',
      tasks: masterTaskList.slice(17, 23) // Rough-in tasks
    },
    phase4: {
      name: 'Suite 11832 Finish (Dec 20 - Jan 20)',
      deadline: 'Jan 20, 2026',
      budget: 17700,
      color: 'bg-green-100 border-green-300',
      priority: 'MEDIUM',
      description: 'Complete first suite for immediate rental',
      tasks: masterTaskList.slice(23, 32) // 11832 finishing
    },
    phase5: {
      name: 'Suite 11834 Finish (Jan 20 - Jan 31)',
      deadline: 'Jan 31, 2026',
      budget: 15800,
      color: 'bg-purple-100 border-purple-300',
      priority: 'MEDIUM',
      description: 'Complete second suite to maximize income',
      tasks: masterTaskList.slice(32, 47) // 11834 finishing + completion
    }
  };

  // Helper functions
  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const updateActualCost = (taskId, cost) => {
    const newActualCosts = new Map(actualCosts);
    if (cost === '' || cost === null) {
      newActualCosts.delete(taskId);
    } else {
      newActualCosts.set(taskId, parseFloat(cost) || 0);
    }
    setActualCosts(newActualCosts);
  };

  // Budget calculations
  const getTotalBudgeted = () => masterTaskList.reduce((sum, task) => sum + task.cost, 0);
  const getTotalActual = () => Array.from(actualCosts.values()).reduce((sum, cost) => sum + cost, 0);
  const getTotalVariance = () => getTotalActual() - getTotalBudgeted();

  // Calculate progress for current phase
  const currentPhase = phases[selectedPhase];
  const completedCount = currentPhase.tasks.filter(task => completedTasks.has(task.id)).length;
  const progressPercent = Math.round((completedCount / currentPhase.tasks.length) * 100);

  // Calculate total project stats
  const totalBudget = Object.values(phases).reduce((sum, phase) => sum + phase.budget, 0);
  const totalSpent = getTotalActual();

  // Get next week's tasks
  const getNextWeekTasks = () => {
    const nextTasks = [];
    for (const task of masterTaskList) {
      if (!completedTasks.has(task.id) && nextTasks.length < 7) {
        nextTasks.push(task);
      }
    }
    return nextTasks;
  };

  const nextWeekTasks = getNextWeekTasks();

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date('2025-09-15');
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate timeline milestones with updated rates
  const getTimelineMilestones = () => {
    return [
      { date: 'Oct 1', event: 'Main floors rented', income: 3500, loss: -1354 },
      { date: 'Jan 20', event: 'First suite complete', income: 4600, loss: -254 },
      { date: 'Jan 31', event: 'Both suites complete', income: 5700, loss: 846 },
      { date: 'Mar 1', event: 'Refinance complete', income: 5700, surplus: 2500 }
    ];
  };

  // Simple Gantt Chart component
  const GanttChart = () => {
    const ganttPhases = [
      { name: 'Safety & Main Floors', start: 0, duration: 16, color: 'bg-red-400' },
      { name: 'Permits & Planning', start: 16, duration: 30, color: 'bg-yellow-400' },
      { name: 'Rough-in (Both)', start: 46, duration: 49, color: 'bg-blue-400' },
      { name: 'Finish 11832', start: 95, duration: 31, color: 'bg-green-400' },
      { name: 'Finish 11834', start: 126, duration: 11, color: 'bg-purple-400' }
    ];

    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold mb-4">Project Timeline (Gantt Chart)</h3>
        <div className="space-y-2">
          {ganttPhases.map((phase, index) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-xs font-medium mr-4">{phase.name}</div>
              <div className="flex-1 relative h-6 bg-gray-200 rounded">
                <div
                  className={`absolute h-full ${phase.color} rounded`}
                  style={{
                    left: `${(phase.start / 137) * 100}%`,
                    width: `${(phase.duration / 137) * 100}%`
                  }}
                ></div>
              </div>
              <div className="w-16 text-xs ml-2">{phase.duration}d</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Sep 15</span>
          <span>Nov 1</span>
          <span>Dec 20</span>
          <span>Jan 31</span>
        </div>
      </div>
    );
  };

  // Budget tracker component
  const BudgetTracker = () => {
    const totalBudgeted = getTotalBudgeted();
    const totalActual = getTotalActual();
    const totalVariance = getTotalVariance();
    
    return (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 font-semibold text-sm">Total Budgeted</div>
            <div className="text-2xl font-bold text-blue-800">${totalBudgeted.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-600 font-semibold text-sm">Total Actual</div>
            <div className="text-2xl font-bold text-green-800">${totalActual.toLocaleString()}</div>
          </div>
          <div className={`p-4 rounded-lg ${totalVariance >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className={`font-semibold text-sm ${totalVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              Variance
            </div>
            <div className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-red-800' : 'text-green-800'}`}>
              {totalVariance >= 0 ? '+' : ''}${totalVariance.toLocaleString()}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-purple-600 font-semibold text-sm">Budget Used</div>
            <div className="text-2xl font-bold text-purple-800">
              {totalBudgeted > 0 ? Math.round((totalActual / totalBudgeted) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Budget Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phase
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budgeted Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difference
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {masterTaskList.map((task, index) => {
                const actualCost = actualCosts.get(task.id) || 0;
                const difference = actualCost - task.cost;
                const isCompleted = completedTasks.has(task.id);
                
                return (
                  <tr key={task.id} className={isCompleted ? 'bg-green-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <span className="w-8 text-xs font-bold text-gray-500 mr-2">#{index + 1}</span>
                        <div>
                          <div className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {task.trades.join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {task.phase}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ${task.cost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="number"
                        value={actualCosts.get(task.id) || ''}
                        onChange={(e) => updateActualCost(task.id, e.target.value)}
                        placeholder="Enter actual cost"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {actualCost > 0 && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          difference > 0 
                            ? 'bg-red-100 text-red-800' 
                            : difference < 0 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {difference > 0 ? '+' : ''}${difference.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        {isCompleted ? (
                          <CheckCircle className="text-green-600" size={16} />
                        ) : (
                          <Circle className="text-gray-400" size={16} />
                        )}
                        {task.critical && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            CRITICAL
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Phase Summary */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Budget by Phase</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(phases).map(([key, phase]) => {
              const phaseBudgeted = phase.tasks.reduce((sum, task) => sum + task.cost, 0);
              const phaseActual = phase.tasks.reduce((sum, task) => sum + (actualCosts.get(task.id) || 0), 0);
              const phaseVariance = phaseActual - phaseBudgeted;
              
              return (
                <div key={key} className={`p-4 rounded-lg border-2 ${phase.color}`}>
                  <h4 className="font-bold text-sm mb-2">{phase.name.split('(')[0]}</h4>
                  <div className="space-y-1 text-xs">
                    <div>Budgeted: ${phaseBudgeted.toLocaleString()}</div>
                    <div>Actual: ${phaseActual.toLocaleString()}</div>
                    <div className={`font-bold ${phaseVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      Variance: {phaseVariance >= 0 ? '+' : ''}${phaseVariance.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header with Updated Financial Reality */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Building className="mr-3 text-blue-600" />
            Duplex Cash Flow Recovery Plan
          </h1>
          
          {/* Export/Import Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={exportData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center text-sm"
            >
              <Download className="mr-2" size={16} />
              Export Data
            </button>
            <label className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center text-sm cursor-pointer">
              <Upload className="mr-2" size={16} />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {/* Updated Financial Alert */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="text-green-600 mr-2" size={20} />
            <span className="font-bold text-green-800">AUTO-SAVE ENABLED: Your progress saves automatically!</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-green-600">Monthly Costs:</span>
              <div className="font-bold text-green-800">${monthlyCarryingCosts.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-green-600">Main Floor Income:</span>
              <div className="font-bold text-green-800">${mainFloorIncome.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-green-600">Monthly Loss (Initially):</span>
              <div className="font-bold text-green-800">-${currentMonthlyLoss.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-green-600">Final Surplus (Post-Refi):</span>
              <div className="font-bold text-green-800">+${postRefiSurplus.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2 text-sm text-green-700">
            <strong>Strategy:</strong> $1,354/month loss is manageable → Build suites → Refinance → $2,500/month surplus! 🎯
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-semibold">Total Budget</span>
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-blue-800">${totalBudget.toLocaleString()}</div>
            <div className="text-sm text-blue-600">Spent: ${totalSpent.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-semibold">Remaining</span>
              <Target className="text-green-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-green-800">${(totalBudget - totalSpent).toLocaleString()}</div>
            <div className="text-sm text-green-600">{Math.round((totalSpent/totalBudget)*100)}% used</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-yellow-600 font-semibold">Main Floor Goal</span>
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-yellow-800">{getDaysUntilDeadline('Oct 1, 2025')} days</div>
            <div className="text-sm text-yellow-600">Save $1,354/month!</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-purple-600 font-semibold">Suite Completion</span>
              <Calendar className="text-purple-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-purple-800">{getDaysUntilDeadline('Jan 31, 2026')} days</div>
            <div className="text-sm text-purple-600">To $2,500 surplus</div>
          </div>
        </div>
      </div>

      {/* Budget Tracker */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <DollarSign className="mr-2 text-green-500" />
            Budget Tracker & Cost Control
          </h2>
          <button 
            onClick={() => setShowBudgetTracker(!showBudgetTracker)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
          >
            <DollarSign className="mr-2" size={20} />
            {showBudgetTracker ? 'Hide' : 'Show'} Budget Details
          </button>
        </div>
        
        {/* Always show summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-blue-600 font-semibold text-sm">Total Budgeted</div>
            <div className="text-xl font-bold text-blue-800">${getTotalBudgeted().toLocaleString()}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-green-600 font-semibold text-sm">Total Spent</div>
            <div className="text-xl font-bold text-green-800">${getTotalActual().toLocaleString()}</div>
          </div>
          <div className={`p-3 rounded-lg ${getTotalVariance() >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className={`font-semibold text-sm ${getTotalVariance() >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {getTotalVariance() >= 0 ? 'Over Budget' : 'Under Budget'}
            </div>
            <div className={`text-xl font-bold ${getTotalVariance() >= 0 ? 'text-red-800' : 'text-green-800'}`}>
              ${Math.abs(getTotalVariance()).toLocaleString()}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-purple-600 font-semibold text-sm">Remaining Budget</div>
            <div className="text-xl font-bold text-purple-800">
              ${Math.max(0, getTotalBudgeted() - getTotalActual()).toLocaleString()}
            </div>
          </div>
        </div>
        
        {showBudgetTracker && <BudgetTracker />}
      </div>

      {/* Rest of the component stays the same... */}
      {/* I'll include the remaining sections for completeness */}
      
      {/* Gantt Chart Toggle */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Project Timeline</h2>
          <button 
            onClick={() => setShowGantt(!showGantt)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            <BarChart3 className="mr-2" size={20} />
            {showGantt ? 'Hide' : 'Show'} Gantt Chart
          </button>
        </div>
        {showGantt && <GanttChart />}
      </div>

      {/* Financial Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-green-500" />
          Cash Flow Recovery Timeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {getTimelineMilestones().map((milestone, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              milestone.loss ? (milestone.loss < 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200') : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="font-bold text-lg">{milestone.date}</div>
              <div className="text-sm text-gray-600 mb-2">{milestone.event}</div>
              <div className="text-sm">
                <div>Income: ${milestone.income.toLocaleString()}</div>
                {milestone.loss !== undefined && (
                  <div className={milestone.loss < 0 ? 'text-orange-600 font-bold' : 'text-green-600 font-bold'}>
                    {milestone.loss < 0 ? 'Loss' : 'Surplus'}: ${Math.abs(milestone.loss).toLocaleString()}
                  </div>
                )}
                {milestone.surplus && (
                  <div className="text-blue-600 font-bold">
                    Surplus: ${milestone.surplus.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Week's Tasks */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-orange-500" />
          This Week's Action Items (Sep 16-22)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nextWeekTasks.map((task, index) => {
            const isCompleted = completedTasks.has(task.id);
            return (
              <div
                key={task.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isCompleted 
                    ? 'bg-green-50 border-green-300' 
                    : task.critical 
                      ? 'bg-red-50 border-red-300' 
                      : 'bg-blue-50 border-blue-300'
                }`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 text-sm font-bold text-gray-500">#{index + 1}</div>
                  <div className="flex-grow">
                    <h3 className={`font-bold text-sm mb-2 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.name}
                    </h3>
                    <div className="space-y-1">
                      <div className="text-xs bg-purple-100 px-2 py-1 rounded inline-block">
                        {task.trades.join(', ')}
                      </div>
                      <div className="text-xs text-gray-600">
                        Cost: ${task.cost.toLocaleString()} | Duration: {task.days} days
                      </div>
                      {task.critical && (
                        <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-block font-bold">
                          CRITICAL
                        </div>
                      )}
                    </div>
                  </div>
                  {isCompleted ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <Circle className="text-gray-400" size={20} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Master Task List - Collapsible */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <List className="mr-2 text-blue-500" />
            Complete Project Task List (Execution Order)
          </h2>
          <button 
            onClick={() => setShowMasterTasks(!showMasterTasks)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center"
          >
            {showMasterTasks ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            {showMasterTasks ? 'Collapse' : 'Expand'} All Tasks
          </button>
        </div>
        
        {showMasterTasks && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {masterTaskList.map((task, index) => {
              const isCompleted = completedTasks.has(task.id);
              
              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : task.critical 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-grow">
                      <div className="w-8 text-xs font-bold text-gray-500">#{index + 1}</div>
                      {isCompleted ? (
                        <CheckCircle className="text-green-600" size={20} />
                      ) : (
                        <Circle className="text-gray-400" size={20} />
                      )}
                      <div className="flex-grow">
                        <h3 className={`font-medium text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.name}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1 flex-wrap">
                          <span className="text-xs bg-blue-100 px-2 py-1 rounded">{task.phase}</span>
                          <span className="text-xs text-gray-600">${task.cost.toLocaleString()}</span>
                          <span className="text-xs text-gray-600">{task.days}d</span>
                          <span className="text-xs bg-purple-100 px-2 py-1 rounded">
                            {task.trades.join(', ')}
                          </span>
                          {task.critical && !isCompleted && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">CRITICAL</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Phase Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Project Phases</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Object.entries(phases).map(([key, phase]) => {
            const phaseCompleted = phase.tasks.filter(task => completedTasks.has(task.id)).length;
            const phaseProgress = Math.round((phaseCompleted / phase.tasks.length) * 100);
            
            return (
              <button
                key={key}
                onClick={() => setSelectedPhase(key)}
                className={`p-3 rounded-lg border-2 text-left transition-all text-sm ${
                  selectedPhase === key ? phase.color : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <h3 className="font-bold text-xs mb-1">{phase.name}</h3>
                <div className="text-xs text-gray-600 mb-2">{phase.deadline}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${phaseProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs font-medium">{phaseProgress}%</div>
                <div className="text-xs text-gray-600">${phase.budget.toLocaleString()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Phase Tasks */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{currentPhase.name}</h2>
            <p className="text-gray-600 mt-1">{currentPhase.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              currentPhase.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
              currentPhase.priority === 'HIGH' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {currentPhase.priority} PRIORITY
            </span>
            <span className="text-lg font-bold text-gray-700">{progressPercent}% Complete</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="space-y-3">
          {currentPhase.tasks.map((task) => {
            const isCompleted = completedTasks.has(task.id);
            
            return (
              <div
                key={task.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : task.critical 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-grow">
                    {isCompleted ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <Circle className="text-gray-400" size={24} />
                    )}
                    <div className="flex-grow">
                      <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 flex-wrap">
                        <span className="text-sm text-gray-600">Cost: ${task.cost.toLocaleString()}</span>
                        <span className="text-sm text-gray-600">Duration: {task.days} days</span>
                        <span className="text-xs bg-purple-100 px-2 py-1 rounded">
                          {task.trades.join(', ')}
                        </span>
                        {task.critical && !isCompleted && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">CRITICAL</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-700">Phase Budget:</span>
            <span className="text-xl font-bold text-gray-800">${currentPhase.budget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Spent in this phase:</span>
            <span className="font-medium text-gray-700">
              ${currentPhase.tasks
                .reduce((sum, task) => sum + (actualCosts.get(task.id) || 0), 0)
                .toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Deadline:</span>
            <span className={`font-medium ${getDaysUntilDeadline(currentPhase.deadline) < 0 ? 'text-red-600' : 'text-gray-700'}`}>
              {getDaysUntilDeadline(currentPhase.deadline)} days ({currentPhase.deadline})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplexProjectManager;
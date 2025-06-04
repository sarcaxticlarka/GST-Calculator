"use client"
import { useState, useEffect } from 'react';
import { Calculator, Percent, Download, Copy, History, Plus, Trash2, Save, FileText, IndianRupee, DollarSign, Euro, PoundSterling } from 'lucide-react';

export default function GSTCalculator() {
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [customGstRate, setCustomGstRate] = useState('');
  const [isCustomRate, setIsCustomRate] = useState(false);
  const [taxType, setTaxType] = useState('Exclusive');
  const [currency, setCurrency] = useState('INR');
  const [description, setDescription] = useState('');
  const [results, setResults] = useState({
    actualAmount: 0,
    gstAmount: 0,
    totalAmount: 0
  });
  const [history, setHistory] = useState([]);
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [bulkItems, setBulkItems] = useState([{ description: '', amount: '', gstRate: '18' }]);
  const [activeTab, setActiveTab] = useState('single');
  const [isAnimating, setIsAnimating] = useState(false);

  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const gstRates = [
    { value: '0', label: '0% - Essential goods' },
    { value: '0.25', label: '0.25% - Rough precious stones' },
    { value: '3', label: '3% - Gold, silver' },
    { value: '5', label: '5% - Household items' },
    { value: '12', label: '12% - Processed food' },
    { value: '18', label: '18% - Most goods & services' },
    { value: '28', label: '28% - Luxury items' },
    { value: 'custom', label: 'Custom Rate - Enter manually' }
  ];

  const calculateGST = (inputAmount, rate, type) => {
    const amt = parseFloat(inputAmount) || 0;
    const gstRate = parseFloat(rate) || 0;

    if (type === 'Inclusive') {
      const actualAmount = amt / (1 + gstRate / 100);
      const gstAmount = amt - actualAmount;
      return {
        actualAmount: Math.round(actualAmount * 100) / 100,
        gstAmount: Math.round(gstAmount * 100) / 100,
        totalAmount: Math.round(amt * 100) / 100
      };
    } else {
      const actualAmount = amt;
      const gstAmount = amt * (gstRate / 100);
      const totalAmount = amt + gstAmount;
      return {
        actualAmount: Math.round(actualAmount * 100) / 100,
        gstAmount: Math.round(gstAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100
      };
    }
  };

  useEffect(() => {
    const effectiveRate = isCustomRate ? customGstRate : gstRate;
    const newResults = calculateGST(amount, effectiveRate, taxType);
    setResults(newResults);
  }, [amount, gstRate, customGstRate, isCustomRate, taxType]);

  const addToHistory = () => {
    if (amount && parseFloat(amount) > 0) {
      const effectiveRate = isCustomRate ? parseFloat(customGstRate) : parseFloat(gstRate);
      const calculation = {
        id: Date.now(),
        amount: parseFloat(amount),
        gstRate: effectiveRate,
        taxType,
        currency,
        description,
        results,
        timestamp: new Date().toLocaleString()
      };
      setHistory(prev => [calculation, ...prev.slice(0, 19)]);
    }
  };

  const saveCalculation = () => {
    if (amount && parseFloat(amount) > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
      
      const effectiveRate = isCustomRate ? parseFloat(customGstRate) : parseFloat(gstRate);
      const calculation = {
        id: Date.now(),
        name: description || `GST Calculation ${savedCalculations.length + 1}`,
        amount: parseFloat(amount),
        gstRate: effectiveRate,
        taxType,
        currency,
        description,
        results,
        timestamp: new Date().toLocaleString()
      };
      setSavedCalculations(prev => [...prev, calculation]);
    }
  };

  const loadCalculation = (calc) => {
    setAmount(calc.amount.toString());
    setGstRate(calc.gstRate.toString());
    setTaxType(calc.taxType);
    setCurrency(calc.currency);
    setDescription(calc.description);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const generateInvoiceText = () => {
    const effectiveRate = isCustomRate ? customGstRate : gstRate;
    return `GST CALCULATION DETAILS
${description ? `Description: ${description}` : ''}
Amount: ${currencySymbols[currency]}${amount}
GST Rate: ${effectiveRate}%
Tax Type: ${taxType}
------------------------
Base Amount: ${currencySymbols[currency]}${results.actualAmount.toLocaleString()}
GST Amount: ${currencySymbols[currency]}${results.gstAmount.toLocaleString()}
Total Amount: ${currencySymbols[currency]}${results.totalAmount.toLocaleString()}
------------------------
Generated on: ${new Date().toLocaleString()}`;
  };

  const downloadAsText = () => {
    const text = generateInvoiceText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GST_Calculation_${Date.now()}.txt`;
    a.click();
  };

  const addBulkItem = () => {
    setBulkItems([...bulkItems, { description: '', amount: '', gstRate: '18' }]);
  };

  const removeBulkItem = (index) => {
    setBulkItems(bulkItems.filter((_, i) => i !== index));
  };

  const updateBulkItem = (index, field, value) => {
    const updated = [...bulkItems];
    updated[index][field] = value;
    setBulkItems(updated);
  };

  const calculateBulkTotal = () => {
    return bulkItems.reduce((total, item) => {
      if (item.amount) {
        const itemCalc = calculateGST(item.amount, item.gstRate, taxType);
        return {
          actualAmount: total.actualAmount + itemCalc.actualAmount,
          gstAmount: total.gstAmount + itemCalc.gstAmount,
          totalAmount: total.totalAmount + itemCalc.totalAmount
        };
      }
      return total;
    }, { actualAmount: 0, gstAmount: 0, totalAmount: 0 });
  };

  const clearAll = () => {
    setAmount('');
    setDescription('');
    setResults({ actualAmount: 0, gstAmount: 0, totalAmount: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `float ${10 + Math.random() * 20}s linear infinite`
            }}
          >
            {i % 3 === 0 ? (
              <Calculator size={40 + Math.random() * 40} className="text-white" />
            ) : i % 3 === 1 ? (
              <Percent size={30 + Math.random() * 30} className="text-white" />
            ) : (
              <div className="text-white text-4xl font-thin">%</div>
            )}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto pt-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white">
            Star Furniture GST Calculator </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
          A professional GST calculator tailored for furniture shops — supports bulk pricing, tax-inclusive/exclusive calculations, history tracking, and easy export.          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-6 bg-white/10 rounded-xl p-1 backdrop-blur-sm max-w-2xl mx-auto">
          {['single', 'bulk', 'history', 'saved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg mx-1 mb-1 transition-all text-sm sm:text-base ${
                activeTab === tab 
                  ? 'bg-white text-blue-700 font-semibold shadow-md' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {tab === 'single' && 'Single Item'}
              {tab === 'bulk' && 'Bulk Mode'}
              {tab === 'history' && 'History'}
              {tab === 'saved' && 'Saved'}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6 transition-all duration-300 transform hover:shadow-xl">
          {/* Single Item Calculator */}
          {activeTab === 'single' && (
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Currency</label>
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none appearance-none bg-white"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {currency === 'INR' && <IndianRupee size={18} className="text-gray-500" />}
                      {currency === 'USD' && <DollarSign size={18} className="text-gray-500" />}
                      {currency === 'EUR' && <Euro size={18} className="text-gray-500" />}
                      {currency === 'GBP' && <PoundSterling size={18} className="text-gray-500" />}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Description (Optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Item description"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Main Calculator Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currencySymbols[currency]}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onBlur={addToHistory}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-2 border-2 border-gray-200 rounded-lg text-lg focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">GST Rate</label>
                  <select
                    value={isCustomRate ? 'custom' : gstRate}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomRate(true);
                        setGstRate('custom');
                      } else {
                        setIsCustomRate(false);
                        setGstRate(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-lg focus:border-blue-500 focus:outline-none mb-2"
                  >
                    {gstRates.map(rate => (
                      <option key={rate.value} value={rate.value}>{rate.label}</option>
                    ))}
                  </select>
                  
                  {isCustomRate && (
                    <div className="relative">
                      <input
                        type="number"
                        value={customGstRate}
                        onChange={(e) => setCustomGstRate(e.target.value)}
                        placeholder="Enter custom GST rate"
                        className="w-full pl-4 pr-8 py-2 border-2 border-orange-300 rounded-lg text-lg focus:border-orange-500 focus:outline-none transition-colors"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Tax Type</label>
                  <select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Exclusive">Exclusive (Add GST)</option>
                    <option value="Inclusive">Inclusive (GST included)</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-1">
                    {taxType === 'Exclusive' ? 
                      'GST will be added to the base amount' : 
                      'GST is already included in the amount'
                    }
                  </p>
                </div>
              </div>

              {/* Results Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                      {currencySymbols[currency]}{results.actualAmount.toLocaleString()}
                    </div>
                    <div className="text-blue-600 font-medium text-sm">Base Amount</div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                      {currencySymbols[currency]}{results.gstAmount.toLocaleString()}
                    </div>
                    <div className="text-green-600 font-medium text-sm">GST Amount</div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                      {currencySymbols[currency]}{results.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-blue-600 font-medium text-sm">Total Amount</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => copyToClipboard(generateInvoiceText())}
                  className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all ${isAnimating ? 'animate-pulse' : ''}`}
                >
                  <Copy size={16} /> Copy Details
                </button>
                <button
                  onClick={downloadAsText}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  <Download size={16} /> Download
                </button>
                <button
                  onClick={saveCalculation}
                  className={`flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all ${isAnimating ? 'animate-bounce' : ''}`}
                >
                  <Save size={16} /> Save
                </button>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  <Trash2 size={16} /> Clear
                </button>
              </div>
            </div>
          )}

          {/* Bulk Calculator */}
          {activeTab === 'bulk' && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} /> Bulk GST Calculator
              </h2>
              
              <div className="space-y-3 mb-6">
                {bulkItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateBulkItem(index, 'description', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        {currencySymbols[currency]}
                      </span>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => updateBulkItem(index, 'amount', e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={item.gstRate}
                        onChange={(e) => updateBulkItem(index, 'gstRate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm appearance-none"
                      >
                        {gstRates.slice(0, -1).map(rate => (
                          <option key={rate.value} value={rate.value}>{rate.value}%</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Percent size={14} className="text-gray-500" />
                      </div>
                    </div>
                    <button
                      onClick={() => removeBulkItem(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={addBulkItem}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>

              {/* Bulk Results */}
              {bulkItems.some(item => item.amount) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Bulk Total Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-xl font-bold text-gray-800">
                        {currencySymbols[currency]}{calculateBulkTotal().actualAmount.toLocaleString()}
                      </div>
                      <div className="text-blue-600 font-medium text-xs">Total Base Amount</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-xl font-bold text-green-600">
                        {currencySymbols[currency]}{calculateBulkTotal().gstAmount.toLocaleString()}
                      </div>
                      <div className="text-green-600 font-medium text-xs">Total GST Amount</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-xl font-bold text-blue-600">
                        {currencySymbols[currency]}{calculateBulkTotal().totalAmount.toLocaleString()}
                      </div>
                      <div className="text-blue-600 font-medium text-xs">Grand Total</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <History size={20} /> Calculation History
              </h2>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Calculator size={40} className="mx-auto" />
                  </div>
                  <p className="text-gray-500">No calculations yet</p>
                  <p className="text-gray-400 text-sm mt-1">Your calculations will appear here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {history.map((calc) => (
                    <div key={calc.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {calc.description || 'Unnamed calculation'}
                          </p>
                          <p className="text-xs text-gray-500">{calc.timestamp}</p>
                        </div>
                        <button
                          onClick={() => loadCalculation(calc)}
                          className="text-blue-500 hover:text-blue-700 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
                        >
                          Load
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div>
                          <span className="font-medium">Amount:</span> {currencySymbols[calc.currency]}{calc.amount.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">GST:</span> {calc.gstRate}%
                        </div>
                        <div>
                          <span className="font-medium">Total:</span> {currencySymbols[calc.currency]}{calc.results.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Tab */}
          {activeTab === 'saved' && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Save size={20} /> Saved Calculations
              </h2>
              {savedCalculations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <FileText size={40} className="mx-auto" />
                  </div>
                  <p className="text-gray-500">No saved calculations</p>
                  <p className="text-gray-400 text-sm mt-1">Save your calculations to access them later</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {savedCalculations.map((calc) => (
                    <div key={calc.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                            {calc.name}
                          </p>
                          <p className="text-xs text-gray-500">{calc.timestamp}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadCalculation(calc)}
                            className="text-blue-500 hover:text-blue-700 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => setSavedCalculations(prev => prev.filter(s => s.id !== calc.id))}
                            className="text-red-500 hover:text-red-700 text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div>
                          <span className="font-medium">Amount:</span> {currencySymbols[calc.currency]}{calc.amount.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">GST:</span> {calc.gstRate}%
                        </div>
                        <div>
                          <span className="font-medium">Total:</span> {currencySymbols[calc.currency]}{calc.results.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-blue-100 text-sm mt-8 pb-4">
        <p>Advanced GST Calculator © Star Furniture {new Date().getFullYear()}</p>
      </div>

      {/* Global Styles for Animation */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
 
"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ArrowRight, RefreshCw, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Product {
  name: string;
}

interface Customer {
  name: string;
}

interface LedgerEntry {
  ledger_id: number;
  sale_id: number;
  purchase_id: number;
  quantity: string;
  cost_price: string;
}

interface Sale {
  sale_id: number;
  product_id: number;
  customer_id: number;
  quantity: string;
  selling_price: string;
  sale_date: string;
  Product: Product;
  Customer: Customer;
  ledgerEntries: LedgerEntry[];
}

interface ApiResponse {
  success: boolean;
  data: Sale[];
}

export default function StockLedgerPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stock ledger data
  const fetchStockLedger = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3005/api/stock-ledger/all');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setSales(data.data);
      } else {
        throw new Error('Failed to fetch stock ledger data');
      }
    } catch (err) {
      console.error('Error fetching stock ledger:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stock ledger data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStockLedger();
  }, []);

  const filteredSales = sales.filter(
    (sale) =>
      sale.Customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.Product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.sale_id.toString().includes(searchTerm.toLowerCase()),
  );

  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalQuantity = (ledgerEntries: LedgerEntry[]) => {
    return ledgerEntries.reduce((total, entry) => total + parseInt(entry.quantity), 0);
  };

  // Calculate profit for a single ledger entry
  const calculateEntryProfit = (entry: LedgerEntry, sellingPrice: string) => {
    const quantity = parseFloat(entry.quantity);
    const costPrice = parseFloat(entry.cost_price);
    const sellingPriceNum = parseFloat(sellingPrice);
    return (sellingPriceNum - costPrice) * quantity;
  };

  // Calculate total cost for a sale
  const calculateSaleTotalCost = (ledgerEntries: LedgerEntry[]) => {
    return ledgerEntries.reduce((total, entry) => {
      return total + (parseFloat(entry.quantity) * parseFloat(entry.cost_price));
    }, 0);
  };

  // Calculate total revenue for a sale
  const calculateSaleTotalRevenue = (sale: Sale) => {
    return parseFloat(sale.quantity) * parseFloat(sale.selling_price);
  };

  // Calculate total profit for a sale
  const calculateSaleTotalProfit = (sale: Sale) => {
    const totalCost = calculateSaleTotalCost(sale.ledgerEntries);
    const totalRevenue = calculateSaleTotalRevenue(sale);
    return totalRevenue - totalCost;
  };

  // Calculate overall totals
  const calculateOverallTotals = () => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    sales.forEach(sale => {
      const saleRevenue = calculateSaleTotalRevenue(sale);
      const saleCost = calculateSaleTotalCost(sale.ledgerEntries);
      const saleProfit = saleRevenue - saleCost;

      totalRevenue += saleRevenue;
      totalCost += saleCost;
      totalProfit += saleProfit;
    });

    return { totalRevenue, totalCost, totalProfit };
  };

  const overallTotals = calculateOverallTotals();

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Ledger</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">FIFO tracking for all sales transactions</p>
        </div>
        <Button
          onClick={fetchStockLedger}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Profit Summary */}
      {sales.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ${overallTotals.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Cost</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    ${overallTotals.totalCost.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`${overallTotals.totalProfit >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Profit</p>
                  <p className={`text-2xl font-bold ${overallTotals.totalProfit >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}>
                    ${overallTotals.totalProfit.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${overallTotals.totalProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error: {error}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchStockLedger}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">
              FIFO Stock Movement
              {loading && <span className="ml-2 text-sm text-gray-500">(Loading...)</span>}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ledger..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                  disabled={loading}
                />
              </div>
              <Button variant="outline" size="sm" disabled={loading}>
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading stock ledger data...</span>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No stock ledger data available</p>
              <Button 
                variant="outline" 
                onClick={fetchStockLedger}
                className="mt-2"
              >
                Refresh
              </Button>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {filteredSales.map((sale) => {
                const saleRevenue = calculateSaleTotalRevenue(sale);
                const saleCost = calculateSaleTotalCost(sale.ledgerEntries);
                const saleProfit = calculateSaleTotalProfit(sale);
                
                return (
                  <div key={sale.sale_id} className="border border-gray-200 dark:border-gray-700 rounded-lg w-full">
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => toggleRowExpansion(sale.sale_id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="font-mono text-xs">
                            SALE{sale.sale_id}
                          </Badge>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{sale.Product.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {sale.Customer.name} • {sale.quantity} units • {formatDate(sale.sale_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {sale.ledgerEntries.length} batches
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                              Revenue: ${saleRevenue.toFixed(2)}
                            </p>
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">
                              Cost: ${saleCost.toFixed(2)}
                            </p>
                            <p className={`text-sm font-bold ${saleProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                              Profit: ${saleProfit.toFixed(2)}
                            </p>
                          </div>
                          <ArrowRight
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              expandedRows.includes(sale.sale_id) ? "rotate-90" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {expandedRows.includes(sale.sale_id) && (
                      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 dark:text-white">FIFO Breakdown:</h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Total Ledger Quantity: {calculateTotalQuantity(sale.ledgerEntries)} units
                            </div>
                          </div>
                          <div className="w-full overflow-x-auto">
                            <Table className="w-full">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs">Ledger ID</TableHead>
                                  <TableHead className="text-xs">Sale ID</TableHead>
                                  <TableHead className="text-xs">Purchase ID</TableHead>
                                  <TableHead className="text-xs">Quantity</TableHead>
                                  <TableHead className="text-xs">Cost Price</TableHead>
                                  <TableHead className="text-xs">Selling Price</TableHead>
                                  <TableHead className="text-xs">Total Cost</TableHead>
                                  <TableHead className="text-xs">Total Revenue</TableHead>
                                  <TableHead className="text-xs">Profit</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sale.ledgerEntries.map((entry) => {
                                  const entryCost = parseFloat(entry.quantity) * parseFloat(entry.cost_price);
                                  const entryRevenue = parseFloat(entry.quantity) * parseFloat(sale.selling_price);
                                  const entryProfit = entryRevenue - entryCost;
                                  
                                  return (
                                    <TableRow key={entry.ledger_id}>
                                      <TableCell className="font-mono text-xs">{entry.ledger_id}</TableCell>
                                      <TableCell className="font-mono text-xs">{entry.sale_id}</TableCell>
                                      <TableCell className="font-mono text-xs">{entry.purchase_id}</TableCell>
                                      <TableCell className="text-xs">{entry.quantity}</TableCell>
                                      <TableCell className="text-xs">${parseFloat(entry.cost_price).toFixed(2)}</TableCell>
                                      <TableCell className="text-xs">${parseFloat(sale.selling_price).toFixed(2)}</TableCell>
                                      <TableCell className="text-xs text-red-600 dark:text-red-400">${entryCost.toFixed(2)}</TableCell>
                                      <TableCell className="text-xs text-green-600 dark:text-green-400">${entryRevenue.toFixed(2)}</TableCell>
                                      <TableCell className={`text-xs font-medium ${entryProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                        ${entryProfit.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              <strong>Summary:</strong> Sale #{sale.sale_id} used {sale.ledgerEntries.length} purchase batches 
                              to fulfill {sale.quantity} units. Total Revenue: ${saleRevenue.toFixed(2)}, 
                              Total Cost: ${saleCost.toFixed(2)}, 
                              <span className={saleProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}>
                                {' '}Net Profit: ${saleProfit.toFixed(2)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
